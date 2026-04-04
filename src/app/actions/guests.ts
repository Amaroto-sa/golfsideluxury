"use server";

import prisma from "@/lib/prisma";
import { guestSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createGuest(formData: FormData): Promise<void> {
    const raw = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: (formData.get("email") as string) || "",
        phoneNumber: formData.get("phoneNumber") as string,
        address: (formData.get("address") as string) || undefined,
    };

    const parsed = guestSchema.safeParse(raw);
    if (!parsed.success) {
        return;
    }

    await prisma.guest.create({
        data: {
            ...parsed.data,
            email: parsed.data.email || null,
        },
    });
    revalidatePath("/admin/guests");
}

export async function updateGuest(id: string, formData: FormData): Promise<void> {
    const raw = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: (formData.get("email") as string) || "",
        phoneNumber: formData.get("phoneNumber") as string,
        address: (formData.get("address") as string) || undefined,
    };

    const parsed = guestSchema.safeParse(raw);
    if (!parsed.success) {
        return;
    }

    await prisma.guest.update({
        where: { id },
        data: {
            ...parsed.data,
            email: parsed.data.email || null,
        },
    });
    revalidatePath("/admin/guests");
}

export async function deleteGuest(id: string): Promise<void> {
    const bookingCount = await prisma.booking.count({ where: { guestId: id } });
    if (bookingCount > 0) {
        return; // Silently refuse — has booking records
    }
    await prisma.guest.delete({ where: { id } });
    revalidatePath("/admin/guests");
}
