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
    const amountPaid = data.bookingType === "reservation" ? totalAmount / 2 : totalAmount;

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
            paymentStatus: data.bookingType === "reservation" ? "PARTIAL" : "PENDING",
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

    revalidatePath("/admin/bookings");
    revalidatePath("/admin");
}

export async function updatePaymentStatus(bookingId: string, paymentStatus: string) {
    await prisma.booking.update({
        where: { id: bookingId },
        data: { paymentStatus: paymentStatus as any },
    });
    revalidatePath("/admin/bookings");
}
