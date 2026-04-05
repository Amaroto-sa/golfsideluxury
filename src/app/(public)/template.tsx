import React from "react";
import { getHotelSettings, getSocialLinks } from "@/lib/data-fetchers";
import { PublicShell } from "@/components/public-shell";

/**
 * Next.js template for the (public) route group.
 * Fetches settings/social data on the server and passes them to
 * the client-side PublicShell (nav + footer + mobile menu).
 */
export default async function PublicTemplate({ children }: { children: React.ReactNode }) {
    const settings = await getHotelSettings();
    const socialLinks = await getSocialLinks();

    return (
        <PublicShell settings={settings} socialLinks={socialLinks}>
            {children}
        </PublicShell>
    );
}
