"use server";

import prisma from "@/lib/prisma";
import { roomCategorySchema, roomSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

// ─── Room Categories ─────────────────────────────────────────────
export async function createRoomCategory(formData: FormData) {
    const raw = {
        name: formData.get("name") as string,
        description: (formData.get("description") as string) || undefined,
        price: Number(formData.get("price")),
        coverImage: (formData.get("coverImage") as string) || undefined,
    };

    const parsed = roomCategorySchema.safeParse(raw);
    if (!parsed.success) {
        return { success: false, error: parsed.error.flatten().fieldErrors };
    }

    await prisma.roomCategory.create({ data: parsed.data });
    revalidatePath("/admin/rooms");
    revalidatePath("/rooms");
    return { success: true };
}

export async function updateRoomCategory(id: string, formData: FormData) {
    const raw = {
        name: formData.get("name") as string,
        description: (formData.get("description") as string) || undefined,
        price: Number(formData.get("price")),
        coverImage: (formData.get("coverImage") as string) || undefined,
    };

    const parsed = roomCategorySchema.safeParse(raw);
    if (!parsed.success) {
        return { success: false, error: parsed.error.flatten().fieldErrors };
    }

    await prisma.roomCategory.update({ where: { id }, data: parsed.data });
    revalidatePath("/admin/rooms");
    revalidatePath("/rooms");
    return { success: true };
}

export async function deleteRoomCategory(id: string) {
    // Check if rooms still exist in category
    const count = await prisma.room.count({ where: { categoryId: id } });
    if (count > 0) {
        return { success: false, error: "Remove all rooms from this category first." };
    }
    await prisma.roomCategory.delete({ where: { id } });
    revalidatePath("/admin/rooms");
    return { success: true };
}

// ─── Rooms ───────────────────────────────────────────────────────
export async function createRoom(formData: FormData) {
    const raw = {
        roomNumber: formData.get("roomNumber") as string,
        categoryId: formData.get("categoryId") as string,
        status: (formData.get("status") as string) || "AVAILABLE",
    };

    const parsed = roomSchema.safeParse(raw);
    if (!parsed.success) {
        return { success: false, error: parsed.error.flatten().fieldErrors };
    }

    // Check for unique room number
    const existing = await prisma.room.findUnique({ where: { roomNumber: parsed.data.roomNumber } });
    if (existing) {
        return { success: false, error: { roomNumber: ["This room number already exists"] } };
    }

    await prisma.room.create({ data: parsed.data });
    revalidatePath("/admin/rooms");
    return { success: true };
}

export async function updateRoom(id: string, formData: FormData) {
    const status = formData.get("status") as string;
    const categoryId = formData.get("categoryId") as string;

    await prisma.room.update({
        where: { id },
        data: { status: status as any, categoryId },
    });
    revalidatePath("/admin/rooms");
    return { success: true };
}

export async function deleteRoom(id: string) {
    // Check if room has active bookings
    const activeBookings = await prisma.booking.count({
        where: { roomId: id, status: { in: ["PENDING", "CONFIRMED"] } },
    });
    if (activeBookings > 0) {
        return { success: false, error: "This room has active bookings. Cancel them first." };
    }
    await prisma.room.delete({ where: { id } });
    revalidatePath("/admin/rooms");
    return { success: true };
}
