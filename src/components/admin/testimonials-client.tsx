"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MoreVertical, Trash2, Edit2, Plus, Quote } from "lucide-react";
import { TestimonialDialog } from "./testimonial-dialog";
import { deleteTestimonial, toggleTestimonialFeatured } from "@/app/actions/testimonials";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DeleteButton } from "./delete-button";

interface TestimonialsClientProps {
    testimonials: any[];
}

export function TestimonialsClient({ testimonials: initialTestimonials }: TestimonialsClientProps) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editTestimonial, setEditTestimonial] = useState<any>(null);

    const refreshData = () => {
        window.location.reload();
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-white">Guest Testimonials</h1>
                    <p className="text-muted-foreground mt-1">Manage guest feedback and featured reviews.</p>
                </div>
                <Button onClick={() => setIsAddOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" /> Add Testimonial
                </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialTestimonials.map((t) => (
                    <Card key={t.id} className="bg-card border-border hover:border-primary/30 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 z-10">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-card border-border">
                                    <DropdownMenuItem onClick={() => setEditTestimonial(t)} className="gap-2 cursor-pointer">
                                        <Edit2 className="w-4 h-4" /> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <DeleteButton
                                            title="Delete Testimonial"
                                            description="Are you sure you want to delete this testimonial? This action cannot be undone."
                                            onConfirm={async () => {
                                                await deleteTestimonial(t.id);
                                                refreshData();
                                            }}
                                            trigger={
                                                <button className="flex w-full items-center gap-2 px-2 py-1.5 text-sm text-red-500 hover:bg-red-500/10 rounded-sm">
                                                    <Trash2 className="w-4 h-4" /> Delete
                                                </button>
                                            }
                                        />
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <CardContent className="p-8">
                            <div className="mb-6 flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < t.rating ? "fill-primary text-primary" : "text-zinc-800"}`}
                                    />
                                ))}
                            </div>

                            <Quote className="w-10 h-10 text-primary/10 absolute -left-1 top-2" />

                            <p className="text-muted-foreground italic leading-relaxed text-sm mb-6 line-clamp-4 font-light">
                                "{t.content}"
                            </p>

                            <div className="flex items-center gap-4 border-t border-border/50 pt-6">
                                <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary/10 flex items-center justify-center text-primary font-serif text-xl overflow-hidden shrink-0">
                                    {t.avatarUrl ? (
                                        <img src={t.avatarUrl} alt={t.name} className="w-full h-full object-cover" />
                                    ) : (
                                        t.name[0]
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-serif text-white truncate text-base">{t.name}</h4>
                                    <p className="text-xs text-muted-foreground truncate">{t.role || "Guest"}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {initialTestimonials.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-card border border-dashed border-border rounded-xl">
                        <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground">No testimonials found. Add your first guest review!</p>
                        <Button onClick={() => setIsAddOpen(true)} variant="link" className="text-primary mt-2">
                            Add Testimonial
                        </Button>
                    </div>
                )}
            </div>

            <TestimonialDialog
                open={isAddOpen}
                onOpenChange={setIsAddOpen}
                onSuccess={refreshData}
            />

            {editTestimonial && (
                <TestimonialDialog
                    open={!!editTestimonial}
                    onOpenChange={() => setEditTestimonial(null)}
                    testimonial={editTestimonial}
                    onSuccess={refreshData}
                />
            )}
        </div>
    );
}
