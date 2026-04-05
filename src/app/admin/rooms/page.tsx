import React from "react";
import prisma from "@/lib/prisma";
import { createRoomCategory, deleteRoomCategory, updateRoomCategory, createRoom, updateRoom, deleteRoom } from "@/app/actions/rooms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RoomsClient } from "@/components/admin/rooms-client";
import { DeleteButton } from "@/components/admin/delete-button";
import { EditRoomCategoryDialog } from "@/components/admin/edit-room-category-dialog";
import { EditRoomDialog } from "@/components/admin/edit-room-dialog";

export const dynamic = "force-dynamic";

export default async function RoomsPage() {
    let categories: any[] = [];
    let rooms: any[] = [];
    try {
        categories = await prisma.roomCategory.findMany({
            include: { _count: { select: { rooms: true } } },
            orderBy: { price: "asc" },
        });
        rooms = await prisma.room.findMany({
            include: { category: true },
            orderBy: { roomNumber: "asc" },
        });
    } catch { }

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-serif text-primary">Room Management</h2>

            {/* ─── Room Categories ─────────────────────────── */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Room Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Add Category Form */}
                    <form action={createRoomCategory} className="grid md:grid-cols-4 gap-4 items-end border-b border-border pb-6">
                        <div className="space-y-2">
                            <Label>Category Name</Label>
                            <Input name="name" placeholder="e.g. Deluxe" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Price (₦)</Label>
                            <Input name="price" type="number" placeholder="35000" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Input name="description" placeholder="A brief description" />
                        </div>
                        <Button type="submit">Add Category</Button>
                    </form>

                    {/* Categories Table */}
                    {categories.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Rooms</TableHead>
                                    <TableHead>Cover</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.map((c) => (
                                    <TableRow key={c.id}>
                                        <TableCell className="font-medium">{c.name}</TableCell>
                                        <TableCell>₦{Number(c.price).toLocaleString()}</TableCell>
                                        <TableCell>{c._count.rooms}</TableCell>
                                        <TableCell>
                                            {c.coverImage ? (
                                                <Badge variant="success">✓ Set</Badge>
                                            ) : (
                                                <Badge variant="outline">None</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <EditRoomCategoryDialog category={c} action={updateRoomCategory} />
                                                <DeleteButton action={deleteRoomCategory.bind(null, c.id)} itemType="Category" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-muted-foreground text-sm">No categories yet.</p>
                    )}
                </CardContent>
            </Card>

            {/* ─── Cover Image Uploads ─────────────────────── */}
            <RoomsClient categories={categories} rooms={rooms} />

            {/* ─── Individual Rooms ────────────────────────── */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Room Numbers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Add Room Form */}
                    <form action={createRoom} className="grid md:grid-cols-4 gap-4 items-end border-b border-border pb-6">
                        <div className="space-y-2">
                            <Label>Room Number</Label>
                            <Input name="roomNumber" placeholder="e.g. 102" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <select name="categoryId" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                                <option value="">Select category</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <select name="status" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                <option value="AVAILABLE">Available</option>
                                <option value="OCCUPIED">Occupied</option>
                                <option value="MAINTENANCE">Maintenance</option>
                            </select>
                        </div>
                        <Button type="submit">Add Room</Button>
                    </form>

                    {/* Rooms Table */}
                    {rooms.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Room #</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rooms.map((r) => (
                                    <TableRow key={r.id}>
                                        <TableCell className="font-medium">{r.roomNumber}</TableCell>
                                        <TableCell>{r.category.name}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                r.status === "AVAILABLE" ? "success" :
                                                    r.status === "OCCUPIED" ? "warning" : "destructive"
                                            }>
                                                {r.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                {r.status !== "AVAILABLE" && (
                                                    <form action={async () => { "use server"; const fd = new FormData(); fd.set("status", "AVAILABLE"); fd.set("categoryId", r.categoryId); await updateRoom(r.id, fd); }}>
                                                        <Button size="sm" variant="outline" type="submit">Set Available</Button>
                                                    </form>
                                                )}
                                                {r.status !== "MAINTENANCE" && (
                                                    <form action={async () => { "use server"; const fd = new FormData(); fd.set("status", "MAINTENANCE"); fd.set("categoryId", r.categoryId); await updateRoom(r.id, fd); }}>
                                                        <Button size="sm" variant="secondary" type="submit">Maintenance</Button>
                                                    </form>
                                                )}
                                                <EditRoomDialog room={r} categories={categories} action={updateRoom} />
                                                <DeleteButton action={deleteRoom.bind(null, r.id)} itemType="Room" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-muted-foreground text-sm">No rooms yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
