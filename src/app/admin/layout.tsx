import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getUnreadNotificationCount } from "@/lib/notifications";

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

    const navItems = [
        { href: "/admin", label: "Dashboard", icon: "📊" },
        { href: "/admin/bookings", label: "Bookings", icon: "📋" },
        { href: "/admin/rooms", label: "Rooms", icon: "🏨" },
        { href: "/admin/guests", label: "Guests", icon: "👥" },
        { href: "/admin/inquiries", label: "Inquiries", icon: "💬" },
        { href: "/admin/notifications", label: `Notifications${unreadCount > 0 ? ` (${unreadCount})` : ""}`, icon: "🔔" },
    ];

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-card flex-shrink-0 flex flex-col">
                <div className="p-6 border-b border-border">
                    <Link href="/admin">
                        <h2 className="font-serif text-xl text-primary font-bold">Golfside Admin</h2>
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1">{session.user.email}</p>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                            <div className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm hover:bg-accent/10 hover:text-primary transition-colors">
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                            </div>
                        </Link>
                    ))}
                    <div className="pt-4 mt-4 border-t border-border">
                        <Link href="/admin/settings">
                            <div className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm hover:bg-accent/10 text-primary transition-colors font-medium">
                                <span>⚙️</span>
                                <span>Site Settings</span>
                            </div>
                        </Link>
                    </div>
                </nav>
                <div className="p-4 border-t border-border">
                    <Link href="/" target="_blank">
                        <Button variant="outline" className="w-full text-sm" size="sm">
                            View Public Site
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-16 border-b border-border bg-card flex items-center justify-between px-8 flex-shrink-0">
                    <h1 className="text-lg font-medium">Hotel Management</h1>
                    <form action="/api/auth/signout" method="POST">
                        <Button variant="outline" size="sm" type="submit">Logout</Button>
                    </form>
                </header>
                <div className="p-8 overflow-y-auto flex-1">{children}</div>
            </main>
        </div>
    );
}
