import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getHotelSettings, getSocialLinks } from "@/lib/data-fetchers";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
    const settings = await getHotelSettings();
    const socialLinks = await getSocialLinks();

    return (
        <>
            {/* ─── Navigation ───────────────────────────────────────── */}
            <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-lg border-b border-border transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-28 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                        {settings.logoUrl ? (
                            <Image
                                src={settings.logoUrl.includes("res.cloudinary.com") ? settings.logoUrl.replace("/upload/", "/upload/f_auto,q_auto,h_80/") : settings.logoUrl}
                                alt={settings.hotelName}
                                width={48}
                                height={48}
                                className="h-12 w-auto object-contain"
                                priority
                            />
                        ) : null}
                        <span className="font-serif text-2xl tracking-widest text-primary font-bold">
                            {settings.hotelName}
                        </span>
                    </Link>
                    <nav className="space-x-10 text-xs uppercase tracking-[0.2em] hidden md:flex items-center">
                        <Link href="/" className="hover:text-primary transition-colors py-2">Home</Link>
                        <Link href="/rooms" className="hover:text-primary transition-colors py-2">Rooms</Link>
                        <Link href="/gallery" className="hover:text-primary transition-colors py-2">Gallery</Link>
                        <Link href="/contact" className="hover:text-primary transition-colors py-2">Contact</Link>
                        <Link
                            href="/booking"
                            className="bg-primary text-primary-foreground px-8 py-3.5 hover:bg-white hover:text-black hover:border-white transition-all duration-500 font-semibold tracking-[0.15em] border border-primary shadow-[0_0_15px_-3px_hsl(var(--primary)/0.4)]"
                        >
                            Book Now
                        </Link>
                    </nav>

                    {/* Mobile Nav Toggle */}
                    <button className="md:hidden text-primary" aria-label="Open menu">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 pt-28">{children}</main>

            {/* ─── Footer ────────────────────────────────────────────── */}
            <footer className="bg-background border-t border-border mt-auto">
                <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-4 gap-12">
                    <div className="md:col-span-1">
                        {settings.logoUrl && (
                            <Image
                                src={settings.logoUrl.includes("res.cloudinary.com") ? settings.logoUrl.replace("/upload/", "/upload/f_auto,q_auto,h_100/") : settings.logoUrl}
                                alt={settings.hotelName}
                                width={80}
                                height={80}
                                className="h-16 w-auto object-contain mb-4"
                            />
                        )}
                        <h4 className="font-serif text-xl mb-4 text-primary">{settings.hotelName}</h4>
                        <p className="text-muted-foreground text-sm leading-loose">{settings.address}</p>
                    </div>
                    <div>
                        <h4 className="font-serif text-lg mb-4 text-primary">Contact</h4>
                        <p className="text-muted-foreground text-sm mb-2">Phone: {settings.phoneNumber}</p>
                        <p className="text-muted-foreground text-sm">Email: {settings.email}</p>
                    </div>
                    <div>
                        <h4 className="font-serif text-lg mb-4 text-primary">Hours</h4>
                        <p className="text-muted-foreground text-sm mb-2">Check-in: {settings.checkInTime}</p>
                        <p className="text-muted-foreground text-sm">Check-out: {settings.checkOutTime}</p>
                    </div>
                    <div>
                        <h4 className="font-serif text-lg mb-4 text-primary">Follow Us</h4>
                        {socialLinks.length > 0 ? (
                            <div className="space-y-2">
                                {socialLinks.map((link) => (
                                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm hover:text-primary transition-colors block">
                                        {link.platform}
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-sm">TikTok: @golfsideluxuryasaba</p>
                        )}
                    </div>
                </div>
                <div className="border-t border-border/30 py-6 text-center text-muted-foreground text-xs">
                    &copy; {new Date().getFullYear()} {settings.hotelName}. All rights reserved.
                </div>
            </footer>
        </>
    );
}
