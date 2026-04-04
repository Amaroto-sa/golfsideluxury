"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTestimonial(formData: FormData) {
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const content = formData.get("content") as string;
    const rating = parseInt(formData.get("rating") as string);
    const avatarUrl = formData.get("avatarUrl") as string;
    const isFeatured = formData.get("isFeatured") === "on";

    try {
        await prisma.testimonial.create({
            data: {
                name,
                role,
                content,
                rating,
                avatarUrl,
                isFeatured,
            },
        });
        revalidatePath("/admin/testimonials");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to create testimonial" };
    }
}

export async function updateTestimonial(id: string, formData: FormData) {
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const content = formData.get("content") as string;
    const rating = parseInt(formData.get("rating") as string);
    const avatarUrl = formData.get("avatarUrl") as string;
    const isFeatured = formData.get("isFeatured") === "on";

    try {
        await prisma.testimonial.update({
            where: { id },
            data: {
                name,
                role,
                content,
                rating,
                avatarUrl,
                isFeatured,
            },
        });
        revalidatePath("/admin/testimonials");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to update testimonial" };
    }
}

export async function deleteTestimonial(id: string) {
    try {
        await prisma.testimonial.delete({
            where: { id },
        });
        revalidatePath("/admin/testimonials");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete testimonial" };
    }
}

export async function toggleTestimonialFeatured(id: string, isFeatured: boolean) {
    try {
        await prisma.testimonial.update({
            where: { id },
            data: { isFeatured },
        });
        revalidatePath("/admin/testimonials");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to update testimonial" };
    }
}
