"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface DeleteButtonProps {
    onConfirm?: () => void | Promise<void>;
    action?: () => void | Promise<void>; // Backward compatibility
    itemType?: string;
    title?: string;
    description?: string;
    trigger?: React.ReactNode;
}

export function DeleteButton({
    onConfirm,
    action,
    itemType = "item",
    title,
    description,
    trigger
}: DeleteButtonProps) {
    const [open, setOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const handleDelete = async () => {
        setIsPending(true);
        try {
            if (onConfirm) {
                await onConfirm();
            } else if (action) {
                await action();
            }
        } finally {
            setIsPending(false);
            setOpen(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button size="sm" variant="destructive" className="flex items-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-card border-border">
                <DialogHeader>
                    <DialogTitle className="text-white font-serif">{title || `Delete ${itemType}`}</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        {description || `Are you sure you want to delete this ${itemType}? This action cannot be undone.`}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-6 gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending} className="border-border text-white hover:bg-white/5">
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={isPending} className="bg-red-600 hover:bg-red-700 text-white border-none">
                        {isPending ? "Deleting..." : "Yes, Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
