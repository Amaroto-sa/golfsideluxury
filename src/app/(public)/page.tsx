import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getHotelSettings, getRoomCategories, getAmenities, getGalleryImages, getRulesAndPolicies } from "@/lib/data-fetchers";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

/** Helper to get an optimized Cloudinary URL */
function cldOpt(url: string | null | undefined, transforms: string): string | null {
    if (!url) return null;
    if (url.includes("res.cloudinary.com")) {
        return url.replace("/upload/", `/upload/${transforms}/`);
    }
    return url;
}

export default async function HomePage() {
    const settings = await getHotelSettings();
    const categories = await getRoomCategories();
    const amenities = await getAmenities();
    const galleryImages = await getGalleryImages();
    const rules = await getRulesAndPolicies();

    const amenityIcons: Record<string, string> = {
        "Wi-Fi": "📶",
        AC: "❄️",
        Power: "⚡",
        Security: "🛡️",
        Restaurant: "🍽️",
        Parking: "🅿️",
    };

    const heroUrl = cldOpt(settings.homepageHero, "f_auto,q_auto,w_1920");

    return (
        <>
            {/* ═══════════ HERO ═══════════ */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
                {heroUrl ? (
                    <Image
                        src={heroUrl}
                        alt={`${settings.hotelName} Hero`}
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                    />
                ) : (
                    <div className="absolute inset-0 bg-zinc-900" />
                )}
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                <div className="relative z-10 text-center max-w-5xl px-6">
                    <p className="text-primary tracking-[0.5em] uppercase text-xs md:text-sm mb-6 font-semibold">
                        Welcome to
                    </p>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif mb-8 text-foreground leading-[1.1] drop-shadow-lg">
                        {settings.hotelName}
                    </h1>
                    <p className="text-lg md:text-xl text-foreground/80 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                        Experience uncompromised luxury and comfort at our premier destination in the heart of Asaba.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link href="/rooms">
                            <Button size="lg" className="text-sm md:text-base px-10 py-7 uppercase tracking-[0.2em] font-semibold">
                                Discover Rooms
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button size="lg" variant="outline" className="text-sm md:text-base px-10 py-7 uppercase tracking-[0.2em] font-semibold text-foreground border-border hover:bg-white hover:text-black hover:border-white transition-all duration-500">
                                Contact Us
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══════════ ABOUT ═══════════ */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
                    <div className="flex-1 w-full relative">
                        <div className="absolute -inset-4 border border-primary/20 translate-x-4 translate-y-4" />
                        <div className="aspect-[4/5] bg-card overflow-hidden relative z-10 shadow-2xl">
                            {settings.homepageHero ? (
                                <Image
                                    src={cldOpt(settings.homepageHero, "f_auto,q_auto,w_800,h_1000,c_fill") || settings.homepageHero}
                                    alt="Golfside Luxury Hotel"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-muted-foreground text-sm">Hotel Image</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="h-px w-12 bg-primary" />
                            <p className="text-primary tracking-[0.4em] uppercase text-xs font-semibold">About Us</p>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-tight">
                            Discover <span className="text-primary italic">Elegance</span>
                        </h2>
                        <p className="text-muted-foreground leading-loose text-lg font-light">
                            {settings.aboutText}
                        </p>
                        <div className="pt-4">
                            <Link href="/rooms">
                                <Button variant="link" className="p-0 text-primary text-base uppercase tracking-widest font-medium hover:text-white transition-colors">
                                    Explore Our Rooms &rarr;
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════ ROOM CATEGORIES ═══════════ */}
            <section className="py-32 bg-card">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20 flex flex-col items-center">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-px w-8 bg-primary" />
                            <p className="text-primary tracking-[0.4em] uppercase text-xs font-semibold">Accommodations</p>
                            <div className="h-px w-8 bg-primary" />
                        </div>
                        <h2 className="text-4xl md:text-6xl font-serif text-foreground">
                            Our <span className="text-primary italic">Rooms</span>
                        </h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {categories.length > 0
                            ? categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    className="group cursor-pointer bg-background overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] transition-all duration-700 pb-8 flex flex-col shadow-lg border border-transparent hover:border-primary/20"
                                >
                                    <div className="aspect-[4/3] bg-zinc-900 overflow-hidden relative">
                                        {cat.coverImage ? (
                                            <Image
                                                src={cldOpt(cat.coverImage, "f_auto,q_auto,w_800,h_600,c_fill") || cat.coverImage}
                                                alt={`${cat.name} room`}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-[1.5s]"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-muted-foreground text-xs uppercase tracking-widest">{cat.name}</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                    <div className="px-8 pt-8 flex-1 flex flex-col">
                                        <div className="flex justify-between items-end mb-4">
                                            <h3 className="text-3xl font-serif group-hover:text-primary transition-colors">{cat.name}</h3>
                                            <p className="text-primary font-medium text-xl whitespace-nowrap">
                                                ₦{Number(cat.price).toLocaleString()}
                                                <span className="text-xs text-muted-foreground block text-right font-light tracking-widest uppercase">per night</span>
                                            </p>
                                        </div>
                                        <p className="text-muted-foreground text-sm line-clamp-2 mb-6 font-light leading-relaxed flex-1">{cat.description}</p>
                                        <div className="flex justify-between items-center border-t border-border/50 pt-4 mt-auto">
                                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
                                                {cat._count?.rooms || cat.rooms?.length || 0} room(s) available
                                            </p>
                                            <span className="text-primary group-hover:translate-x-2 transition-transform duration-300">
                                                &rarr;
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                            : (
                                <div className="col-span-full text-center text-muted-foreground py-12">
                                    Room categories will appear here once configured by admin.
                                </div>
                            )}
                    </div>
                    <div className="text-center mt-20">
                        <Link href="/rooms">
                            <Button variant="outline" size="lg" className="px-10 py-7 uppercase tracking-[0.2em] font-semibold border-border hover:border-primary hover:text-primary transition-all">
                                View All Rooms
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══════════ AMENITIES ═══════════ */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 flex flex-col items-center">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-px w-8 bg-primary" />
                            <p className="text-primary tracking-[0.4em] uppercase text-xs font-semibold">What We Offer</p>
                            <div className="h-px w-8 bg-primary" />
                        </div>
                        <h2 className="text-4xl md:text-6xl font-serif text-foreground">
                            Hotel <span className="text-primary italic">Amenities</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                        {amenities.length > 0
                            ? amenities.map((a) => (
                                <div key={a.id} className="flex flex-col items-center p-8 bg-background border border-border/60 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_10px_30px_-10px_hsl(var(--primary)/0.2)] group">
                                    <span className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-500">{a.icon || amenityIcons[a.name] || "✦"}</span>
                                    <span className="text-xs uppercase tracking-widest font-medium text-muted-foreground group-hover:text-primary transition-colors">{a.name}</span>
                                </div>
                            ))
                            : (
                                ["Wi-Fi", "AC", "Power", "Security", "Restaurant", "Parking"].map((name) => (
                                    <div key={name} className="flex flex-col items-center p-8 bg-background border border-border/60 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_10px_30px_-10px_hsl(var(--primary)/0.2)] group">
                                        <span className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-500">{amenityIcons[name]}</span>
                                        <span className="text-xs uppercase tracking-widest font-medium text-muted-foreground group-hover:text-primary transition-colors">{name}</span>
                                    </div>
                                ))
                            )}
                    </div>
                </div>
            </section>

            {/* ═══════════ GALLERY PREVIEW ═══════════ */}
            {galleryImages.length > 0 && (
                <section className="py-32 bg-card px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20 flex flex-col items-center">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-px w-8 bg-primary" />
                                <p className="text-primary tracking-[0.4em] uppercase text-xs font-semibold">Visual Tour</p>
                                <div className="h-px w-8 bg-primary" />
                            </div>
                            <h2 className="text-4xl md:text-6xl font-serif text-foreground">
                                Our <span className="text-primary italic">Gallery</span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {galleryImages.slice(0, 6).map((img) => (
                                <div key={img.id} className="aspect-[4/3] overflow-hidden border border-border/30 relative group shadow-lg">
                                    {img.url ? (
                                        <Image
                                            src={cldOpt(img.url, "f_auto,q_auto,w_800,h_600,c_fill") || img.url}
                                            alt={img.title || "Gallery"}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-[2s]"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                                            <span className="text-muted-foreground text-xs">{img.title || "Gallery Image"}</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-20">
                            <Link href="/gallery">
                                <Button variant="outline" size="lg" className="px-10 py-7 uppercase tracking-[0.2em] font-semibold border-border hover:border-primary hover:text-primary transition-all">
                                    View Full Gallery
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* ═══════════ RULES / POLICY ═══════════ */}
            <section className="py-32 px-6 bg-background">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-20 flex flex-col items-center">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-px w-8 bg-primary" />
                            <p className="text-primary tracking-[0.4em] uppercase text-xs font-semibold">Good to Know</p>
                            <div className="h-px w-8 bg-primary" />
                        </div>
                        <h2 className="text-4xl md:text-6xl font-serif text-foreground">
                            Hotel <span className="text-primary italic">Policies</span>
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-card border border-border/50 p-10 hover:border-primary/30 transition-colors shadow-sm">
                            <h3 className="font-serif text-2xl text-foreground mb-4">Booking Policy</h3>
                            <p className="text-muted-foreground leading-loose text-sm font-light">{settings.bookingPolicy}</p>
                        </div>
                        <div className="bg-card border border-border/50 p-10 hover:border-primary/30 transition-colors shadow-sm">
                            <h3 className="font-serif text-2xl text-foreground mb-4">Check-in / Check-out</h3>
                            <p className="text-muted-foreground text-sm mb-3 font-light"><strong className="font-medium text-foreground">Check-in:</strong> {settings.checkInTime}</p>
                            <p className="text-muted-foreground text-sm font-light"><strong className="font-medium text-foreground">Check-out:</strong> {settings.checkOutTime}</p>
                        </div>
                        {rules.length > 0
                            ? rules.map((rule) => (
                                <div key={rule.id} className="bg-card border border-border/50 p-10 hover:border-primary/30 transition-colors shadow-sm">
                                    <h3 className="font-serif text-2xl text-foreground mb-4">{rule.title}</h3>
                                    <p className="text-muted-foreground leading-loose text-sm font-light">{rule.content}</p>
                                </div>
                            ))
                            : (
                                <>
                                    <div className="bg-card border border-border/50 p-10 hover:border-primary/30 transition-colors shadow-sm">
                                        <h3 className="font-serif text-2xl text-foreground mb-4">No Smoking</h3>
                                        <p className="text-muted-foreground text-sm font-light leading-loose">Smoking is strictly prohibited inside all hotel rooms.</p>
                                    </div>
                                    <div className="bg-card border border-border/50 p-10 hover:border-primary/30 transition-colors shadow-sm">
                                        <h3 className="font-serif text-2xl text-foreground mb-4">Occupancy</h3>
                                        <p className="text-muted-foreground text-sm font-light leading-loose">Only two adults are allowed in a room at any time.</p>
                                    </div>
                                </>
                            )}
                    </div>
                </div>
            </section>

            {/* ═══════════ CONTACT BLOCK ═══════════ */}
            <section className="py-32 bg-card px-6 border-t border-border/40">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-primary tracking-[0.5em] uppercase text-xs font-semibold mb-6">Get In Touch</p>
                    <h2 className="text-4xl md:text-6xl font-serif text-foreground mb-8">
                        Ready to <span className="text-primary italic">Stay?</span>
                    </h2>
                    <p className="text-muted-foreground mb-12 max-w-2xl mx-auto leading-loose font-light text-lg">
                        Book your room today or reach out to us for inquiries. Our team is ready to make your stay unforgettable.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link href="/booking">
                            <Button size="lg" className="text-sm md:text-base px-12 py-7 uppercase tracking-[0.2em] font-semibold">
                                Book a Room
                            </Button>
                        </Link>
                        <a href={`tel:${settings.phoneNumber.replace(/\s+/g, '')}`}>
                            <Button size="lg" variant="outline" className="text-sm md:text-base px-12 py-7 uppercase tracking-[0.2em] font-semibold border-border hover:border-primary hover:text-primary transition-all bg-card">
                                📞 Call {settings.phoneNumber}
                            </Button>
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
