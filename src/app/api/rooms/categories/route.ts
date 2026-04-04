import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const categories = await prisma.roomCategory.findMany({
            include: {
                rooms: {
                    select: { id: true, roomNumber: true, status: true },
                },
            },
            orderBy: { price: "asc" },
        });
        return NextResponse.json(categories);
    } catch {
        return NextResponse.json([]);
    }
}
