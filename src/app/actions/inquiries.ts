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

    // Send Admin Email Alert (must be awaited directly)
    try {
        const { sendInquiryNotificationEmail } = await import("@/lib/email");
        await sendInquiryNotificationEmail(inquiry);
    } catch (error) {
        console.error("Failed to send inquiry email alert:", error);
    }

    revalidatePath("/admin");
    revalidatePath("/admin/inquiries");

    return { success: true, inquiryId: inquiry.id };
}

export async function replyToInquiry(formData: FormData) {
    const id = formData.get("id") as string;
    const replyMessage = formData.get("replyMessage") as string;

    if (!id || !replyMessage || replyMessage.length < 5) {
        return { success: false, error: "Reply message too short" };
    }

    const inquiry = await prisma.inquiry.findUnique({ where: { id } });
    if (!inquiry) return { success: false, error: "Inquiry not found" };

    try {
        const { sendInquiryReplyEmail } = await import("@/lib/email");
        await sendInquiryReplyEmail(inquiry.email, inquiry.name, replyMessage);
    } catch (error) {
        console.error("Failed to send reply email:", error);
        return { success: false, error: "Failed to dispatch email via SMTP." };
    }

    await prisma.inquiry.update({
        where: { id },
        data: { status: "RESOLVED" as any },
    });

    revalidatePath("/admin/inquiries");
    return { success: true };
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
