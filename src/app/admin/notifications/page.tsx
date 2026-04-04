import React from "react";
import prisma from "@/lib/prisma";
import { markNotificationRead, markAllRead } from "@/app/actions/content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
    let notifications: any[] = [];
    try {
        notifications = await prisma.notification.findMany({
            orderBy: { createdAt: "desc" },
            take: 50,
        });
    } catch { }

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-serif text-primary">
                    Notifications {unreadCount > 0 && <Badge variant="warning" className="ml-2">{unreadCount} unread</Badge>}
                </h2>
                {unreadCount > 0 && (
                    <form action={markAllRead}>
                        <Button variant="outline" size="sm" type="submit">Mark All Read</Button>
                    </form>
                )}
            </div>

            <div className="space-y-3">
                {notifications.length > 0 ? (
                    notifications.map((n) => (
                        <Card key={n.id} className={n.isRead ? "opacity-60" : ""}>
                            <CardContent className="p-5 flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <Badge variant={n.type === "BOOKING" ? "default" : n.type === "INQUIRY" ? "secondary" : "outline"}>
                                            {n.type}
                                        </Badge>
                                        {!n.isRead && <Badge variant="warning">New</Badge>}
                                    </div>
                                    <h4 className="font-medium">{n.title}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                                    <p className="text-xs text-muted-foreground mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                                </div>
                                {!n.isRead && (
                                    <form action={async () => { "use server"; await markNotificationRead(n.id); }}>
                                        <Button size="sm" variant="ghost" type="submit">Mark Read</Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card>
                        <CardContent className="p-8 text-center text-muted-foreground">
                            No notifications yet.
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
