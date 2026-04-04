import React from "react";
import prisma from "@/lib/prisma";
import { SettingsClient } from "@/components/admin/settings-client";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
    let settings: any = null;
    let amenities: any[] = [];
    let rules: any[] = [];
    let socialLinks: any[] = [];
    let galleryImages: any[] = [];

    try {
        settings = await prisma.hotelSettings.findFirst();
        amenities = await prisma.amenity.findMany({ orderBy: { name: "asc" } });
        rules = await prisma.rulePolicy.findMany({ orderBy: { order: "asc" } });
        socialLinks = await prisma.socialLink.findMany();
        galleryImages = await prisma.galleryImage.findMany({ orderBy: { order: "asc" } });
    } catch { }

    const s = settings || {
        hotelName: "Golfside Luxury Hotel",
        phoneNumber: "09151933333",
        email: "info@golfsideluxury.com",
        address: "3, Are Odesa T.G Drive, Off 74 Road, By Ibori Golf Course, Asaba, Delta State",
        checkInTime: "05:00 AM",
        checkOutTime: "12:00 Noon",
        aboutText: "Golfside Luxury Hotel offers a welcoming atmosphere...",
        bookingPolicy: "Full payment to log booking. Half payment for reservation.",
        logoUrl: null,
        faviconUrl: null,
        homepageHero: null,
        emailNotificationTemplate: "<h2>New Booking Alert</h2>\n<p><strong>Guest:</strong> {{guestName}}</p>\n<p><strong>Room:</strong> {{roomInfo}}</p>\n<p><strong>Check-in:</strong> {{checkIn}}</p>\n<p><strong>Check-out:</strong> {{checkOut}}</p>\n<p><strong>Amount:</strong> {{totalAmount}}</p>\n<br/><p>Login to the admin dashboard to view details.</p>",
    };

    return (
        <SettingsClient
            settings={s}
            amenities={amenities}
            rules={rules}
            socialLinks={socialLinks}
            galleryImages={galleryImages}
        />
    );
}
