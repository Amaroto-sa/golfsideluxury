"use client";

import React from "react";
import Image from "next/image";
import { ImageUpload } from "@/components/ui/image-upload";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface RoomsClientProps {
    categories: any[];
    rooms: any[];
}

export function RoomsClient({ categories, rooms }: RoomsClientProps) {
    async function handleCoverUpload(categoryId: string, result: { url: string; publicId: string }) {
        await fetch("/api/rooms/cover", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ categoryId, url: result.url, publicId: result.publicId }),
        });
        window.location.reload();
    }

    async function handleCoverRemove(categoryId: string) {
        await fetch("/api/rooms/cover", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ categoryId, action: "remove" }),
        });
        window.location.reload();
    }

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-serif text-primary">Room Category Images</h2>
            <p className="text-muted-foreground text-sm">
                Upload cover images for each room category. These appear on the public Rooms page and Homepage.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat: any) => (
                    <Card key={cat.id}>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center justify-between">
                                {cat.name}
                                <Badge variant="outline">₦{Number(cat.price).toLocaleString()}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ImageUpload
                                currentUrl={cat.coverImage}
                                folder="golfside/rooms"
                                onUpload={(result) => handleCoverUpload(cat.id, result)}
                                onRemove={() => handleCoverRemove(cat.id)}
                                label={`Upload ${cat.name} Cover`}
                                aspectRatio="aspect-[4/3]"
                            />
                        </CardContent>
                    </Card>
                ))}
                {categories.length === 0 && (
                    <p className="text-muted-foreground text-sm col-span-full">
                        Add room categories first, then upload cover images.
                    </p>
                )}
            </div>
        </div>
    );
}
