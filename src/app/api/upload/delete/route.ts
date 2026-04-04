import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteImage } from "@/lib/cloudinary";

export async function POST(request: Request) {
    // Auth check — only admin can delete images
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { publicId } = await request.json();
        if (!publicId) {
            return NextResponse.json({ error: "No publicId provided" }, { status: 400 });
        }

        const result = await deleteImage(publicId);
        return NextResponse.json(result);
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}
