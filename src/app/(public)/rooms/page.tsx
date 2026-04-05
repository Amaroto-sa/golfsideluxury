import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getRoomCategories } from "@/lib/data-fetchers";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Rooms | Golfside Luxury Hotel",
    description: "Explore our range of premium rooms — from Standard to Diplomat suites. Luxury accommodation in Asaba.",
};

export const dynamic = "force-dynamic";

function cldOpt(url: string | null | undefined, transforms: string): string | null {
    if (!url) return null;
    if (url.includes("res.cloudinary.com")) {
        return url.replace("/upload/", `/upload/${transforms}/`);
    }
    return url;
}

export default async function RoomsPage() {
    const categories = await getRoomCategories();

    return (
        <div className="py-16 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-24 flex flex-col items-center">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-px w-8 bg-primary" />
                        <p className="text-primary tracking-[0.4em] uppercase text-xs font-semibold">Our Collection</p>
                        <div className="h-px w-8 bg-primary" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-6">
                        Room <span className="text-primary italic">Categories</span>
                    </h1>
                    <p className="text-muted-foreground/80 font-light max-w-2xl mx-auto text-lg leading-relaxed">
                        Each room is meticulously designed to provide the highest level of comfort and luxury.
                    </p>
                </div>

                {/* Room Grid */}
                {categories.length > 0 ? (
                    <div className="space-y-16">
                        {categories.map((cat, i) => {
                            const availableCount = cat.rooms?.filter((r) => r.status === "AVAILABLE").length || 0;
                            const coverUrl = cldOpt(cat.coverImage, "f_auto,q_auto,w_900,h_560,c_fill");

                            return (
                                <div
                                    key={cat.id}
                                    className={`flex flex-col ${i % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} gap-8 items-center`}
                                >
                                    {/* Image */}
                                    <div className="flex-1 w-full relative group">
                                        <div className={`absolute -inset-4 border border-primary/20 ${i % 2 === 1 ? "-translate-x-4" : "translate-x-4"} translate-y-4`} />
                                        <div className="aspect-[16/10] overflow-hidden relative z-10 shadow-2xl bg-background/80">
                                            {coverUrl ? (
                                                <Image
                                                    src={coverUrl}
                                                    alt={`${cat.name} room`}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-[1.5s]"
                                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-background/80 flex items-center justify-center">
                                                    <span className="text-muted-foreground uppercase tracking-widest text-xs">{cat.name}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className={`flex-1 space-y-8 ${i % 2 === 1 ? "pr-0 lg:pr-16" : "pl-0 lg:pl-16"}`}>
                                        <div className="flex items-center gap-4">
                                            <div className="h-px w-10 bg-primary" />
                                            <h2 className="text-4xl md:text-5xl font-serif text-foreground">{cat.name}</h2>
                                        </div>
                                        <p className="text-4xl font-light text-primary">
                                            ₦{Number(cat.price).toLocaleString()}
                                            <span className="text-xs text-muted-foreground block mt-2 tracking-[0.2em] uppercase font-medium">per night</span>
                                        </p>
                                        {cat.description && (
                                            <p className="text-muted-foreground leading-loose font-light text-lg">{cat.description}</p>
                                        )}
                                        <div className="flex flex-wrap gap-4 text-xs font-medium tracking-widest uppercase">
                                            <span className="bg-card border border-border/50 px-5 py-3 shadow-sm">
                                                {cat._count?.rooms || cat.rooms?.length || 0} Total
                                            </span>
                                            <span className={`px-5 py-3 border shadow-sm ${availableCount > 0
                                                ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                                                : "bg-destructive/5 border-destructive/20 text-destructive"
                                                }`}>
                                                {availableCount} Available
                                            </span>
                                        </div>
                                        {cat.rooms && cat.rooms.length > 0 && (
                                            <div className="text-xs text-muted-foreground font-light mb-8">
                                                <strong className="font-medium text-foreground">Rooms:</strong> {cat.rooms.map((r) => r.roomNumber).join(", ")}
                                            </div>
                                        )}
                                        <div className="pt-4">
                                            <Link href={`/booking?category=${cat.id}`}>
                                                <Button size="lg" className="px-10 py-7 uppercase tracking-[0.2em] font-semibold text-sm">
                                                    Book {cat.name}
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 text-muted-foreground">
                        <p>Room categories will be displayed here once configured in the admin panel.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
