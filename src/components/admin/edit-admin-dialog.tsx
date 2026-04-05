"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EditAdminDialog({
    admin,
    action
}: {
    admin: any;
    action: (id: string, formData: FormData) => Promise<void>;
}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        try {
            await action(admin.id, formData);
            setOpen(false);
        } catch {
            alert("Error updating admin.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">Edit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Admin</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <Input name="name" defaultValue={admin.name || ""} required />
                    </div>

                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input type="email" name="email" defaultValue={admin.email} required />
                    </div>

                    <div className="space-y-2">
                        <Label>Role</Label>
                        <select name="role" defaultValue={admin.role} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                            <option value="ADMIN">Admin</option>
                            <option value="SUPER_ADMIN">Super Admin</option>
                        </select>
                    </div>

                    <div className="space-y-2 shadow-sm p-4 border border-border rounded-md mt-4">
                        <Label>Target Password (Optional)</Label>
                        <p className="text-xs text-muted-foreground mb-2">Leave blank to keep current password</p>
                        <Input type="password" name="password" minLength={6} placeholder="••••••••" />
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
