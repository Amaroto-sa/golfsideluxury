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
                <div className="text-center mb-16">
                    <p className="text-primary tracking-[0.3em] uppercase text-sm font-medium mb-4">Our Collection</p>
                    <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
                        Room <span className="text-primary">Categories</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
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
                                    <div className="flex-1 w-full aspect-[16/10] rounded-lg border border-border overflow-hidden relative">
                                        {coverUrl ? (
                                            <Image
                                                src={coverUrl}
                                                alt={`${cat.name} room`}
                                                fill
                                                className="object-cover hover:scale-105 transition-transform duration-700"
                                                sizes="(max-width: 1024px) 100vw, 50vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                                <span className="text-muted-foreground">{cat.name} Room Image</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 space-y-6">
                                        <h2 className="text-3xl md:text-4xl font-serif text-primary">{cat.name}</h2>
                                        <p className="text-3xl font-medium text-white">
                                            ₦{Number(cat.price).toLocaleString()}
                                            <span className="text-lg text-muted-foreground"> / night</span>
                                        </p>
                                        {cat.description && (
                                            <p className="text-muted-foreground leading-relaxed">{cat.description}</p>
                                        )}
                                        <div className="flex flex-wrap gap-4 text-sm">
                                            <span className="bg-card border border-border px-4 py-2 rounded-md">
                                                {cat._count?.rooms || cat.rooms?.length || 0} Total Rooms
                                            </span>
                                            <span className={`px-4 py-2 rounded-md border ${availableCount > 0
                                                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                                    : "bg-destructive/10 border-destructive/20 text-destructive"
                                                }`}>
                                                {availableCount} Available Now
                                            </span>
                                        </div>
                                        {cat.rooms && cat.rooms.length > 0 && (
                                            <div className="text-xs text-muted-foreground">
                                                Rooms: {cat.rooms.map((r) => r.roomNumber).join(", ")}
                                            </div>
                                        )}
                                        <Link href={`/booking?category=${cat.id}`}>
                                            <Button size="lg" className="mt-2">Book {cat.name} Room</Button>
                                        </Link>
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
