"use server";

import prisma from "@/lib/prisma";
import { roomCategorySchema, roomSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

// ─── Room Categories ─────────────────────────────────────────────
export async function createRoomCategory(formData: FormData): Promise<void> {
    const raw = {
        name: formData.get("name") as string,
        description: (formData.get("description") as string) || undefined,
        price: Number(formData.get("price")),
        coverImage: (formData.get("coverImage") as string) || undefined,
    };

    const parsed = roomCategorySchema.safeParse(raw);
    if (!parsed.success) {
        return;
    }

    await prisma.roomCategory.create({ data: parsed.data });
    revalidatePath("/admin/rooms");
    revalidatePath("/rooms");
}

export async function updateRoomCategory(id: string, formData: FormData): Promise<void> {
    const raw = {
        name: formData.get("name") as string,
        description: (formData.get("description") as string) || undefined,
        price: Number(formData.get("price")),
        coverImage: (formData.get("coverImage") as string) || undefined,
    };

    const parsed = roomCategorySchema.safeParse(raw);
    if (!parsed.success) {
        return;
    }

    await prisma.roomCategory.update({ where: { id }, data: parsed.data });
    revalidatePath("/admin/rooms");
    revalidatePath("/rooms");
}

export async function deleteRoomCategory(id: string): Promise<void> {
    const count = await prisma.room.count({ where: { categoryId: id } });
    if (count > 0) {
        return; // Has rooms — refuse silently
    }
    await prisma.roomCategory.delete({ where: { id } });
    revalidatePath("/admin/rooms");
}

// ─── Rooms ───────────────────────────────────────────────────────
export async function createRoom(formData: FormData): Promise<void> {
    const raw = {
        roomNumber: formData.get("roomNumber") as string,
        categoryId: formData.get("categoryId") as string,
        status: (formData.get("status") as string) || "AVAILABLE",
    };

    const parsed = roomSchema.safeParse(raw);
    if (!parsed.success) {
        return;
    }

    // Check for unique room number
    const existing = await prisma.room.findUnique({ where: { roomNumber: parsed.data.roomNumber } });
    if (existing) {
        return; // Duplicate — refuse silently
    }

    await prisma.room.create({ data: parsed.data });
    revalidatePath("/admin/rooms");
}

export async function updateRoom(id: string, formData: FormData): Promise<void> {
    const status = formData.get("status") as string;
    const categoryId = formData.get("categoryId") as string;
    const roomNumber = formData.get("roomNumber") as string;

    const data: any = {};
    if (status) data.status = status;
    if (categoryId) data.categoryId = categoryId;
    if (roomNumber) data.roomNumber = roomNumber;

    if (Object.keys(data).length > 0) {
        await prisma.room.update({
            where: { id },
            data,
        });
    }
    revalidatePath("/admin/rooms");
}

export async function deleteRoom(id: string): Promise<void> {
    const activeBookings = await prisma.booking.count({
        where: { roomId: id, status: { in: ["PENDING", "CONFIRMED"] } },
    });
    if (activeBookings > 0) {
        return; // Has active bookings — refuse silently
    }
    await prisma.room.delete({ where: { id } });
    revalidatePath("/admin/rooms");
}
