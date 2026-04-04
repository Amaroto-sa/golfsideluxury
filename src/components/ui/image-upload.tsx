"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
    /** Current image URL (if image already exists) */
    currentUrl?: string | null;
    /** Cloudinary folder to upload into */
    folder: string;
    /** Callback when upload succeeds */
    onUpload: (result: { url: string; publicId: string; width: number; height: number }) => void;
    /** Callback when image is removed */
    onRemove?: () => void;
    /** Label for the upload button */
    label?: string;
    /** CSS class for the container */
    className?: string;
    /** Aspect ratio class for preview (e.g. "aspect-square", "aspect-[4/3]") */
    aspectRatio?: string;
    /** Accept file types */
    accept?: string;
}

export function ImageUpload({
    currentUrl,
    folder,
    onUpload,
    onRemove,
    label = "Upload Image",
    className = "",
    aspectRatio = "aspect-[4/3]",
    accept = "image/jpeg,image/png,image/webp,image/gif",
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
    const [error, setError] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Client-side validation
        if (file.size > 10 * 1024 * 1024) {
            setError("File too large. Maximum 10MB.");
            return;
        }

        setUploading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", folder);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const result = await res.json();

            if (!res.ok || !result.success) {
                setError(result.error || "Upload failed");
                setUploading(false);
                return;
            }

            setPreviewUrl(result.url);
            onUpload(result);
        } catch {
            setError("Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    }

    function handleRemove() {
        setPreviewUrl(null);
        if (inputRef.current) inputRef.current.value = "";
        onRemove?.();
    }

    return (
        <div className={`space-y-3 ${className}`}>
            {/* Preview Area */}
            <div
                className={`relative ${aspectRatio} w-full bg-zinc-800 border-2 border-dashed border-border rounded-lg overflow-hidden flex items-center justify-center cursor-pointer hover:border-primary/40 transition-colors`}
                onClick={() => inputRef.current?.click()}
            >
                {previewUrl ? (
                    <Image
                        src={previewUrl}
                        alt="Uploaded image"
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 400px"
                    />
                ) : (
                    <div className="text-center p-4">
                        <div className="text-3xl mb-2">📷</div>
                        <p className="text-muted-foreground text-sm">{label}</p>
                        <p className="text-muted-foreground text-xs mt-1">Click to browse or drag & drop</p>
                    </div>
                )}

                {uploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2" />
                            <p className="text-white text-sm">Uploading...</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Hidden File Input */}
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Actions */}
            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => inputRef.current?.click()}
                    disabled={uploading}
                >
                    {uploading ? "Uploading..." : previewUrl ? "Replace" : label}
                </Button>
                {previewUrl && onRemove && (
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleRemove}
                        disabled={uploading}
                    >
                        Remove
                    </Button>
                )}
            </div>

            {/* Error */}
            {error && (
                <p className="text-destructive text-xs">{error}</p>
            )}
        </div>
    );
}
