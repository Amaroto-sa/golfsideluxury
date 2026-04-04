import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateHotelSettings } from "@/app/actions/settings";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const result = await updateHotelSettings(formData);
        // Redirect back to settings page after save
        return NextResponse.redirect(new URL("/admin/settings", request.url));
    } catch (error) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}
