"use server";

import prisma from "@/lib/prisma";
import { hotelSettingsSchema } from "@/lib/validations";
import { deleteImage } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

export async function updateHotelSettings(formData: FormData) {
    const raw = {
        hotelName: formData.get("hotelName") as string,
        phoneNumber: formData.get("phoneNumber") as string,
        email: formData.get("email") as string,
        address: formData.get("address") as string,
        checkInTime: formData.get("checkInTime") as string,
        checkOutTime: formData.get("checkOutTime") as string,
        aboutText: formData.get("aboutText") as string,
        bookingPolicy: formData.get("bookingPolicy") as string,
        emailNotificationTemplate: formData.get("emailNotificationTemplate") as string,
    };

    const parsed = hotelSettingsSchema.safeParse(raw);
    if (!parsed.success) {
        return { success: false, error: parsed.error.flatten().fieldErrors };
    }

    const data = parsed.data;
    const existing = await prisma.hotelSettings.findFirst();

    if (existing) {
        await prisma.hotelSettings.update({
            where: { id: existing.id },
            data,
        });
    } else {
        await prisma.hotelSettings.create({ data });
    }

    revalidatePath("/");
    revalidatePath("/rooms");
    revalidatePath("/contact");
    revalidatePath("/gallery");
    return { success: true };
}

// ─── Logo Upload ─────────────────────────────────────────────────
export async function updateLogo(url: string, publicId: string) {
    const existing = await prisma.hotelSettings.findFirst();
    if (!existing) return { success: false };

    // Delete old logo from Cloudinary if it exists
    if (existing.logoPublicId) {
        await deleteImage(existing.logoPublicId);
    }

    await prisma.hotelSettings.update({
        where: { id: existing.id },
        data: { logoUrl: url, logoPublicId: publicId },
    });

    revalidatePath("/");
    return { success: true };
}

export async function removeLogo() {
    const existing = await prisma.hotelSettings.findFirst();
    if (!existing) return { success: false };

    if (existing.logoPublicId) {
        await deleteImage(existing.logoPublicId);
    }

    await prisma.hotelSettings.update({
        where: { id: existing.id },
        data: { logoUrl: null, logoPublicId: null },
    });

    revalidatePath("/");
    return { success: true };
}

// ─── Favicon Upload ──────────────────────────────────────────────
export async function updateFavicon(url: string, publicId: string) {
    const existing = await prisma.hotelSettings.findFirst();
    if (!existing) return { success: false };

    if (existing.faviconPublicId) {
        await deleteImage(existing.faviconPublicId);
    }

    await prisma.hotelSettings.update({
        where: { id: existing.id },
        data: { faviconUrl: url, faviconPublicId: publicId },
    });

    revalidatePath("/");
    return { success: true };
}

export async function removeFavicon() {
    const existing = await prisma.hotelSettings.findFirst();
    if (!existing) return { success: false };

    if (existing.faviconPublicId) {
        await deleteImage(existing.faviconPublicId);
    }

    await prisma.hotelSettings.update({
        where: { id: existing.id },
        data: { faviconUrl: null, faviconPublicId: null },
    });

    revalidatePath("/");
    return { success: true };
}

// ─── Hero Image Upload ──────────────────────────────────────────
export async function updateHeroImage(url: string, publicId: string) {
    const existing = await prisma.hotelSettings.findFirst();
    if (!existing) return { success: false };

    if (existing.homepageHeroPublicId) {
        await deleteImage(existing.homepageHeroPublicId);
    }

    await prisma.hotelSettings.update({
        where: { id: existing.id },
        data: { homepageHero: url, homepageHeroPublicId: publicId },
    });

    revalidatePath("/");
    return { success: true };
}

export async function removeHeroImage() {
    const existing = await prisma.hotelSettings.findFirst();
    if (!existing) return { success: false };

    if (existing.homepageHeroPublicId) {
        await deleteImage(existing.homepageHeroPublicId);
    }

    await prisma.hotelSettings.update({
        where: { id: existing.id },
        data: { homepageHero: null, homepageHeroPublicId: null },
    });

    revalidatePath("/");
    return { success: true };
}
