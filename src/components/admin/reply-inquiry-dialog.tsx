"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ReplyInquiryDialog({
    inquiry,
    action
}: {
    inquiry: { id: string; name: string; email: string; message: string };
    action: (formData: FormData) => Promise<{ success: boolean; error?: string }>
}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        formData.append("id", inquiry.id);

        try {
            const res = await action(formData);
            if (res.success) {
                setOpen(false);
            } else {
                alert(res.error || "Failed to send reply");
            }
        } catch (error) {
            alert("Error sending reply");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
                Reply
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reply to {inquiry.name}</DialogTitle>
                        <DialogDescription>
                            Email: {inquiry.email}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="text-sm bg-muted p-3 border-l-2 border-primary rounded-r-md italic mb-4 max-h-[150px] overflow-y-auto">
                        "{inquiry.message}"
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Textarea
                            name="replyMessage"
                            placeholder="Type your reply here... (They will receive this via email)"
                            required
                            rows={6}
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline" disabled={loading}>Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Sending..." : "Send Reply Email"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
