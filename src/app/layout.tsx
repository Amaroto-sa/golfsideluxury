import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import React from "react";
import Providers from "@/components/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
    title: "Golfside Luxury Hotel | Premium Accommodation in Asaba",
    description:
        "Experience uncompromised luxury and comfort at Golfside Luxury Hotel, Asaba. Thoughtfully designed rooms, excellent dining, and premium amenities for business and leisure travelers.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="light">
            <body
                className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}
            >
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
