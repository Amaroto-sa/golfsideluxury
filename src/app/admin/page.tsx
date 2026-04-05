import React from "react";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    let stats = {
        totalBookings: 0,
        pendingReservations: 0,
        confirmedBookings: 0,
        occupiedRooms: 0,
        availableRooms: 0,
        totalRooms: 0,
        recentInquiries: 0,
        unreadNotifications: 0,
        totalRevenue: 0,
        checkInsToday: 0,
    };

    let recentBookings: any[] = [];

    try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const [
            totalBookings,
            pendingReservations,
            confirmedBookings,
            occupiedRooms,
            availableRooms,
            totalRooms,
            recentInquiries,
            unreadNotifications,
            bookings,
            revenueAggregate,
            checkInsToday,
        ] = await Promise.all([
            prisma.booking.count(),
            prisma.booking.count({ where: { status: "PENDING" } }),
            prisma.booking.count({ where: { status: "CONFIRMED" } }),
            prisma.room.count({ where: { status: "OCCUPIED" } }),
            prisma.room.count({ where: { status: "AVAILABLE" } }),
            prisma.room.count(),
            prisma.inquiry.count({ where: { status: "NEW" } }),
            prisma.notification.count({ where: { isRead: false } }),
            prisma.booking.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
                include: { guest: true, room: { include: { category: true } } },
            }),
            prisma.booking.aggregate({
                where: { status: { in: ["CONFIRMED", "COMPLETED"] } },
                _sum: { amountPaid: true }
            }),
            prisma.booking.count({
                where: {
                    checkIn: {
                        gte: todayStart,
                        lte: todayEnd,
                    },
                },
            }),
        ]);

        stats = { totalBookings, pendingReservations, confirmedBookings, occupiedRooms, availableRooms, totalRooms, recentInquiries, unreadNotifications, totalRevenue: Number(revenueAggregate._sum.amountPaid || 0), checkInsToday };
        recentBookings = bookings;
    } catch { }

    const statCards = [
        { label: "Total Revenue", value: `₦${stats.totalRevenue.toLocaleString()}`, color: "text-emerald-400" },
        { label: "Check-ins Today", value: stats.checkInsToday, color: "text-blue-400" },
        { label: "Total Bookings", value: stats.totalBookings, color: "text-white" },
        { label: "Pending", value: stats.pendingReservations, color: "text-amber-400" },
        { label: "Confirmed", value: stats.confirmedBookings, color: "text-emerald-400" },
        { label: "Occupied Rooms", value: `${stats.occupiedRooms}/${stats.totalRooms}`, color: "text-blue-400" },
        { label: "Available Rooms", value: stats.availableRooms, color: "text-emerald-400" },
        { label: "New Inquiries", value: stats.recentInquiries, color: "text-primary" },
    ];

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-serif text-primary">Dashboard Overview</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {statCards.map((stat, i) => (
                    <Card key={i}>
                        <CardContent className="p-5">
                            <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                            <p className={`text-2xl font-serif font-bold ${stat.color}`}>{stat.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Bookings */}
            <Card>
                <CardHeader>
                    <CardTitle className="font-serif text-lg">Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                    {recentBookings.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Guest</TableHead>
                                    <TableHead>Room</TableHead>
                                    <TableHead>Check-in</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Payment</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentBookings.map((b) => (
                                    <TableRow key={b.id}>
                                        <TableCell className="font-medium">
                                            {b.guest.firstName} {b.guest.lastName}
                                        </TableCell>
                                        <TableCell>{b.room ? `${b.room.category.name} #${b.room.roomNumber}` : "Unassigned"}</TableCell>
                                        <TableCell>{new Date(b.checkIn).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                b.status === "CONFIRMED" ? "success" :
                                                    b.status === "PENDING" ? "warning" :
                                                        b.status === "CANCELLED" ? "destructive" : "secondary"
                                            }>
                                                {b.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                b.paymentStatus === "COMPLETED" ? "success" :
                                                    b.paymentStatus === "PARTIAL" ? "warning" : "outline"
                                            }>
                                                {b.paymentStatus}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-muted-foreground text-sm py-4">No bookings yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
