"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, CalendarDays, BedDouble, Users, MessageSquare, Bell, Settings, Menu, X } from "lucide-react";

type AdminSidebarProps = {
    email: string | null | undefined;
    unreadCount: number;
    children: React.ReactNode;
};

export function AdminSidebar({ email, unreadCount, children }: AdminSidebarProps) {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    // Close when escape is pressed
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsMobileOpen(false);
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobileOpen]);

    const navItems = [
        { href: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
        { href: "/admin/bookings", label: "Bookings", Icon: CalendarDays },
        { href: "/admin/rooms", label: "Rooms", Icon: BedDouble },
        { href: "/admin/guests", label: "Guests", Icon: Users },
        { href: "/admin/inquiries", label: "Inquiries", Icon: MessageSquare },
        { href: "/admin/notifications", label: `Notifications${unreadCount > 0 ? ` (${unreadCount})` : ""}`, Icon: Bell },
    ];

    const sidebarContent = (
        <>
            <div className="p-6 border-b border-border flex justify-between items-start">
                <div>
                    <Link href="/admin" onClick={() => setIsMobileOpen(false)}>
                        <h2 className="font-serif text-xl text-primary font-bold">Golfside Admin</h2>
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">{email}</p>
                </div>
                {/* Mobile close button (hidden on lg) */}
                <button
                    onClick={() => setIsMobileOpen(false)}
                    className="p-1 -mr-2 text-muted-foreground hover:text-white lg:hidden"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto w-full">
                {navItems.map((item) => {
                    // Simple active check. If exact is true, must match exactly.
                    const isActive = item.exact
                        ? pathname === item.href
                        : pathname?.startsWith(item.href);

                    return (
                        <Link key={item.href} href={item.href}>
                            <div className={`flex items-center gap-3 px-3 py-3 rounded-md text-sm transition-colors group ${isActive
                                    ? "bg-primary/10 text-primary font-semibold"
                                    : "hover:bg-accent/10 hover:text-primary text-muted-foreground"
                                }`}>
                                <item.Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
                                <span>{item.label}</span>
                            </div>
                        </Link>
                    );
                })}
                <div className="pt-4 mt-6 border-t border-border">
                    <Link href="/admin/settings">
                        <div className={`flex items-center gap-3 px-3 py-3 rounded-md text-sm transition-colors group ${pathname?.startsWith("/admin/settings")
                                ? "bg-primary/10 text-primary font-semibold"
                                : "hover:bg-accent/10 hover:text-primary text-muted-foreground"
                            }`}>
                            <Settings className={`w-5 h-5 ${pathname?.startsWith("/admin/settings") ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
                            <span>Site Settings</span>
                        </div>
                    </Link>
                </div>
            </nav>
            <div className="p-4 border-t border-border mt-auto">
                <Link href="/" target="_blank" onClick={() => setIsMobileOpen(false)}>
                    <Button variant="outline" className="w-full text-sm border-primary/20 hover:bg-primary/10 hover:text-primary" size="lg">
                        View Public Site
                    </Button>
                </Link>
            </div>
        </>
    );

    return (
        <div className="min-h-[100dvh] bg-background flex flex-col lg:flex-row w-full overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className="w-[280px] border-r border-border bg-card flex-shrink-0 flex-col hidden lg:flex h-screen sticky top-0 overflow-hidden shadow-xl z-10">
                {sidebarContent}
            </aside>

            {/* Mobile Sidebar Overlay & Drawer */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsMobileOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Slide-in Drawer */}
                    <aside className="w-[280px] h-full bg-card shadow-xl border-r border-border relative z-50 flex flex-col transform transition-transform duration-300">
                        {sidebarContent}
                    </aside>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-h-screen min-w-0 w-full overflow-x-hidden">
                {/* Header (Always visible, responsive) */}
                <header className="h-16 lg:h-20 border-b border-border bg-card/50 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 flex-shrink-0 sticky top-0 z-40 w-full">
                    <div className="flex items-center gap-4">
                        <button
                            className="p-2 -ml-2 text-primary lg:hidden"
                            onClick={() => setIsMobileOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-lg lg:text-xl font-medium tracking-wide text-white truncate max-w-[200px] sm:max-w-none">
                            Hotel Management
                        </h1>
                    </div>

                    <form action="/api/auth/signout" method="POST">
                        <Button variant="outline" size="sm" type="submit" className="border-border">
                            Logout
                        </Button>
                    </form>
                </header>

                {/* Page Content wrapper ensures proper scroll & full width */}
                <div className="p-4 sm:p-6 lg:p-8 flex-1 overflow-x-hidden w-full max-w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
