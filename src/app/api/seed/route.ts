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
                message: "Database already seeded. Admin user exists. To re-seed, delete all data first.",
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

        // ─── 3. Create Room Categories (ACCURATE RATES) ──────────

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
                price: 30000,
            },
        });

        const deluxe = await prisma.roomCategory.create({
            data: {
                name: "Deluxe",
                description: "Spacious rooms with upscale decor, offering a refined experience.",
                price: 35000,
            },
        });

        const executive = await prisma.roomCategory.create({
            data: {
                name: "Executive",
                description: "Premium suites designed for distinguished guests seeking top-tier comfort.",
                price: 40000,
            },
        });

        const diplomat = await prisma.roomCategory.create({
            data: {
                name: "Diplomat",
                description: "Our finest suites with exclusive perks, spacious layout and VIP treatment.",
                price: 45000,
            },
        });

        // ─── 4. Create Rooms (ACCURATE ROOM NUMBERS) ─────────────

        // Standard ₦25,000 — Rooms: 102, 204, 202, 104, 109
        const standardRooms = ["102", "204", "202", "104", "109"];
        for (const num of standardRooms) {
            await prisma.room.create({ data: { roomNumber: num, categoryId: standard.id } });
        }

        // Classic ₦30,000 — Rooms: 103, 101, 110, 108, 107, 105
        const classicRooms = ["103", "101", "110", "108", "107", "105"];
        for (const num of classicRooms) {
            await prisma.room.create({ data: { roomNumber: num, categoryId: classic.id } });
        }

        // Deluxe ₦35,000 — Rooms: 205, 207, 206, 212, 211, 111, 106, 203, 209, 208
        const deluxeRooms = ["205", "207", "206", "212", "211", "111", "106", "203", "209", "208"];
        for (const num of deluxeRooms) {
            await prisma.room.create({ data: { roomNumber: num, categoryId: deluxe.id } });
        }

        // Executive ₦40,000 — Rooms: 201, 100
        const executiveRooms = ["201", "100"];
        for (const num of executiveRooms) {
            await prisma.room.create({ data: { roomNumber: num, categoryId: executive.id } });
        }

        // Diplomat ₦45,000 — Rooms: 210, 200
        const diplomatRooms = ["210", "200"];
        for (const num of diplomatRooms) {
            await prisma.room.create({ data: { roomNumber: num, categoryId: diplomat.id } });
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

        const totalRooms = standardRooms.length + classicRooms.length + deluxeRooms.length + executiveRooms.length + diplomatRooms.length;

        return NextResponse.json({
            message: "✅ Database seeded successfully!",
            seeded: true,
            admin: { email: adminEmail },
            totalRooms,
            categories: {
                Standard: { price: 25000, rooms: standardRooms },
                Classic: { price: 30000, rooms: classicRooms },
                Deluxe: { price: 35000, rooms: deluxeRooms },
                Executive: { price: 40000, rooms: executiveRooms },
                Diplomat: { price: 45000, rooms: diplomatRooms },
            },
        });
    } catch (error: any) {
        console.error("Seed error:", error);
        return NextResponse.json(
            { error: "Seed failed", details: error.message },
            { status: 500 }
        );
    }
}
