"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EditBookingDialog({
    booking,
    rooms,
    action
}: {
    booking: any;
    rooms: any[];
    action: (id: string, formData: FormData) => Promise<void>;
}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        try {
            await action(booking.id, formData);
            setOpen(false);
        } catch (err: any) {
            alert(err?.message || "Error updating booking.");
        } finally {
            setLoading(false);
        }
    }

    const checkInDate = new Date(booking.checkIn).toISOString().split('T')[0];
    const checkOutDate = new Date(booking.checkOut).toISOString().split('T')[0];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">Edit Dates</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Booking Details</DialogTitle>
                    <DialogDescription>Change stay duration or reassign room.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Check-In Date</Label>
                            <Input type="date" name="checkIn" defaultValue={checkInDate} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Check-Out Date</Label>
                            <Input type="date" name="checkOut" defaultValue={checkOutDate} required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Adults</Label>
                        <Input type="number" name="adults" min={1} defaultValue={booking.adults} required />
                    </div>

                    <div className="space-y-2">
                        <Label>Assigned Room</Label>
                        <select name="roomId" defaultValue={booking.roomId || "unassigned"} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                            <option value="unassigned">Unassigned</option>
                            {rooms.map((r) => (
                                <option key={r.id} value={r.id}>#{r.roomNumber} ({r.category.name})</option>
                            ))}
                        </select>
                    </div>

                    <DialogFooter className="pt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={loading}>Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
