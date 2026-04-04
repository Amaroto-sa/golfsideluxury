import { createBooking } from "@/app/actions/bookings";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const result = await createBooking(formData);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
    }
}
