// Cloudinary server-side SDK utility
// Handles upload, delete, and URL generation

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export default cloudinary;

// ─── Upload from Buffer/Base64 ───────────────────────────────────
export async function uploadImage(
    fileBuffer: Buffer,
    options: {
        folder?: string;
        publicId?: string;
        transformation?: object[];
    } = {}
): Promise<{
    url: string;
    publicId: string;
    width: number;
    height: number;
    format: string;
}> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: options.folder || "golfside",
                public_id: options.publicId,
                resource_type: "image",
                overwrite: true,
                transformation: options.transformation,
            },
            (error, result) => {
                if (error || !result) {
                    reject(error || new Error("Upload failed"));
                } else {
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                        width: result.width,
                        height: result.height,
                        format: result.format,
                    });
                }
            }
        );
        uploadStream.end(fileBuffer);
    });
}

// ─── Delete by Public ID ─────────────────────────────────────────
export async function deleteImage(publicId: string) {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return { success: result.result === "ok" };
    } catch (error) {
        console.error("Cloudinary delete error:", error);
        return { success: false };
    }
}

// ─── Generate Optimized URL ──────────────────────────────────────
// Use this for server-side URL generation with transformations
export function getOptimizedUrl(
    publicId: string,
    options: {
        width?: number;
        height?: number;
        crop?: string;
        quality?: string | number;
        format?: string;
    } = {}
) {
    return cloudinary.url(publicId, {
        fetch_format: options.format || "auto",
        quality: options.quality || "auto",
        width: options.width,
        height: options.height,
        crop: options.crop || "fill",
        secure: true,
    });
}

// ─── Folder constants ────────────────────────────────────────────
export const CLOUDINARY_FOLDERS = {
    GALLERY: "golfside/gallery",
    ROOMS: "golfside/rooms",
    BRANDING: "golfside/branding",
    HERO: "golfside/hero",
} as const;
