import React from "react";
import { getHotelSettings, getSocialLinks } from "@/lib/data-fetchers";
import PublicLayout from "./layout";

export default async function PublicTemplate({ children }: { children: React.ReactNode }) {
    const settings = await getHotelSettings();
    const socialLinks = await getSocialLinks();

    return (
        <PublicLayout settings={settings} socialLinks={socialLinks}>
            {children}
        </PublicLayout>
    );
}
