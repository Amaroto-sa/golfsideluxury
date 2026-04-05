"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { WhatsAppWidget } from "@/components/whatsapp-widget";
import { Instagram, Facebook, Phone, Mail, MapPin, Menu, X } from "lucide-react";

const TikTokIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className="opacity-80">
        <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-3.932 1.328A6.34 6.34 0 0 0 2.25 15.633c.007 1.56.574 3.051 1.594 4.195a6.344 6.344 0 0 0 9.173.469 6.254 6.254 0 0 0 1.838-4.409V7.943a8.231 8.231 0 0 0 5.312 1.884v-3.141a4.77 4.77 0 0 1-.578-.000z" />
    </svg>
);

interface PublicShellProps {
    children: React.ReactNode;
    settings: any;
    socialLinks: any[];
}

export function PublicShell({
    children,
    settings = {},
    socialLinks = []
}: PublicShellProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const closeMenu = useCallback(() => setIsMenuOpen(false), []);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isMenuOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeMenu();
        };
        if (isMenuOpen) {
            window.addEventListener("keydown", handleEsc);
        }
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isMenuOpen, closeMenu]);

    const renderSocialIcon = (platform: string) => {
        const p = platform.toLowerCase();
        if (p.includes("tiktok")) return <TikTokIcon />;
        if (p.includes("instagram")) return <Instagram size={18} className="opacity-80" />;
        if (p.includes("facebook")) return <Facebook size={18} className="opacity-80" />;
        return <span className="text-xs uppercase tracking-widest font-bold opacity-60">Icon</span>;
    };

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/rooms", label: "Rooms" },
        { href: "/gallery", label: "Gallery" },
        { href: "/contact", label: "Contact" },
    ];

    const hotelName = settings?.hotelName || "Golfside Luxury Hotel";
    const phoneNumber = settings?.phoneNumber || "";

    return (
        <>
            {/* ─── Top Navigation Bar ───────────────────────────────── */}
            <header className="fixed top-0 w-full z-40 bg-background/95 backdrop-blur-lg border-b border-border transition-all duration-300 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-24 lg:h-28 flex justify-between items-center text-foreground">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                        {settings?.logoUrl && (
                            <Image
                                src={settings.logoUrl.includes("res.cloudinary.com") ? settings.logoUrl.replace("/upload/", "/upload/f_auto,q_auto,h_80/") : settings.logoUrl}
                                alt={hotelName}
                                width={48}
                                height={48}
                                className="h-10 lg:h-12 w-auto object-contain"
                                priority
                            />
                        )}
                        <span className="font-serif text-xl lg:text-2xl tracking-widest text-primary font-bold">
                            {hotelName}
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="space-x-10 text-xs uppercase tracking-[0.2em] hidden md:flex items-center">
                        {navLinks.map(link => (
                            <Link key={link.href} href={link.href} className="hover:text-primary transition-colors py-2 font-medium">{link.label}</Link>
                        ))}
                        <Link
                            href="/booking"
                            className="bg-primary text-primary-foreground px-8 py-3.5 hover:bg-white hover:text-black hover:border-white transition-all duration-500 font-semibold tracking-[0.15em] border border-primary shadow-[0_4px_20px_-5px_hsl(var(--primary)/0.6)]"
                        >
                            Book Now
                        </Link>
                    </nav>

                    {/* Mobile Hamburger Toggle */}
                    <button
                        className="md:hidden text-primary p-2 focus:outline-none relative z-[9999]"
                        onClick={() => setIsMenuOpen(prev => !prev)}
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    >
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </header>

            {/* ─── MOBILE FULLSCREEN NAV OVERLAY ────────────────────── */}
            <div
                className={`fixed inset-0 z-[9990] md:hidden transition-opacity duration-300 ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                aria-hidden={!isMenuOpen}
            >
                {/* Dark backdrop */}
                <div className="absolute inset-0 bg-black/80" onClick={closeMenu} aria-label="Close menu" />

                {/* Solid nav panel */}
                <div className={`absolute inset-0 bg-background flex flex-col transition-transform duration-500 ease-out ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
                    {/* Top bar inside overlay */}
                    <div className="flex items-center justify-between px-6 h-24 border-b border-border shrink-0">
                        <span className="font-serif text-xl tracking-widest text-primary font-bold">{hotelName}</span>
                        <button onClick={closeMenu} className="text-primary p-2 hover:text-foreground transition-colors" aria-label="Close menu">
                            <X size={28} />
                        </button>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex-1 flex flex-col items-center justify-center gap-8 px-8">
                        {navLinks.map((link, i) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={closeMenu}
                                className="text-3xl font-serif text-foreground hover:text-primary transition-all duration-300 tracking-widest"
                                style={{ transitionDelay: isMenuOpen ? `${i * 80}ms` : "0ms" }}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="w-20 h-px bg-primary/30 my-2" />
                        <Link
                            href="/booking"
                            onClick={closeMenu}
                            className="bg-primary text-black px-14 py-5 font-bold tracking-[0.2em] uppercase text-sm hover:bg-white transition-all duration-500 w-full max-w-xs text-center"
                        >
                            Book Now
                        </Link>
                    </nav>

                    {/* Social links at bottom */}
                    {socialLinks.length > 0 && (
                        <div className="px-8 py-10 border-t border-white/5 flex flex-col items-center gap-5 shrink-0">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold">Connect With Us</p>
                            <div className="flex gap-6">
                                {socialLinks.map(link => (
                                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-white transition-all duration-300 hover:scale-125">
                                        {renderSocialIcon(link.platform)}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Page Content */}
            <main className="flex-1 pt-24 lg:pt-28 bg-background">{children}</main>

            {/* Floating WhatsApp — hidden when mobile menu is open */}
            <div className={isMenuOpen ? "hidden" : ""}>
                <WhatsAppWidget phoneNumber={phoneNumber} />
            </div>

            {/* ─── Footer ────────────────────────────────────────────── */}
            <footer className="bg-card border-t border-border mt-auto">
                <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-4 gap-12 lg:gap-20">
                    <div className="md:col-span-1 border-r border-border/20 pr-0 md:pr-12">
                        {settings?.logoUrl && (
                            <Image
                                src={settings.logoUrl.includes("res.cloudinary.com") ? settings.logoUrl.replace("/upload/", "/upload/f_auto,q_auto,h_100/") : settings.logoUrl}
                                alt={hotelName}
                                width={80}
                                height={80}
                                className="h-16 w-auto object-contain mb-6 grayscale hover:grayscale-0 transition-all duration-500"
                            />
                        )}
                        <h4 className="font-serif text-2xl mb-4 text-primary">{hotelName}</h4>
                        <p className="text-muted-foreground text-sm leading-loose font-light italic">{settings?.address}</p>
                    </div>
                    <div>
                        <h4 className="font-serif text-lg mb-6 text-primary tracking-widest uppercase text-[10px] font-bold">Contact Info</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Phone size={16} className="text-primary/60" />
                                <p className="text-muted-foreground text-sm font-light">{phoneNumber}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail size={16} className="text-primary/60" />
                                <p className="text-muted-foreground text-sm font-light">{settings?.email}</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin size={16} className="text-primary/60 shrink-0 mt-0.5" />
                                <p className="text-muted-foreground text-sm leading-relaxed font-light">{settings?.address}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-serif text-lg mb-6 text-primary tracking-widest uppercase text-[10px] font-bold">Hotel Hours</h4>
                        <div className="space-y-3">
                            <div>
                                <p className="text-primary/60 text-[10px] uppercase tracking-widest font-bold mb-1">Check-In</p>
                                <p className="text-muted-foreground text-sm font-light">{settings?.checkInTime}</p>
                            </div>
                            <div>
                                <p className="text-primary/60 text-[10px] uppercase tracking-widest font-bold mb-1">Check-Out</p>
                                <p className="text-muted-foreground text-sm font-light">{settings?.checkOutTime}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-serif text-lg mb-6 text-primary tracking-widest uppercase text-[10px] font-bold">Social Media</h4>
                        <div className="flex flex-wrap gap-3">
                            {socialLinks.length > 0 ? (
                                socialLinks.map((link) => (
                                    <a
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-background border border-border/50 hover:border-primary hover:text-primary transition-all p-4 rounded-xl shadow-sm text-foreground active:scale-95 group flex items-center justify-center min-w-[50px] min-h-[50px]"
                                        title={link.platform}
                                    >
                                        {renderSocialIcon(link.platform)}
                                    </a>
                                ))
                            ) : (
                                <p className="text-muted-foreground text-xs font-light">Configure your social links in admin.</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="border-t border-border/20 py-8 text-center text-muted-foreground text-[10px] uppercase tracking-[0.3em] font-light">
                    &copy; {new Date().getFullYear()} {hotelName}. <span className="opacity-40">Luxury Living in Asaba.</span>
                </div>
            </footer>
        </>
    );
}
