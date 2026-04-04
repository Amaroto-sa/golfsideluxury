import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getUnreadNotificationCount } from "@/lib/notifications";

import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    // If no session, just render children (login page will render)
    // Middleware handles redirecting non-login admin pages
    if (!session) {
        return <>{children}</>;
    }

    let unreadCount = 0;
    try {
        unreadCount = await getUnreadNotificationCount();
    } catch { }

    return (
        <AdminSidebar email={session.user?.email} unreadCount={unreadCount}>
            {children}
        </AdminSidebar>
    );
}
