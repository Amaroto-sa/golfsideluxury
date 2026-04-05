"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface RoomCategory {
    id: string;
    name: string;
    price: number;
    rooms: { id: string; roomNumber: string; status: string }[];
}

export default function BookingPage() {
    const searchParams = useSearchParams();
    const preselectedCategory = searchParams.get("category") || "";

    const [categories, setCategories] = useState<RoomCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState(preselectedCategory);
    const [availableRooms, setAvailableRooms] = useState<{ id: string; roomNumber: string }[]>([]);
    const [bookingType, setBookingType] = useState<"reservation" | "full">("full");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch("/api/rooms/categories")
            .then((r) => r.json())
            .then((data) => setCategories(data))
            .catch(() => { });
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            const cat = categories.find((c) => c.id === selectedCategory);
            if (cat) {
                setAvailableRooms(cat.rooms.filter((r) => r.status === "AVAILABLE"));
            }
        } else {
            setAvailableRooms([]);
        }
    }, [selectedCategory, categories]);

    const selectedCat = categories.find((c) => c.id === selectedCategory);
    const totalAmount = selectedCat ? Number(selectedCat.price) : 0;
    const amountDue = bookingType === "reservation" ? totalAmount / 2 : totalAmount;

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        formData.set("bookingType", bookingType);
        if (!formData.get("categoryId")) {
            formData.set("categoryId", selectedCategory);
        }

        const res = await fetch("/api/bookings", {
            method: "POST",
            body: formData,
        });
        const result = await res.json();
        setLoading(false);

        if (result.success) {
            setSubmitted(true);
        } else {
            setError(typeof result.error === "string" ? result.error : "Please check your details and try again.");
        }
    }

    if (submitted) {
        return (
            <div className="py-24 px-6 max-w-2xl mx-auto text-center">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-12">
                    <h2 className="text-3xl font-serif text-primary mb-4">Booking Submitted!</h2>
                    <p className="text-muted-foreground mb-6">
                        Thank you for your {bookingType === "reservation" ? "reservation" : "booking"} request.
                        Our team will review and confirm your booking shortly.
                    </p>
                    <p className="text-muted-foreground text-sm">
                        Amount due: ₦{amountDue.toLocaleString()}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-16 px-6">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <p className="text-primary tracking-[0.3em] uppercase text-sm font-medium mb-4">Reservation</p>
                    <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
                        Book Your <span className="text-primary">Stay</span>
                    </h1>
                </div>

                <Card className="border-border">
                    <CardHeader>
                        <CardTitle className="font-serif text-primary">Booking Details</CardTitle>
                        <CardDescription>Fill in the form below to reserve or book your room.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
                                    {error}
                                </div>
                            )}

                            {/* Guest Details */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name *</Label>
                                    <Input id="firstName" name="firstName" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name *</Label>
                                    <Input id="lastName" name="lastName" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                                    <Input id="phoneNumber" name="phoneNumber" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email (optional)</Label>
                                    <Input id="email" name="email" type="email" />
                                </div>
                            </div>

                            {/* Room Category Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="categoryId">Room Category *</Label>
                                <select
                                    id="categoryId"
                                    name="categoryId"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    required
                                >
                                    <option value="">Select a room category</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name} — ₦{Number(c.price).toLocaleString()} / night
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Room Selection (optional) */}
                            {availableRooms.length > 0 && (
                                <div className="space-y-2">
                                    <Label htmlFor="roomId">Preferred Room (optional)</Label>
                                    <select
                                        id="roomId"
                                        name="roomId"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        <option value="">Any available room</option>
                                        {availableRooms.map((r) => (
                                            <option key={r.id} value={r.id}>
                                                Room {r.roomNumber}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Dates */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="checkIn">Check-in Date *</Label>
                                    <Input id="checkIn" name="checkIn" type="date" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="checkOut">Check-out Date *</Label>
                                    <Input id="checkOut" name="checkOut" type="date" required />
                                </div>
                            </div>

                            {/* Adults */}
                            <div className="space-y-2">
                                <Label htmlFor="adults">Number of Adults</Label>
                                <select
                                    id="adults"
                                    name="adults"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                >
                                    <option value="1">1 Adult</option>
                                    <option value="2">2 Adults</option>
                                </select>
                            </div>

                            {/* Booking Type */}
                            <div className="space-y-3">
                                <Label>Booking Type *</Label>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setBookingType("full")}
                                        className={`p-4 border rounded-lg text-left transition-all ${bookingType === "full"
                                            ? "border-primary bg-primary/10"
                                            : "border-border hover:border-primary/30"
                                            }`}
                                    >
                                        <p className="font-medium mb-1">Full Booking</p>
                                        <p className="text-sm text-muted-foreground">Full payment required</p>
                                        {selectedCat && (
                                            <p className="text-primary font-medium mt-2">₦{totalAmount.toLocaleString()}</p>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setBookingType("reservation")}
                                        className={`p-4 border rounded-lg text-left transition-all ${bookingType === "reservation"
                                            ? "border-primary bg-primary/10"
                                            : "border-border hover:border-primary/30"
                                            }`}
                                    >
                                        <p className="font-medium mb-1">Reservation</p>
                                        <p className="text-sm text-muted-foreground">Half payment to reserve</p>
                                        {selectedCat && (
                                            <p className="text-primary font-medium mt-2">₦{(totalAmount / 2).toLocaleString()}</p>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <Button type="submit" size="lg" className="w-full" disabled={loading}>
                                {loading ? "Submitting..." : "Submit Booking Request"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
