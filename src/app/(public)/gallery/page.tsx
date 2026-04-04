import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import { getGalleryImages } from "@/lib/data-fetchers";

export const metadata: Metadata = {
    title: "Gallery | Golfside Luxury Hotel",
    description: "Explore the elegance and comfort of Golfside Luxury Hotel through our photo gallery.",
};

export const dynamic = "force-dynamic";

function cldOpt(url: string | null | undefined, transforms: string): string | null {
    if (!url) return null;
    if (url.includes("res.cloudinary.com")) {
        return url.replace("/upload/", `/upload/${transforms}/`);
    }
    return url;
}

export default async function GalleryPage() {
    const images = await getGalleryImages();

    return (
        <div className="py-16 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-primary tracking-[0.3em] uppercase text-sm font-medium mb-4">Visual Tour</p>
                    <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
                        Our <span className="text-primary">Gallery</span>
                    </h1>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        A glimpse into the luxury and warmth that awaits you at Golfside.
                    </p>
                </div>

                {images.length > 0 ? (
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                        {images.map((img) => {
                            const optimizedUrl = cldOpt(img.url, "f_auto,q_auto,w_600");
                            return (
                                <div
                                    key={img.id}
                                    className="break-inside-avoid rounded-lg overflow-hidden border border-border hover:border-primary/30 transition-colors group"
                                >
                                    <div className="relative overflow-hidden">
                                        {optimizedUrl ? (
                                            <Image
                                                src={optimizedUrl}
                                                alt={img.title || "Gallery image"}
                                                width={img.width || 600}
                                                height={img.height || 450}
                                                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            />
                                        ) : (
                                            <div className="aspect-[4/3] bg-zinc-800 flex items-center justify-center">
                                                <span className="text-muted-foreground text-sm">{img.title || "Gallery Image"}</span>
                                            </div>
                                        )}
                                    </div>
                                    {img.title && (
                                        <div className="p-3 bg-card">
                                            <p className="text-sm text-muted-foreground">{img.title}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="bg-card border border-border rounded-lg p-16 max-w-md mx-auto">
                            <p className="text-muted-foreground">
                                Gallery images will be displayed here once uploaded through the admin panel.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
