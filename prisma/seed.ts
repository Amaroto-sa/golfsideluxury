import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // ─── Admin User ────────────────────────────────────────────────
    const adminPassword = await hash(process.env.ADMIN_PASSWORD || "admin123", 12);
    await prisma.adminUser.upsert({
        where: { email: process.env.ADMIN_EMAIL || "admin@golfsideluxury.com" },
        update: {},
        create: {
            email: process.env.ADMIN_EMAIL || "admin@golfsideluxury.com",
            password: adminPassword,
            name: "Hotel Admin",
            role: "SUPER_ADMIN",
        },
    });
    console.log("✅ Admin user created");

    // ─── Hotel Settings ────────────────────────────────────────────
    const existingSettings = await prisma.hotelSettings.findFirst();
    if (!existingSettings) {
        await prisma.hotelSettings.create({
            data: {
                hotelName: "Golfside Luxury Hotel",
                aboutText:
                    "Golfside Luxury Hotel offers a welcoming atmosphere, blending comfort with convenience for every guest. The rooms are thoughtfully designed to provide a cozy space and refreshing relaxation spot. Our amenities cater for both leisure and business travelers. Guests can enjoy excellent dining, friendly service, and easy access to local attractions. Whether you intend to stay for a night, a week, or more, we aim to make your visit enjoyable and memorable.",
                phoneNumber: "09151933333",
                email: "info@golfsideluxury.com",
                address: "3, Are Odesa T.G Drive, Off 74 Road, By Ibori Golf Course, Asaba, Delta State",
                checkInTime: "05:00 AM",
                checkOutTime: "12:00 Noon",
                bookingPolicy:
                    "Full payment is required to log a booking. Half payment is required for a reservation. For contact, guests should call the hotel phone number.",
            },
        });
        console.log("✅ Hotel settings created");
    }

    // ─── Room Categories ───────────────────────────────────────────
    const categoryData = [
        { name: "Standard", price: 25000, description: "Comfortable and cozy standard room offering essential amenities for a restful stay." },
        { name: "Classic", price: 30000, description: "Elevated comfort and timeless style with refined furnishings and a welcoming ambience." },
        { name: "Deluxe", price: 35000, description: "Premium luxury for the discerning guest, featuring spacious interiors and upscale amenities." },
        { name: "Executive", price: 40000, description: "Sophisticated and elegant executive suite designed for business and leisure excellence." },
        { name: "Diplomat", price: 45000, description: "Our finest offering — an exclusive diplomat suite with the pinnacle of luxury and service." },
    ];

    for (const cat of categoryData) {
        const existing = await prisma.roomCategory.findFirst({ where: { name: cat.name } });
        if (!existing) {
            await prisma.roomCategory.create({ data: cat });
        }
    }
    console.log("✅ Room categories created");

    // ─── Rooms ─────────────────────────────────────────────────────
    const roomAssignments: Record<string, string[]> = {
        Standard: ["102", "204", "202", "104", "109"],
        Classic: ["103", "101", "110", "108", "107", "105"],
        Deluxe: ["205", "207", "206", "212", "211", "111", "106", "203", "209", "208"],
        Executive: ["201", "100"],
        Diplomat: ["210", "200"],
    };

    for (const [catName, roomNumbers] of Object.entries(roomAssignments)) {
        const category = await prisma.roomCategory.findFirst({ where: { name: catName } });
        if (category) {
            for (const roomNumber of roomNumbers) {
                const existing = await prisma.room.findUnique({ where: { roomNumber } });
                if (!existing) {
                    await prisma.room.create({
                        data: {
                            roomNumber,
                            categoryId: category.id,
                            status: "AVAILABLE",
                        },
                    });
                }
            }
        }
    }
    console.log("✅ Rooms created");

    // ─── Amenities ─────────────────────────────────────────────────
    const amenityData = [
        { name: "Wi-Fi", icon: "📶" },
        { name: "AC", icon: "❄️" },
        { name: "Power", icon: "⚡" },
        { name: "Security", icon: "🛡️" },
        { name: "Restaurant", icon: "🍽️" },
        { name: "Parking", icon: "🅿️" },
    ];

    for (const amenity of amenityData) {
        const existing = await prisma.amenity.findFirst({ where: { name: amenity.name } });
        if (!existing) {
            await prisma.amenity.create({ data: amenity });
        }
    }
    console.log("✅ Amenities created");

    // ─── Rules ─────────────────────────────────────────────────────
    const ruleData = [
        { title: "No Smoking", content: "Smoking is strictly prohibited inside all hotel rooms.", order: 1 },
        { title: "Room Occupancy", content: "Only two adults are allowed in a room at any time.", order: 2 },
    ];

    for (const rule of ruleData) {
        const existing = await prisma.rulePolicy.findFirst({ where: { title: rule.title } });
        if (!existing) {
            await prisma.rulePolicy.create({ data: rule });
        }
    }
    console.log("✅ Rules created");

    // ─── Social Links ──────────────────────────────────────────────
    const socialData = [
        { platform: "TikTok", url: "https://www.tiktok.com/@golfsideluxuryasaba" },
    ];

    for (const social of socialData) {
        const existing = await prisma.socialLink.findFirst({ where: { platform: social.platform } });
        if (!existing) {
            await prisma.socialLink.create({ data: social });
        }
    }
    console.log("✅ Social links created");

    console.log("\n🎉 Seeding complete!");
}

main()
    .catch((e) => {
        console.error("❌ Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
