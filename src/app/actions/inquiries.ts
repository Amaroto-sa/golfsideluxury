"use server";

import prisma from "@/lib/prisma";
import { inquirySchema } from "@/lib/validations";
import { createNotification } from "@/lib/notifications";
import { revalidatePath } from "next/cache";

export async function submitInquiry(formData: FormData) {
    const raw = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: (formData.get("phone") as string) || undefined,
        message: formData.get("message") as string,
    };

    const parsed = inquirySchema.safeParse(raw);
    if (!parsed.success) {
        return { success: false, error: parsed.error.flatten().fieldErrors };
    }

    const data = parsed.data;

    const inquiry = await prisma.inquiry.create({
        data: {
            name: data.name,
            email: data.email,
            phone: data.phone || null,
            message: data.message,
        },
    });

    // Create dashboard notification
    await createNotification({
        title: "New Inquiry",
        message: `${data.name} sent a message: "${data.message.substring(0, 60)}..."`,
        type: "INQUIRY",
        linkUrl: "/admin/inquiries",
    });

    revalidatePath("/admin");
    revalidatePath("/admin/inquiries");

    return { success: true, inquiryId: inquiry.id };
}

export async function updateInquiryStatus(id: string, status: string) {
    await prisma.inquiry.update({
        where: { id },
        data: { status: status as any },
    });
    revalidatePath("/admin/inquiries");
}

export async function deleteInquiry(id: string) {
    await prisma.inquiry.delete({ where: { id } });
    revalidatePath("/admin/inquiries");
}
