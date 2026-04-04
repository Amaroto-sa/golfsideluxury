// Enhanced data fetcher for all public page data
import prisma from "./prisma";

export async function getHotelSettings() {
    try {
        const settings = await prisma.hotelSettings.findFirst();
        return settings || getDefaultSettings();
    } catch {
        return getDefaultSettings();
    }
}

function getDefaultSettings() {
    return {
        id: "",
        hotelName: "Golfside Luxury Hotel",
        phoneNumber: "09151933333",
        email: "info@golfsideluxury.com",
        address: "3, Are Odesa T.G Drive, Off 74 Road, By Ibori Golf Course, Asaba, Delta State",
        aboutText:
            "Golfside Luxury Hotel offers a welcoming atmosphere, blending comfort with convenience for every guest. The rooms are thoughtfully designed to provide a cozy space and refreshing relaxation spot. Our amenities cater for both leisure and business travelers. Guests can enjoy excellent dining, friendly service, and easy access to local attractions. Whether you intend to stay for a night, a week, or more, we aim to make your visit enjoyable and memorable.",
        checkInTime: "05:00 AM",
        checkOutTime: "12:00 Noon",
        logoUrl: null,
        faviconUrl: null,
        homepageHero: null,
        bookingPolicy: "Full payment to log booking. Half payment for reservation. For contact, guests should call the hotel phone number.",
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}

export async function getRoomCategories() {
    try {
        return await prisma.roomCategory.findMany({
            include: {
                rooms: true,
                _count: { select: { rooms: true } },
            },
            orderBy: { price: "asc" },
        });
    } catch {
        return [];
    }
}

export async function getAvailableRoomsByCategory(categoryId: string) {
    try {
        return await prisma.room.findMany({
            where: { categoryId, status: "AVAILABLE" },
            orderBy: { roomNumber: "asc" },
        });
    } catch {
        return [];
    }
}

export async function getAmenities() {
    try {
        return await prisma.amenity.findMany({ orderBy: { name: "asc" } });
    } catch {
        return [];
    }
}

export async function getRulesAndPolicies() {
    try {
        return await prisma.rulePolicy.findMany({ orderBy: { order: "asc" } });
    } catch {
        return [];
    }
}

export async function getGalleryImages() {
    try {
        return await prisma.galleryImage.findMany({ orderBy: { order: "asc" } });
    } catch {
        return [];
    }
}

export async function getSocialLinks() {
    try {
        return await prisma.socialLink.findMany();
    } catch {
        return [];
    }
}

export async function getFeaturedTestimonials() {
    try {
        return await prisma.testimonial.findMany({
            where: { isFeatured: true },
            orderBy: { createdAt: "desc" },
            take: 6,
        });
    } catch {
        return [];
    }
}
