"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { createTestimonial, updateTestimonial } from "@/app/actions/testimonials";
import { Star } from "lucide-react";

interface TestimonialDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    testimonial?: any;
    onSuccess: () => void;
}

export function TestimonialDialog({ open, onOpenChange, testimonial, onSuccess }: TestimonialDialogProps) {
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(testimonial?.rating || 5);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        formData.set("rating", rating.toString());

        const res = testimonial
            ? await updateTestimonial(testimonial.id, formData)
            : await createTestimonial(formData);

        setLoading(false);
        if (res.success) {
            onOpenChange(false);
            onSuccess();
        } else {
            alert(res.error || "Something went wrong");
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] border-border bg-card">
                <DialogHeader>
                    <DialogTitle className="font-serif text-primary">
                        {testimonial ? "Edit Testimonial" : "Add New Testimonial"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Guest Name</Label>
                        <Input id="name" name="name" defaultValue={testimonial?.name} required placeholder="e.g. John Doe" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Guest Role (Optional)</Label>
                        <Input id="role" name="role" defaultValue={testimonial?.role} placeholder="e.g. Business Traveler" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">Review Content</Label>
                        <Textarea id="content" name="content" defaultValue={testimonial?.content} required placeholder="The stay was absolutely amazing..." className="min-h-[120px]" />
                    </div>

                    <div className="space-y-3">
                        <Label>Rating</Label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="focus:outline-none transition-transform active:scale-90"
                                >
                                    <Star
                                        className={`w-8 h-8 ${star <= rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="avatarUrl">Avatar URL (Optional)</Label>
                        <Input id="avatarUrl" name="avatarUrl" defaultValue={testimonial?.avatarUrl} placeholder="Cloudinary URL" />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input type="checkbox" id="isFeatured" name="isFeatured" defaultChecked={testimonial ? testimonial.isFeatured : true} />
                        <Label htmlFor="isFeatured" className="cursor-pointer">Featured on homepage</Label>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : (testimonial ? "Update Testimonial" : "Create Testimonial")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
