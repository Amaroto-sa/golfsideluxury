"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export function ConfirmBookingButton({
    booking,
    rooms,
    confirmAction,
    assignAction
}: {
    booking: any;
    rooms: any[];
    confirmAction: (id: string, status: string) => Promise<void>;
    assignAction: (id: string, formData: FormData) => Promise<void>;
}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // If it already has a room, just do a direct action button
    if (booking.roomId) {
        return (
            <form action={async () => {
                const conf = confirm(`Confirm booking for Room #${booking.room?.roomNumber}?`);
                if (conf) await confirmAction(booking.id, "CONFIRMED");
            }}>
                <Button size="sm" variant="default" type="submit">Confirm</Button>
            </form>
        );
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        const selectedRoomId = formData.get("roomId");
        if (!selectedRoomId || selectedRoomId === "unassigned") {
            alert("You must assign a room before confirming!");
            setLoading(false);
            return;
        }

        try {
            // 1. Assign the room via update details
            await assignAction(booking.id, formData);
            // 2. Immediately mark confirmed
            await confirmAction(booking.id, "CONFIRMED");
            setOpen(false);
        } catch (err: any) {
            alert(err?.message || "Failed to assign room and confirm. Maybe it is occupied?");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="default">Confirm</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Assign Room to Confirm</DialogTitle>
                    <DialogDescription>
                        This booking has no room assigned yet. Please select an available room.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Select Room</Label>
                        <select name="roomId" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                            <option value="">-- Choose an Available Room --</option>
                            {rooms.map((r) => (
                                <option key={r.id} value={r.id}>#{r.roomNumber} - {r.category.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Hidden fields to satisfy updateBookingDetails form parsing without errors */}
                    <input type="hidden" name="checkIn" value={new Date(booking.checkIn).toISOString().split('T')[0]} />
                    <input type="hidden" name="checkOut" value={new Date(booking.checkOut).toISOString().split('T')[0]} />
                    <input type="hidden" name="adults" value={booking.adults} />

                    <DialogFooter className="pt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={loading}>Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Confirming..." : "Assign & Confirm"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
