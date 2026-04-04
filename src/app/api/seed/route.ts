import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";

// ONE-TIME seed endpoint
// Visit: https://your-domain.vercel.app/api/seed
// After seeding, DELETE this file or remove the route for security

export async function GET() {
    try {
        // Check if already seeded
        const existingAdmin = await prisma.adminUser.findFirst();
        if (existingAdmin) {
            return NextResponse.json({
                message: "Database already seeded. Admin user exists.",
                seeded: false,
            });
        }

        const adminEmail = process.env.ADMIN_EMAIL || "admin@golfsideluxury.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

        // ─── 1. Create Admin User ────────────────────────────────
        const hashedPassword = await hash(adminPassword, 12);
        await prisma.adminUser.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                name: "Super Admin",
                role: "SUPER_ADMIN",
            },
        });

        // ─── 2. Create Hotel Settings ────────────────────────────
        await prisma.hotelSettings.create({
            data: {
                hotelName: "Golfside Luxury Hotel",
                aboutText:
                    "Golfside Luxury Hotel offers a welcoming atmosphere with thoughtfully designed rooms for both business and leisure travelers. Located by the Ibori Golf Course in the heart of Asaba, our hotel combines modern comfort with warm Nigerian hospitality.",
                phoneNumber: "09151933333",
                email: "info@golfsideluxury.com",
                address:
                    "3, Are Odesa T.G Drive, Off 74 Road, By Ibori Golf Course, Asaba, Delta State",
                checkInTime: "05:00 AM",
                checkOutTime: "12:00 Noon",
                bookingPolicy:
                    "Full payment to log booking. Half payment for reservation. Payment confirms your booking.",
            },
        });

        // ─── 3. Create Room Categories ───────────────────────────
        const standard = await prisma.roomCategory.create({
            data: {
                name: "Standard",
                description: "Comfortable and well-appointed rooms for an affordable luxury stay.",
                price: 25000,
            },
        });

        const classic = await prisma.roomCategory.create({
            data: {
                name: "Classic",
                description: "Elegant rooms with premium furnishings and enhanced amenities.",
                price: 35000,
            },
        });

        const diplomat = await prisma.roomCategory.create({
            data: {
                name: "Diplomat",
                description: "Our finest suites with exclusive perks, spacious layout and VIP treatment.",
                price: 50000,
            },
        });

        // ─── 4. Create Rooms ─────────────────────────────────────
        const roomData = [
            { roomNumber: "101", categoryId: standard.id },
            { roomNumber: "102", categoryId: standard.id },
            { roomNumber: "103", categoryId: standard.id },
            { roomNumber: "201", categoryId: classic.id },
            { roomNumber: "202", categoryId: classic.id },
            { roomNumber: "203", categoryId: classic.id },
            { roomNumber: "301", categoryId: diplomat.id },
            { roomNumber: "302", categoryId: diplomat.id },
        ];

        for (const room of roomData) {
            await prisma.room.create({ data: room });
        }

        // ─── 5. Create Amenities ─────────────────────────────────
        const amenities = [
            { name: "Wi-Fi", icon: "📶" },
            { name: "AC", icon: "❄️" },
            { name: "Power (24/7)", icon: "⚡" },
            { name: "Security", icon: "🛡️" },
            { name: "Restaurant", icon: "🍽️" },
            { name: "Parking", icon: "🅿️" },
        ];

        for (const amenity of amenities) {
            await prisma.amenity.create({ data: amenity });
        }

        // ─── 6. Create Rules & Policies ──────────────────────────
        const rules = [
            { title: "No Smoking", content: "Smoking is strictly prohibited inside all hotel rooms and common areas.", order: 1 },
            { title: "Occupancy", content: "Only two adults are allowed in a room at any time.", order: 2 },
            { title: "Pets", content: "No pets are allowed on the hotel premises.", order: 3 },
            { title: "Quiet Hours", content: "Please maintain quiet between 10 PM and 6 AM.", order: 4 },
        ];

        for (const rule of rules) {
            await prisma.rulePolicy.create({ data: rule });
        }

        // ─── 7. Create Social Links ──────────────────────────────
        await prisma.socialLink.create({
            data: {
                platform: "TikTok",
                url: "https://tiktok.com/@golfsideluxuryasaba",
                icon: "🎵",
            },
        });

        return NextResponse.json({
            message: "✅ Database seeded successfully!",
            seeded: true,
            admin: { email: adminEmail },
            rooms: roomData.length,
            categories: 3,
        });
    } catch (error: any) {
        console.error("Seed error:", error);
        return NextResponse.json(
            { error: "Seed failed", details: error.message },
            { status: 500 }
        );
    }
}
