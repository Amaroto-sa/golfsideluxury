import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
    updateRoomCategoryCoverImage,
    removeRoomCategoryCoverImage,
} from "@/app/actions/content";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { categoryId, url, publicId, action } = body;

        if (!categoryId) {
            return NextResponse.json({ error: "Missing categoryId" }, { status: 400 });
        }

        if (action === "remove") {
            await removeRoomCategoryCoverImage(categoryId);
        } else {
            if (!url || !publicId) {
                return NextResponse.json({ error: "Missing url or publicId" }, { status: 400 });
            }
            await updateRoomCategoryCoverImage(categoryId, url, publicId);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Room cover error:", error);
        return NextResponse.json({ error: "Operation failed" }, { status: 500 });
    }
}
