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
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/30" />

                <div className="relative z-10 text-center max-w-4xl px-6">
                    <p className="text-primary tracking-[0.4em] uppercase text-sm md:text-base mb-6 font-medium">
                        Welcome to
                    </p>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif mb-8 text-white leading-tight">
                        {settings.hotelName}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Experience uncompromised luxury and comfort at our premier destination in the heart of Asaba.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/rooms">
                            <Button size="lg" className="text-lg px-8 py-6">
                                Discover Rooms
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button size="lg" variant="outline" className="text-lg px-8 py-6 text-white border-white/30 hover:text-primary hover:border-primary">
                                Contact Us
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══════════ ABOUT ═══════════ */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 space-y-6">
                        <p className="text-primary tracking-[0.3em] uppercase text-sm font-medium">About Us</p>
                        <h2 className="text-4xl md:text-5xl font-serif text-white">
                            Discover <span className="text-primary">Elegance</span>
                        </h2>
                        <p className="text-muted-foreground leading-loose text-lg">{settings.aboutText}</p>
                        <Link href="/rooms">
                            <Button variant="link" className="p-0 text-primary text-lg">
                                Explore Our Rooms &rarr;
                            </Button>
                        </Link>
                    </div>
                    <div className="flex-1 w-full aspect-[4/3] bg-card border border-border rounded-lg overflow-hidden relative">
                        {settings.homepageHero ? (
                            <Image
                                src={cldOpt(settings.homepageHero, "f_auto,q_auto,w_800,h_600,c_fill") || settings.homepageHero}
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
            </section>

            {/* ═══════════ ROOM CATEGORIES ═══════════ */}
            <section className="py-24 bg-card/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <p className="text-primary tracking-[0.3em] uppercase text-sm font-medium mb-4">Accommodations</p>
                        <h2 className="text-4xl md:text-5xl font-serif text-white">
                            Our <span className="text-primary">Rooms</span>
                        </h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.length > 0
                            ? categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    className="group cursor-pointer border border-border bg-background rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_30px_-5px_hsl(43_74%_49%/0.15)]"
                                >
                                    <div className="aspect-[4/3] bg-zinc-800 overflow-hidden relative">
                                        {cat.coverImage ? (
                                            <Image
                                                src={cldOpt(cat.coverImage, "f_auto,q_auto,w_600,h_450,c_fill") || cat.coverImage}
                                                alt={`${cat.name} room`}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-muted-foreground text-sm">{cat.name} Room</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-8">
                                        <h3 className="text-2xl font-serif mb-2 group-hover:text-primary transition-colors">{cat.name}</h3>
                                        <p className="text-primary font-medium text-xl mb-4">
                                            ₦{Number(cat.price).toLocaleString()}
                                            <span className="text-sm text-muted-foreground"> / night</span>
                                        </p>
                                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{cat.description}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {cat._count?.rooms || cat.rooms?.length || 0} room(s) available
                                        </p>
                                    </div>
                                </div>
                            ))
                            : (
                                <div className="col-span-full text-center text-muted-foreground py-12">
                                    Room categories will appear here once configured by admin.
                                </div>
                            )}
                    </div>
                    <div className="text-center mt-12">
                        <Link href="/rooms">
                            <Button variant="outline" size="lg">View All Rooms</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══════════ AMENITIES ═══════════ */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-primary tracking-[0.3em] uppercase text-sm font-medium mb-4">What We Offer</p>
                        <h2 className="text-4xl md:text-5xl font-serif text-white">
                            Hotel <span className="text-primary">Amenities</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {amenities.length > 0
                            ? amenities.map((a) => (
                                <div key={a.id} className="flex flex-col items-center p-6 bg-card border border-border rounded-lg hover:border-primary/30 transition-colors">
                                    <span className="text-3xl mb-3">{a.icon || amenityIcons[a.name] || "✦"}</span>
                                    <span className="text-sm font-medium">{a.name}</span>
                                </div>
                            ))
                            : (
                                ["Wi-Fi", "AC", "Power", "Security", "Restaurant", "Parking"].map((name) => (
                                    <div key={name} className="flex flex-col items-center p-6 bg-card border border-border rounded-lg hover:border-primary/30 transition-colors">
                                        <span className="text-3xl mb-3">{amenityIcons[name]}</span>
                                        <span className="text-sm font-medium">{name}</span>
                                    </div>
                                ))
                            )}
                    </div>
                </div>
            </section>

            {/* ═══════════ GALLERY PREVIEW ═══════════ */}
            {galleryImages.length > 0 && (
                <section className="py-24 bg-card/50 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <p className="text-primary tracking-[0.3em] uppercase text-sm font-medium mb-4">Visual Tour</p>
                            <h2 className="text-4xl md:text-5xl font-serif text-white">
                                Our <span className="text-primary">Gallery</span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {galleryImages.slice(0, 6).map((img) => (
                                <div key={img.id} className="aspect-[4/3] rounded-lg overflow-hidden border border-border relative group">
                                    {img.url ? (
                                        <Image
                                            src={cldOpt(img.url, "f_auto,q_auto,w_600,h_450,c_fill") || img.url}
                                            alt={img.title || "Gallery"}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                            <span className="text-muted-foreground text-xs">{img.title || "Gallery Image"}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-12">
                            <Link href="/gallery">
                                <Button variant="outline" size="lg">View Full Gallery</Button>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* ═══════════ RULES / POLICY ═══════════ */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-primary tracking-[0.3em] uppercase text-sm font-medium mb-4">Good to Know</p>
                        <h2 className="text-4xl md:text-5xl font-serif text-white">
                            Hotel <span className="text-primary">Policies</span>
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-card border border-border rounded-lg p-8">
                            <h3 className="font-serif text-xl text-primary mb-4">Booking Policy</h3>
                            <p className="text-muted-foreground leading-loose text-sm">{settings.bookingPolicy}</p>
                        </div>
                        <div className="bg-card border border-border rounded-lg p-8">
                            <h3 className="font-serif text-xl text-primary mb-4">Check-in / Check-out</h3>
                            <p className="text-muted-foreground text-sm mb-2">Check-in: {settings.checkInTime}</p>
                            <p className="text-muted-foreground text-sm">Check-out: {settings.checkOutTime}</p>
                        </div>
                        {rules.length > 0
                            ? rules.map((rule) => (
                                <div key={rule.id} className="bg-card border border-border rounded-lg p-8">
                                    <h3 className="font-serif text-xl text-primary mb-4">{rule.title}</h3>
                                    <p className="text-muted-foreground leading-loose text-sm">{rule.content}</p>
                                </div>
                            ))
                            : (
                                <>
                                    <div className="bg-card border border-border rounded-lg p-8">
                                        <h3 className="font-serif text-xl text-primary mb-4">No Smoking</h3>
                                        <p className="text-muted-foreground text-sm">Smoking is strictly prohibited inside all hotel rooms.</p>
                                    </div>
                                    <div className="bg-card border border-border rounded-lg p-8">
                                        <h3 className="font-serif text-xl text-primary mb-4">Occupancy</h3>
                                        <p className="text-muted-foreground text-sm">Only two adults are allowed in a room at any time.</p>
                                    </div>
                                </>
                            )}
                    </div>
                </div>
            </section>

            {/* ═══════════ CONTACT BLOCK ═══════════ */}
            <section className="py-24 bg-card/50 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-primary tracking-[0.3em] uppercase text-sm font-medium mb-4">Get In Touch</p>
                    <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
                        Ready to <span className="text-primary">Stay?</span>
                    </h2>
                    <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
                        Book your room today or reach out to us for inquiries. Our team is ready to make your stay unforgettable.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/booking">
                            <Button size="lg" className="text-lg px-8 py-6">Book a Room</Button>
                        </Link>
                        <a href={`tel:${settings.phoneNumber}`}>
                            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                                📞 Call {settings.phoneNumber}
                            </Button>
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
