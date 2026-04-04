import React from "react";
import prisma from "@/lib/prisma";
import { createGuest, deleteGuest } from "@/app/actions/guests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteButton } from "@/components/admin/delete-button";

export const dynamic = "force-dynamic";

export default async function GuestsPage() {
    let guests: any[] = [];
    try {
        guests = await prisma.guest.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                bookings: {
                    orderBy: { createdAt: "desc" },
                    take: 3,
                    include: { room: { include: { category: true } } },
                },
                _count: { select: { bookings: true } },
            },
        });
    } catch { }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-serif text-primary">Guest Management</h2>

            {/* Add Guest */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Add New Guest</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={createGuest} className="grid md:grid-cols-5 gap-4 items-end">
                        <div className="space-y-2">
                            <Label>First Name</Label>
                            <Input name="firstName" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Last Name</Label>
                            <Input name="lastName" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone</Label>
                            <Input name="phoneNumber" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input name="email" type="email" />
                        </div>
                        <Button type="submit">Add Guest</Button>
                    </form>
                </CardContent>
            </Card>

            {/* Guest List */}
            <Card>
                <CardContent className="p-0">
                    {guests.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Total Bookings</TableHead>
                                    <TableHead>Recent Stay</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {guests.map((g) => (
                                    <TableRow key={g.id}>
                                        <TableCell className="font-medium">{g.firstName} {g.lastName}</TableCell>
                                        <TableCell>{g.phoneNumber}</TableCell>
                                        <TableCell>{g.email || "—"}</TableCell>
                                        <TableCell>{g._count.bookings}</TableCell>
                                        <TableCell>
                                            {g.bookings.length > 0
                                                ? `${g.bookings[0].room?.category?.name || "—"} (${new Date(g.bookings[0].checkIn).toLocaleDateString()})`
                                                : "No stays"
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <DeleteButton action={deleteGuest.bind(null, g.id)} itemType="Guest" />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="p-8 text-center text-muted-foreground">No guest records.</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
