import React from "react";
import prisma from "@/lib/prisma";
import { updateBookingStatus, updatePaymentStatus } from "@/app/actions/bookings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
    let bookings: any[] = [];
    try {
        bookings = await prisma.booking.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                guest: true,
                room: { include: { category: true } },
            },
        });
    } catch { }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-serif text-primary">Booking Management</h2>

            <Card>
                <CardContent className="p-0">
                    {bookings.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Guest</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Room</TableHead>
                                    <TableHead>Check-in</TableHead>
                                    <TableHead>Check-out</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Paid</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Payment</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bookings.map((b) => (
                                    <TableRow key={b.id}>
                                        <TableCell className="font-medium">{b.guest.firstName} {b.guest.lastName}</TableCell>
                                        <TableCell className="text-sm">{b.guest.phoneNumber}</TableCell>
                                        <TableCell>
                                            {b.room ? `${b.room.category.name} #${b.room.roomNumber}` : <span className="text-muted-foreground">Unassigned</span>}
                                        </TableCell>
                                        <TableCell>{new Date(b.checkIn).toLocaleDateString()}</TableCell>
                                        <TableCell>{new Date(b.checkOut).toLocaleDateString()}</TableCell>
                                        <TableCell>₦{Number(b.totalAmount).toLocaleString()}</TableCell>
                                        <TableCell>₦{Number(b.amountPaid).toLocaleString()}</TableCell>
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
                                        <TableCell>
                                            <div className="flex gap-1 flex-wrap">
                                                {b.status === "PENDING" && (
                                                    <>
                                                        <form action={async () => { "use server"; await updateBookingStatus(b.id, "CONFIRMED"); }}>
                                                            <Button size="sm" variant="default" type="submit">Confirm</Button>
                                                        </form>
                                                        <form action={async () => { "use server"; await updateBookingStatus(b.id, "CANCELLED"); }}>
                                                            <Button size="sm" variant="destructive" type="submit">Reject</Button>
                                                        </form>
                                                    </>
                                                )}
                                                {b.status === "CONFIRMED" && (
                                                    <form action={async () => { "use server"; await updateBookingStatus(b.id, "COMPLETED"); }}>
                                                        <Button size="sm" variant="secondary" type="submit">Complete</Button>
                                                    </form>
                                                )}
                                                {b.paymentStatus !== "COMPLETED" && (
                                                    <form action={async () => { "use server"; await updatePaymentStatus(b.id, "COMPLETED"); }}>
                                                        <Button size="sm" variant="outline" type="submit">Mark Paid</Button>
                                                    </form>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="p-8 text-center text-muted-foreground">No bookings found.</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
