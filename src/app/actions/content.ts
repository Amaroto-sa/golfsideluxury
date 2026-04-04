"use server";

import prisma from "@/lib/prisma";
import { amenitySchema, rulePolicySchema, socialLinkSchema } from "@/lib/validations";
import { deleteImage } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

// ─── Amenities ───────────────────────────────────────────────────
export async function createAmenity(formData: FormData) {
    const parsed = amenitySchema.safeParse({
        name: formData.get("name") as string,
        icon: (formData.get("icon") as string) || undefined,
    });
    if (!parsed.success) return { success: false, error: parsed.error.flatten().fieldErrors };
    await prisma.amenity.create({ data: parsed.data });
    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true };
}

export async function deleteAmenity(id: string) {
    await prisma.amenity.delete({ where: { id } });
    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true };
}

// ─── Rules / Policies ────────────────────────────────────────────
export async function createRulePolicy(formData: FormData) {
    const parsed = rulePolicySchema.safeParse({
        title: formData.get("title") as string,
        content: formData.get("content") as string,
        order: Number(formData.get("order")) || 0,
    });
    if (!parsed.success) return { success: false, error: parsed.error.flatten().fieldErrors };
    await prisma.rulePolicy.create({ data: parsed.data });
    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true };
}

export async function deleteRulePolicy(id: string) {
    await prisma.rulePolicy.delete({ where: { id } });
    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true };
}

// ─── Social Links ────────────────────────────────────────────────
export async function createSocialLink(formData: FormData) {
    const parsed = socialLinkSchema.safeParse({
        platform: formData.get("platform") as string,
        url: formData.get("url") as string,
        icon: (formData.get("icon") as string) || undefined,
    });
    if (!parsed.success) return { success: false, error: parsed.error.flatten().fieldErrors };
    await prisma.socialLink.create({ data: parsed.data });
    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true };
}

export async function deleteSocialLink(id: string) {
    await prisma.socialLink.delete({ where: { id } });
    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true };
}

// ─── Gallery Images (Cloudinary-powered) ─────────────────────────
export async function createGalleryImage(
    url: string,
    publicId: string,
    title?: string,
    width?: number,
    height?: number
) {
    const maxOrder = await prisma.galleryImage.aggregate({ _max: { order: true } });
    const nextOrder = (maxOrder._max.order || 0) + 1;

    await prisma.galleryImage.create({
        data: {
            url,
            publicId,
            title: title || null,
            width: width || null,
            height: height || null,
            order: nextOrder,
        },
    });
    revalidatePath("/admin/settings");
    revalidatePath("/gallery");
    revalidatePath("/");
    return { success: true };
}

export async function deleteGalleryImage(id: string) {
    const image = await prisma.galleryImage.findUnique({ where: { id } });

    // Delete from Cloudinary if publicId exists
    if (image?.publicId) {
        await deleteImage(image.publicId);
    }

    await prisma.galleryImage.delete({ where: { id } });
    revalidatePath("/admin/settings");
    revalidatePath("/gallery");
    return { success: true };
}

// ─── Room Cover Image ────────────────────────────────────────────
export async function updateRoomCategoryCoverImage(
    categoryId: string,
    url: string,
    publicId: string
) {
    const category = await prisma.roomCategory.findUnique({ where: { id: categoryId } });

    // Delete old cover from Cloudinary
    if (category?.coverImagePublicId) {
        await deleteImage(category.coverImagePublicId);
    }

    await prisma.roomCategory.update({
        where: { id: categoryId },
        data: { coverImage: url, coverImagePublicId: publicId },
    });

    revalidatePath("/admin/rooms");
    revalidatePath("/rooms");
    revalidatePath("/");
    return { success: true };
}

export async function removeRoomCategoryCoverImage(categoryId: string) {
    const category = await prisma.roomCategory.findUnique({ where: { id: categoryId } });

    if (category?.coverImagePublicId) {
        await deleteImage(category.coverImagePublicId);
    }

    await prisma.roomCategory.update({
        where: { id: categoryId },
        data: { coverImage: null, coverImagePublicId: null },
    });

    revalidatePath("/admin/rooms");
    revalidatePath("/rooms");
    revalidatePath("/");
    return { success: true };
}

// ─── Notifications ───────────────────────────────────────────────
export async function markNotificationRead(id: string) {
    await prisma.notification.update({
        where: { id },
        data: { isRead: true },
    });
    revalidatePath("/admin");
}

export async function markAllRead() {
    await prisma.notification.updateMany({
        where: { isRead: false },
        data: { isRead: true },
    });
    revalidatePath("/admin");
}
