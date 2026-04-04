"use client";

import React, { useState } from "react";
import { ImageUpload } from "@/components/ui/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { CLOUDINARY_FOLDERS } from "@/lib/cloudinary";

interface SettingsClientProps {
    settings: any;
    amenities: any[];
    rules: any[];
    socialLinks: any[];
    galleryImages: any[];
}

export function SettingsClient({
    settings,
    amenities,
    rules,
    socialLinks,
    galleryImages,
}: SettingsClientProps) {
    const s = settings;

    // ─── Media upload handlers ────────────────────────────────
    async function handleLogoUpload(result: { url: string; publicId: string }) {
        await fetch("/api/settings/media", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "logo", url: result.url, publicId: result.publicId }),
        });
        window.location.reload();
    }

    async function handleLogoRemove() {
        await fetch("/api/settings/media", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "logo", action: "remove" }),
        });
        window.location.reload();
    }

    async function handleFaviconUpload(result: { url: string; publicId: string }) {
        await fetch("/api/settings/media", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "favicon", url: result.url, publicId: result.publicId }),
        });
        window.location.reload();
    }

    async function handleFaviconRemove() {
        await fetch("/api/settings/media", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "favicon", action: "remove" }),
        });
        window.location.reload();
    }

    async function handleHeroUpload(result: { url: string; publicId: string }) {
        await fetch("/api/settings/media", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "hero", url: result.url, publicId: result.publicId }),
        });
        window.location.reload();
    }

    async function handleHeroRemove() {
        await fetch("/api/settings/media", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "hero", action: "remove" }),
        });
        window.location.reload();
    }

    async function handleGalleryUpload(result: { url: string; publicId: string; width: number; height: number }) {
        await fetch("/api/settings/media", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "gallery",
                url: result.url,
                publicId: result.publicId,
                width: result.width,
                height: result.height,
            }),
        });
        window.location.reload();
    }

    async function handleGalleryDelete(id: string) {
        await fetch("/api/settings/media", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "gallery-delete", galleryId: id }),
        });
        window.location.reload();
    }

    return (
        <div className="space-y-8 max-w-5xl">
            <h2 className="text-2xl font-serif text-primary">Public Site Settings</h2>
            <p className="text-muted-foreground text-sm">
                All changes here instantly update the public website. Upload images via Cloudinary.
            </p>

            {/* ═══════ Brand Assets (Logo / Favicon / Hero) ═══════ */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Brand Assets</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Logo */}
                        <div>
                            <Label className="mb-3 block">Hotel Logo</Label>
                            <ImageUpload
                                currentUrl={s?.logoUrl}
                                folder="golfside/branding"
                                onUpload={handleLogoUpload}
                                onRemove={handleLogoRemove}
                                label="Upload Logo"
                                aspectRatio="aspect-square"
                                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                            />
                        </div>

                        {/* Favicon */}
                        <div>
                            <Label className="mb-3 block">Favicon</Label>
                            <ImageUpload
                                currentUrl={s?.faviconUrl}
                                folder="golfside/branding"
                                onUpload={handleFaviconUpload}
                                onRemove={handleFaviconRemove}
                                label="Upload Favicon"
                                aspectRatio="aspect-square"
                                accept="image/png,image/x-icon,image/vnd.microsoft.icon,image/svg+xml"
                            />
                        </div>

                        {/* Hero Image */}
                        <div>
                            <Label className="mb-3 block">Homepage Hero Image</Label>
                            <ImageUpload
                                currentUrl={s?.homepageHero}
                                folder="golfside/hero"
                                onUpload={handleHeroUpload}
                                onRemove={handleHeroRemove}
                                label="Upload Hero Image"
                                aspectRatio="aspect-[16/9]"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ═══════ Hotel Core Settings ═══════ */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Hotel Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action="/api/settings/update" method="POST" className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Hotel Name</Label>
                                <Input name="hotelName" defaultValue={s?.hotelName} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <Input name="phoneNumber" defaultValue={s?.phoneNumber} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Email Address</Label>
                                <Input name="email" defaultValue={s?.email} type="email" required />
                            </div>
                            <div className="space-y-2">
                                <Label>Address</Label>
                                <Input name="address" defaultValue={s?.address} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Check-in Time</Label>
                                <Input name="checkInTime" defaultValue={s?.checkInTime} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Check-out Time</Label>
                                <Input name="checkOutTime" defaultValue={s?.checkOutTime} required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>About Text (Homepage)</Label>
                            <Textarea name="aboutText" defaultValue={s?.aboutText} rows={4} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Booking Policy</Label>
                            <Textarea name="bookingPolicy" defaultValue={s?.bookingPolicy} rows={3} required />
                        </div>
                        <Button type="submit">Save Hotel Settings</Button>
                    </form>
                </CardContent>
            </Card>

            {/* ═══════ Gallery Images (Cloudinary) ═══════ */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Gallery Images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="max-w-xs">
                        <ImageUpload
                            folder="golfside/gallery"
                            onUpload={handleGalleryUpload}
                            label="Add Gallery Image"
                            aspectRatio="aspect-[4/3]"
                        />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
                        {galleryImages.map((img: any) => (
                            <div key={img.id} className="relative group aspect-[4/3] rounded-lg overflow-hidden border border-border">
                                {img.url ? (
                                    <Image
                                        src={img.url.includes("res.cloudinary.com") ? img.url.replace("/upload/", "/upload/f_auto,q_auto,w_400/") : img.url}
                                        alt={img.title || "Gallery image"}
                                        fill
                                        className="object-cover"
                                        sizes="200px"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-muted-foreground text-xs">
                                        {img.title || "Image"}
                                    </div>
                                )}
                                <button
                                    onClick={() => handleGalleryDelete(img.id)}
                                    className="absolute top-2 right-2 bg-destructive text-white text-xs rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    ✕
                                </button>
                                {img.title && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                                        <p className="text-white text-xs truncate">{img.title}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                        {galleryImages.length === 0 && <p className="text-muted-foreground text-sm col-span-full">No gallery images yet. Upload your first image above.</p>}
                    </div>
                </CardContent>
            </Card>

            {/* ═══════ Amenities ═══════ */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Amenities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form action="/api/settings/amenity" method="POST" className="flex gap-4 items-end">
                        <div className="space-y-2 flex-1">
                            <Label>Amenity Name</Label>
                            <Input name="name" placeholder="e.g. Wi-Fi" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Icon (emoji)</Label>
                            <Input name="icon" placeholder="📶" className="w-20" />
                        </div>
                        <Button type="submit">Add</Button>
                    </form>
                    <div className="flex flex-wrap gap-2 pt-2">
                        {amenities.map((a: any) => (
                            <div key={a.id} className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-1.5">
                                <span className="text-sm">{a.icon || "✦"} {a.name}</span>
                                <button
                                    onClick={async () => { await fetch(`/api/settings/amenity?id=${a.id}`, { method: "DELETE" }); window.location.reload(); }}
                                    className="text-destructive text-xs hover:text-destructive/80"
                                >✕</button>
                            </div>
                        ))}
                        {amenities.length === 0 && <p className="text-muted-foreground text-sm">No amenities added yet.</p>}
                    </div>
                </CardContent>
            </Card>

            {/* ═══════ Rules / Policies ═══════ */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Rules & Policies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form action="/api/settings/rule" method="POST" className="grid md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input name="title" placeholder="e.g. No Smoking" required />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label>Content</Label>
                            <Input name="content" placeholder="Rule description" required />
                        </div>
                        <Button type="submit">Add Rule</Button>
                    </form>
                    <div className="space-y-2 pt-2">
                        {rules.map((r: any) => (
                            <div key={r.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                                <div>
                                    <span className="font-medium text-sm">{r.title}:</span>
                                    <span className="text-muted-foreground text-sm ml-2">{r.content}</span>
                                </div>
                                <button
                                    onClick={async () => { await fetch(`/api/settings/rule?id=${r.id}`, { method: "DELETE" }); window.location.reload(); }}
                                    className="text-destructive text-sm hover:text-destructive/80"
                                >Delete</button>
                            </div>
                        ))}
                        {rules.length === 0 && <p className="text-muted-foreground text-sm">No rules added yet.</p>}
                    </div>
                </CardContent>
            </Card>

            {/* ═══════ Social Links ═══════ */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Social Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form action="/api/settings/social" method="POST" className="grid md:grid-cols-3 gap-4 items-end">
                        <div className="space-y-2">
                            <Label>Platform</Label>
                            <Input name="platform" placeholder="e.g. TikTok" required />
                        </div>
                        <div className="space-y-2">
                            <Label>URL</Label>
                            <Input name="url" placeholder="https://..." required />
                        </div>
                        <Button type="submit">Add Social Link</Button>
                    </form>
                    <div className="space-y-2 pt-2">
                        {socialLinks.map((sl: any) => (
                            <div key={sl.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                                <div>
                                    <Badge variant="outline" className="mr-2">{sl.platform}</Badge>
                                    <span className="text-muted-foreground text-sm">{sl.url}</span>
                                </div>
                                <button
                                    onClick={async () => { await fetch(`/api/settings/social?id=${sl.id}`, { method: "DELETE" }); window.location.reload(); }}
                                    className="text-destructive text-sm hover:text-destructive/80"
                                >Delete</button>
                            </div>
                        ))}
                        {socialLinks.length === 0 && <p className="text-muted-foreground text-sm">No social links added yet.</p>}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
