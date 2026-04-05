"use server";

import prisma from "@/lib/prisma";
import { bookingSchema } from "@/lib/validations";
import { createNotification } from "@/lib/notifications";
import { revalidatePath } from "next/cache";

export async function createBooking(formData: FormData) {
    const raw = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: (formData.get("email") as string) || "",
        phoneNumber: formData.get("phoneNumber") as string,
        categoryId: formData.get("categoryId") as string,
        roomId: (formData.get("roomId") as string) || undefined,
        checkIn: formData.get("checkIn") as string,
        checkOut: formData.get("checkOut") as string,
        adults: Number(formData.get("adults")) || 1,
        bookingType: formData.get("bookingType") as "reservation" | "full",
    };

    const parsed = bookingSchema.safeParse(raw);
    if (!parsed.success) {
        return { success: false, error: parsed.error.flatten().fieldErrors };
    }

    const data = parsed.data;

    // Get room category price
    const category = await prisma.roomCategory.findUnique({
        where: { id: data.categoryId },
    });
    if (!category) {
        return { success: false, error: { categoryId: ["Invalid room category"] } };
    }

    // Check room clash if specific room is selected
    if (data.roomId) {
        const clash = await prisma.booking.findFirst({
            where: {
                roomId: data.roomId,
                status: { in: ["PENDING", "CONFIRMED"] },
                OR: [
                    { checkIn: { lte: new Date(data.checkOut) }, checkOut: { gte: new Date(data.checkIn) } },
                ],
            },
        });
        if (clash) {
            return { success: false, error: { roomId: ["This room is already booked for these dates"] } };
        }
    }

    const totalAmount = Number(category.price);
    // All new bookings originate as unpaid (amountPaid = 0) since there's no live payment gateway.
    const amountPaid = 0;

    // Upsert guest
    let guest = await prisma.guest.findFirst({
        where: { phoneNumber: data.phoneNumber },
    });

    if (!guest) {
        guest = await prisma.guest.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email || null,
                phoneNumber: data.phoneNumber,
            },
        });
    }

    const booking = await prisma.booking.create({
        data: {
            guestId: guest.id,
            roomId: data.roomId || null,
            checkIn: new Date(data.checkIn),
            checkOut: new Date(data.checkOut),
            adults: data.adults,
            status: "PENDING",
            paymentStatus: "PENDING",
            totalAmount,
            amountPaid,
        },
    });

    // Create dashboard notification
    await createNotification({
        title: "New Booking Request",
        message: `${data.firstName} ${data.lastName} submitted a ${data.bookingType} for ${category.name} room.`,
        type: "BOOKING",
        linkUrl: `/admin/bookings`,
    });

    // Send email notification (must be awaited on Vercel so the function doesn't freeze)
    const fullBookingData = await prisma.booking.findUnique({
        where: { id: booking.id },
        include: { guest: true, room: { include: { category: true } } }
    });

    if (fullBookingData) {
        try {
            const { sendBookingNotificationEmail } = await import("@/lib/email");
            await sendBookingNotificationEmail(fullBookingData);
        } catch (error) {
            console.error("Failed to send email during booking creation:", error);
        }
    }

    revalidatePath("/admin");
    revalidatePath("/admin/bookings");

    return { success: true, bookingId: booking.id };
}

export async function updateBookingStatus(bookingId: string, status: string) {
    await prisma.booking.update({
        where: { id: bookingId },
        data: { status: status as any },
    });

    // If confirmed, mark associated room as occupied
    if (status === "CONFIRMED") {
        const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
        if (booking?.roomId) {
            await prisma.room.update({
                where: { id: booking.roomId },
                data: { status: "OCCUPIED" },
            });
        }
    }

    // If completed or cancelled, mark room available again
    if (status === "COMPLETED" || status === "CANCELLED") {
        const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
        if (booking?.roomId) {
            await prisma.room.update({
                where: { id: booking.roomId },
                data: { status: "AVAILABLE" },
            });
        }
    }

    // If cancelled, wipe the payment record since they obviously didn't pay (or it was refunded)
    if (status === "CANCELLED") {
        await prisma.booking.update({
            where: { id: bookingId },
            data: { amountPaid: 0, paymentStatus: "PENDING" },
        });
    }

    revalidatePath("/admin/bookings");
    revalidatePath("/admin");
}

export async function updatePaymentStatus(bookingId: string, paymentStatus: string) {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) return;

    let amountPaid = booking.amountPaid;
    if (paymentStatus === "COMPLETED") {
        amountPaid = booking.totalAmount;
    } else if (paymentStatus === "PARTIAL") {
        amountPaid = new prisma.Decimal(Number(booking.totalAmount) / 2);
    } else if (paymentStatus === "PENDING" || paymentStatus === "REFUNDED") {
        amountPaid = new prisma.Decimal(0);
    }

    await prisma.booking.update({
        where: { id: bookingId },
        data: { paymentStatus: paymentStatus as any, amountPaid },
    });
    revalidatePath("/admin/bookings");
}

export async function deleteBooking(bookingId: string) {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (booking?.roomId && booking.status === "CONFIRMED") {
        await prisma.room.update({
            where: { id: booking.roomId },
            data: { status: "AVAILABLE" },
        });
    }
    await prisma.booking.delete({ where: { id: bookingId } });
    revalidatePath("/admin/bookings");
    revalidatePath("/admin");
}

export async function updateBookingDetails(id: string, formData: FormData) {
    const checkIn = formData.get("checkIn") as string;
    const checkOut = formData.get("checkOut") as string;
    const adults = Number(formData.get("adults"));
    const roomId = formData.get("roomId") as string;

    const data: any = {};
    if (checkIn) data.checkIn = new Date(checkIn);
    if (checkOut) data.checkOut = new Date(checkOut);
    if (adults) data.adults = adults;
    if (roomId) data.roomId = roomId === "unassigned" ? null : roomId;

    if (data.roomId) {
        // check overlap logic if room is assigned
        const b = await prisma.booking.findUnique({ where: { id } });
        const start = data.checkIn || b?.checkIn;
        const end = data.checkOut || b?.checkOut;

        const clash = await prisma.booking.findFirst({
            where: {
                roomId: data.roomId,
                id: { not: id },
                status: { in: ["PENDING", "CONFIRMED"] },
                OR: [
                    { checkIn: { lte: end }, checkOut: { gte: start } },
                ],
            },
        });

        if (clash) {
            throw new Error("Date clash on this specific room.");
        }
    }

    await prisma.booking.update({
        where: { id },
        data,
    });
    revalidatePath("/admin/bookings");
}
