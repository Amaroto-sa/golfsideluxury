"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Trash2, Edit2, Plus, Quote, MessageSquare } from "lucide-react";
import { TestimonialDialog } from "./testimonial-dialog";
import { deleteTestimonial } from "@/app/actions/testimonials";
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
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-white">Guest Testimonials</h1>
                    <p className="text-muted-foreground mt-1">Manage guest feedback and featured reviews.</p>
                </div>
                <Button onClick={() => setIsAddOpen(true)} className="gap-2 bg-primary hover:bg-primary/90 text-black font-bold px-6 py-6 rounded-none uppercase tracking-widest text-xs">
                    <Plus className="w-4 h-4" /> Add Testimonial
                </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialTestimonials.map((t) => (
                    <Card key={t.id} className="bg-card border-border hover:border-primary/30 transition-all group relative overflow-hidden flex flex-col h-full">
                        <div className="absolute top-4 right-4 z-10 flex gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditTestimonial(t)}
                                className="h-9 w-9 bg-black/40 hover:bg-primary hover:text-black text-white rounded-full transition-all"
                                title="Edit"
                            >
                                <Edit2 className="w-4 h-4" />
                            </Button>

                            <DeleteButton
                                title="Delete Testimonial"
                                description="Are you sure you want to delete this testimonial? This action cannot be undone."
                                onConfirm={async () => {
                                    await deleteTestimonial(t.id);
                                    refreshData();
                                }}
                                trigger={
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 bg-black/40 hover:bg-red-500 hover:text-white text-white rounded-full transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                }
                            />
                        </div>

                        <CardContent className="p-10 flex flex-col flex-1">
                            <div className="mb-8 flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < t.rating ? "fill-primary text-primary" : "text-zinc-800"}`}
                                    />
                                ))}
                            </div>

                            <Quote className="w-12 h-12 text-primary/5 absolute right-6 bottom-32 opacity-20" />

                            <div className="flex-1">
                                <p className="text-muted-foreground italic leading-relaxed text-base mb-8 font-light line-clamp-6">
                                    "{t.content}"
                                </p>
                            </div>

                            <div className="flex items-center gap-4 border-t border-border/20 pt-8 mt-auto">
                                <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-serif text-2xl overflow-hidden shrink-0">
                                    {t.avatarUrl ? (
                                        <img src={t.avatarUrl} alt={t.name} className="w-full h-full object-cover" />
                                    ) : (
                                        t.name[0]
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-serif text-white truncate text-lg group-hover:text-primary transition-colors">{t.name}</h4>
                                    <p className="text-[10px] text-primary/60 uppercase tracking-[0.2em] font-bold truncate">{t.role || "Guest"}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {initialTestimonials.length === 0 && (
                    <div className="col-span-full py-32 text-center bg-card border border-dashed border-border/40 rounded-xl">
                        <MessageSquare className="w-16 h-16 text-muted-foreground/20 mx-auto mb-6" />
                        <h3 className="text-xl text-white font-serif mb-2">No guest reviews yet</h3>
                        <p className="text-muted-foreground mb-8 text-sm">Add your first guest review to show off your hotel's excellence.</p>
                        <Button onClick={() => setIsAddOpen(true)} className="bg-primary text-black font-bold px-8">
                            Create First Testimonial
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
