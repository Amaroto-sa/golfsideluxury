import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getHotelSettings, getSocialLinks } from "@/lib/data-fetchers";
import { WhatsAppWidget } from "@/components/whatsapp-widget";
import { Instagram, Facebook, Phone, Mail, MapPin } from "lucide-react";

/** Simple helper to render TikTok logo since Lucide-React doesn't have it natively */
const TikTokIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className="opacity-80">
        <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-3.932 1.328A6.34 6.34 0 0 0 2.25 15.633c.007 1.56.574 3.051 1.594 4.195a6.344 6.344 0 0 0 9.173.469 6.254 6.254 0 0 0 1.838-4.409V7.943a8.231 8.231 0 0 0 5.312 1.884v-3.141a4.77 4.77 0 0 1-.578-.000z" />
    </svg>
);

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
    const settings = await getHotelSettings();
    const socialLinks = await getSocialLinks();

    const renderSocialIcon = (platform: string) => {
        const p = platform.toLowerCase();
        if (p.includes("tiktok")) return <TikTokIcon />;
        if (p.includes("instagram")) return <Instagram size={18} className="opacity-80" />;
        if (p.includes("facebook")) return <Facebook size={18} className="opacity-80" />;
        return <span className="text-xs uppercase tracking-widest font-bold opacity-60">Icon</span>;
    };

    return (
        <>
            {/* ─── Navigation ───────────────────────────────────────── */}
            <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-lg border-b border-border transition-all duration-300 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-28 flex justify-between items-center text-foreground">
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
                            className="bg-primary text-primary-foreground px-8 py-3.5 hover:bg-white hover:text-black hover:border-white transition-all duration-500 font-semibold tracking-[0.15em] border border-primary shadow-[0_4px_20px_-5px_hsl(var(--primary)/0.6)]"
                        >
                            Book Now
                        </Link>
                    </nav>

                    {/* Mobile Nav Toggle */}
                    <button className="md:hidden text-primary p-2 focus:outline-none" aria-label="Open menu">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 pt-28">{children}</main>

            {/* Floating Elements */}
            <WhatsAppWidget phoneNumber={settings.phoneNumber} />

            {/* ─── Footer ────────────────────────────────────────────── */}
            <footer className="bg-background border-t border-border mt-auto">
                <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-4 gap-12 lg:gap-20">
                    <div className="md:col-span-1 border-r border-border/20 pr-0 md:pr-12">
                        {settings.logoUrl && (
                            <Image
                                src={settings.logoUrl.includes("res.cloudinary.com") ? settings.logoUrl.replace("/upload/", "/upload/f_auto,q_auto,h_100/") : settings.logoUrl}
                                alt={settings.hotelName}
                                width={80}
                                height={80}
                                className="h-16 w-auto object-contain mb-6 grayscale hover:grayscale-0 transition-all duration-500"
                            />
                        )}
                        <h4 className="font-serif text-2xl mb-4 text-primary">{settings.hotelName}</h4>
                        <p className="text-muted-foreground text-sm leading-loose font-light italic">{settings.address}</p>
                    </div>
                    <div>
                        <h4 className="font-serif text-lg mb-6 text-primary tracking-widest uppercase text-xs font-bold">Contact Info</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Phone size={16} className="text-primary/60" />
                                <p className="text-muted-foreground text-sm font-light">{settings.phoneNumber}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail size={16} className="text-primary/60" />
                                <p className="text-muted-foreground text-sm font-light">{settings.email}</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin size={16} className="text-primary/60 shrink-0 mt-0.5" />
                                <p className="text-muted-foreground text-sm leading-relaxed font-light">{settings.address}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-serif text-lg mb-6 text-primary tracking-widest uppercase text-xs font-bold">Hotel Hours</h4>
                        <div className="space-y-3">
                            <div>
                                <p className="text-primary/60 text-[10px] uppercase tracking-widest font-bold mb-1">Check-In</p>
                                <p className="text-muted-foreground text-sm font-light">{settings.checkInTime}</p>
                            </div>
                            <div>
                                <p className="text-primary/60 text-[10px] uppercase tracking-widest font-bold mb-1">Check-Out</p>
                                <p className="text-muted-foreground text-sm font-light">{settings.checkOutTime}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-serif text-lg mb-6 text-primary tracking-widest uppercase text-xs font-bold">Social Media</h4>
                        <div className="flex flex-wrap gap-3">
                            {socialLinks.length > 0 ? (
                                socialLinks.map((link) => (
                                    <a
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-card border border-border/50 hover:border-primary hover:text-primary transition-all p-4 rounded-xl shadow-sm text-foreground active:scale-95 group flex items-center justify-center"
                                        title={link.platform}
                                    >
                                        {renderSocialIcon(link.platform)}
                                    </a>
                                ))
                            ) : (
                                <p className="text-muted-foreground text-xs font-light">Configure your social links in admin.</p>
                            )}
                        </div>
                        <p className="mt-8 text-[11px] text-muted-foreground/60 uppercase tracking-[0.2em] leading-relaxed">
                            Follow us for more <span className="text-primary/80 italic">Luxury Updates</span>
                        </p>
                    </div>
                </div>
                <div className="border-t border-border/20 py-8 text-center text-muted-foreground text-[10px] uppercase tracking-[0.3em] font-light">
                    &copy; {new Date().getFullYear()} {settings.hotelName}. <span className="opacity-40">Luxury Living in Asaba.</span>
                </div>
            </footer>
        </>
    );
}
