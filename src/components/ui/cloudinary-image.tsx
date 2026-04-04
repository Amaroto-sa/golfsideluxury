"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface CloudinaryImageProps {
    src: string | null | undefined;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    className?: string;
    sizes?: string;
    priority?: boolean;
    /** Placeholder text when no image is set */
    placeholder?: string;
    /** Container className (used when fill=true or when showing placeholder) */
    containerClassName?: string;
}

/**
 * Optimized Cloudinary image component.
 * Renders Next/Image with Cloudinary URL optimization.
 * Falls back to a styled placeholder when no src is provided.
 */
export function CloudinaryImage({
    src,
    alt,
    width,
    height,
    fill = false,
    className,
    sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
    priority = false,
    placeholder = "Image",
    containerClassName,
}: CloudinaryImageProps) {
    if (!src) {
        return (
            <div
                className={cn(
                    "bg-zinc-800 flex items-center justify-center text-muted-foreground text-sm",
                    containerClassName
                )}
            >
                <span>{placeholder}</span>
            </div>
        );
    }

    // Append Cloudinary auto-format/quality transformations if it's a Cloudinary URL
    const optimizedSrc = src.includes("res.cloudinary.com")
        ? src.replace("/upload/", "/upload/f_auto,q_auto/")
        : src;

    if (fill) {
        return (
            <div className={cn("relative overflow-hidden", containerClassName)}>
                <Image
                    src={optimizedSrc}
                    alt={alt}
                    fill
                    className={cn("object-cover", className)}
                    sizes={sizes}
                    priority={priority}
                />
            </div>
        );
    }

    return (
        <Image
            src={optimizedSrc}
            alt={alt}
            width={width || 800}
            height={height || 600}
            className={cn("object-cover", className)}
            sizes={sizes}
            priority={priority}
        />
    );
}
