import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // ─── 1. Admin User ────────────────────────────────────────
    const adminEmail = process.env.ADMIN_EMAIL || "admin@golfsideluxury.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const hashedPassword = await hash(adminPassword, 12);

    await prisma.adminUser.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            password: hashedPassword,
            name: "Super Admin",
            role: "SUPER_ADMIN",
        },
    });
    console.log("✅ Admin user created");

    // ─── 2. Hotel Settings ────────────────────────────────────
    const existingSettings = await prisma.hotelSettings.findFirst();
    if (!existingSettings) {
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
        console.log("✅ Hotel settings created");
    }

    // ─── 3. Room Categories (ACCURATE RATES) ──────────────────

    const standard = await prisma.roomCategory.create({
        data: { name: "Standard", description: "Comfortable and well-appointed rooms for an affordable luxury stay.", price: 25000 },
    });

    const classic = await prisma.roomCategory.create({
        data: { name: "Classic", description: "Elegant rooms with premium furnishings and enhanced amenities.", price: 30000 },
    });

    const deluxe = await prisma.roomCategory.create({
        data: { name: "Deluxe", description: "Spacious rooms with upscale decor, offering a refined experience.", price: 35000 },
    });

    const executive = await prisma.roomCategory.create({
        data: { name: "Executive", description: "Premium suites designed for distinguished guests seeking top-tier comfort.", price: 40000 },
    });

    const diplomat = await prisma.roomCategory.create({
        data: { name: "Diplomat", description: "Our finest suites with exclusive perks, spacious layout and VIP treatment.", price: 45000 },
    });

    console.log("✅ Room categories created");

    // ─── 4. Rooms (ACCURATE ROOM NUMBERS) ─────────────────────

    // Standard ₦25,000
    for (const num of ["102", "204", "202", "104", "109"]) {
        await prisma.room.create({ data: { roomNumber: num, categoryId: standard.id } });
    }

    // Classic ₦30,000
    for (const num of ["103", "101", "110", "108", "107", "105"]) {
        await prisma.room.create({ data: { roomNumber: num, categoryId: classic.id } });
    }

    // Deluxe ₦35,000
    for (const num of ["205", "207", "206", "212", "211", "111", "106", "203", "209", "208"]) {
        await prisma.room.create({ data: { roomNumber: num, categoryId: deluxe.id } });
    }

    // Executive ₦40,000
    for (const num of ["201", "100"]) {
        await prisma.room.create({ data: { roomNumber: num, categoryId: executive.id } });
    }

    // Diplomat ₦45,000
    for (const num of ["210", "200"]) {
        await prisma.room.create({ data: { roomNumber: num, categoryId: diplomat.id } });
    }

    console.log("✅ 25 rooms created");

    // ─── 5. Amenities ─────────────────────────────────────────
    const amenities = [
        { name: "Wi-Fi", icon: "📶" },
        { name: "AC", icon: "❄️" },
        { name: "Power (24/7)", icon: "⚡" },
        { name: "Security", icon: "🛡️" },
        { name: "Restaurant", icon: "🍽️" },
        { name: "Parking", icon: "🅿️" },
    ];
    for (const a of amenities) {
        await prisma.amenity.create({ data: a });
    }
    console.log("✅ Amenities created");

    // ─── 6. Rules & Policies ──────────────────────────────────
    const rules = [
        { title: "No Smoking", content: "Smoking is strictly prohibited inside all hotel rooms and common areas.", order: 1 },
        { title: "Occupancy", content: "Only two adults are allowed in a room at any time.", order: 2 },
        { title: "Pets", content: "No pets are allowed on the hotel premises.", order: 3 },
        { title: "Quiet Hours", content: "Please maintain quiet between 10 PM and 6 AM.", order: 4 },
    ];
    for (const r of rules) {
        await prisma.rulePolicy.create({ data: r });
    }
    console.log("✅ Rules created");

    // ─── 7. Social Links ──────────────────────────────────────
    await prisma.socialLink.create({
        data: { platform: "TikTok", url: "https://tiktok.com/@golfsideluxuryasaba", icon: "🎵" },
    });
    console.log("✅ Social links created");

    console.log("\n🎉 Seed complete! 25 rooms across 5 categories.");
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
