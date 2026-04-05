"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddBookingDialog({
    categories,
    rooms,
    action
}: {
    categories: any[];
    rooms: any[];
    action: (formData: FormData) => Promise<{ success: boolean; error?: any; bookingId?: string }>;
}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            const res = await action(formData);
            if (res && res.success) {
                setOpen(false);
            } else {
                alert("Failed to create booking");
            }
        } catch {
            alert("Error creating booking. Check details and try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create Walk-in Booking</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Admin Manual Booking</DialogTitle>
                    <DialogDescription>
                        Manually enter booking details for walk-in guests or phone reservations.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>First Name</Label>
                            <Input name="firstName" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Last Name</Label>
                            <Input name="lastName" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input name="phoneNumber" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Email (Optional)</Label>
                            <Input type="email" name="email" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Check-in</Label>
                            <Input type="date" name="checkIn" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Check-out</Label>
                            <Input type="date" name="checkOut" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Adults</Label>
                            <Input type="number" name="adults" min={1} defaultValue={1} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Room Category</Label>
                            <select name="categoryId" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                                <option value="">Select category...</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Specific Room</Label>
                            <select name="roomId" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                <option value="">Auto-assign</option>
                                {rooms.map(r => <option key={r.id} value={r.id}>#{r.roomNumber} ({r.category.name}) - {r.status}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-border">
                        <Label>Payment Type</Label>
                        <select name="bookingType" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                            <option value="reservation">Reservation (Half Payment)</option>
                            <option value="full">Log Booking (Full Payment)</option>
                        </select>
                    </div>

                    <DialogFooter className="pt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={loading}>Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Save Booking"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
