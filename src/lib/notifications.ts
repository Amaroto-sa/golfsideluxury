// Modular notification service
// Designed to be extended with email, Telegram, etc. in the future

import prisma from "@/lib/prisma";

type NotificationType = "BOOKING" | "INQUIRY" | "SYSTEM";

interface CreateNotificationParams {
    title: string;
    message: string;
    type: NotificationType;
    linkUrl?: string;
}

export async function createNotification(params: CreateNotificationParams) {
    return prisma.notification.create({
        data: {
            title: params.title,
            message: params.message,
            type: params.type,
            linkUrl: params.linkUrl || null,
        },
    });
}

export async function getUnreadNotificationCount() {
    return prisma.notification.count({
        where: { isRead: false },
    });
}

export async function getRecentNotifications(limit = 10) {
    return prisma.notification.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
    });
}

export async function markNotificationAsRead(id: string) {
    return prisma.notification.update({
        where: { id },
        data: { isRead: true },
    });
}

export async function markAllNotificationsAsRead() {
    return prisma.notification.updateMany({
        where: { isRead: false },
        data: { isRead: true },
    });
}

// ─── Future extension points ────────────────────────────────────
// export async function sendEmailNotification(params) { }
// export async function sendTelegramNotification(params) { }
