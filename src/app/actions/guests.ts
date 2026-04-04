"use server";

import prisma from "@/lib/prisma";
import { guestSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createGuest(formData: FormData) {
    const raw = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: (formData.get("email") as string) || "",
        phoneNumber: formData.get("phoneNumber") as string,
        address: (formData.get("address") as string) || undefined,
    };

    const parsed = guestSchema.safeParse(raw);
    if (!parsed.success) {
        return { success: false, error: parsed.error.flatten().fieldErrors };
    }

    await prisma.guest.create({
        data: {
            ...parsed.data,
            email: parsed.data.email || null,
        },
    });
    revalidatePath("/admin/guests");
    return { success: true };
}

export async function updateGuest(id: string, formData: FormData) {
    const raw = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: (formData.get("email") as string) || "",
        phoneNumber: formData.get("phoneNumber") as string,
        address: (formData.get("address") as string) || undefined,
    };

    const parsed = guestSchema.safeParse(raw);
    if (!parsed.success) {
        return { success: false, error: parsed.error.flatten().fieldErrors };
    }

    await prisma.guest.update({
        where: { id },
        data: {
            ...parsed.data,
            email: parsed.data.email || null,
        },
    });
    revalidatePath("/admin/guests");
    return { success: true };
}

export async function deleteGuest(id: string) {
    const bookingCount = await prisma.booking.count({ where: { guestId: id } });
    if (bookingCount > 0) {
        return { success: false, error: "This guest has booking records. Cannot delete." };
    }
    await prisma.guest.delete({ where: { id } });
    revalidatePath("/admin/guests");
    return { success: true };
}
