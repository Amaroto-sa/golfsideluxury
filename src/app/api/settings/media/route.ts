import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
    updateLogo, removeLogo,
    updateFavicon, removeFavicon,
    updateHeroImage, removeHeroImage,
} from "@/app/actions/settings";
import {
    createGalleryImage,
    deleteGalleryImage,
} from "@/app/actions/content";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { type, action, url, publicId, width, height, galleryId } = body;

        switch (type) {
            case "logo":
                if (action === "remove") {
                    await removeLogo();
                } else {
                    await updateLogo(url, publicId);
                }
                break;

            case "favicon":
                if (action === "remove") {
                    await removeFavicon();
                } else {
                    await updateFavicon(url, publicId);
                }
                break;

            case "hero":
                if (action === "remove") {
                    await removeHeroImage();
                } else {
                    await updateHeroImage(url, publicId);
                }
                break;

            case "gallery":
                await createGalleryImage(url, publicId, undefined, width, height);
                break;

            case "gallery-delete":
                if (galleryId) {
                    await deleteGalleryImage(galleryId);
                }
                break;

            default:
                return NextResponse.json({ error: "Unknown type" }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Settings media error:", error);
        return NextResponse.json({ error: "Operation failed" }, { status: 500 });
    }
}
