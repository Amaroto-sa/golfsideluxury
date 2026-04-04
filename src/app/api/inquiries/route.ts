import { submitInquiry } from "@/app/actions/inquiries";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const result = await submitInquiry(formData);
        return NextResponse.json(result);
    } catch {
        return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
    }
}
