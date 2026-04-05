"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const res = await fetch("/api/inquiries", {
            method: "POST",
            body: formData,
        });
        const result = await res.json();
        setLoading(false);

        if (result.success) {
            setSubmitted(true);
        } else {
            setError("Please check your details and try again.");
        }
    }

    if (submitted) {
        return (
            <div className="py-24 px-6 max-w-2xl mx-auto text-center">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-12">
                    <h2 className="text-3xl font-serif text-primary mb-4">Message Sent!</h2>
                    <p className="text-muted-foreground">
                        Thank you for your inquiry. We will get back to you as soon as possible.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-16 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-primary tracking-[0.3em] uppercase text-sm font-medium mb-4">Contact Us</p>
                    <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
                        Get In <span className="text-primary">Touch</span>
                    </h1>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Have questions or want to make a reservation? We&apos;d love to hear from you.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <Card className="border-border">
                        <CardHeader>
                            <CardTitle className="font-serif text-primary">Send a Message</CardTitle>
                            <CardDescription>We&apos;ll respond within 24 hours.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {error && (
                                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
                                        {error}
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input id="name" name="name" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address *</Label>
                                    <Input id="email" name="email" type="email" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" name="phone" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="message">Your Message *</Label>
                                    <Textarea id="message" name="message" rows={5} required />
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Sending..." : "Send Message"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div className="bg-card border border-border p-8 rounded-lg">
                            <h3 className="font-serif text-xl text-primary mb-4">📍 Our Location</h3>
                            <p className="text-muted-foreground leading-loose">
                                3, Are Odesa T.G Drive,<br />
                                Off 74 Road,<br />
                                By Ibori Golf Course,<br />
                                Asaba, Delta State
                            </p>
                        </div>

                        <div className="bg-card border border-border p-8 rounded-lg">
                            <h3 className="font-serif text-xl text-primary mb-4">📞 Call Us</h3>
                            <a href="tel:09151933333" className="text-lg text-white hover:text-primary transition-colors">
                                09151933333
                            </a>
                            <p className="text-muted-foreground text-sm mt-2">Available 24/7 for reservations and inquiries.</p>
                        </div>

                        <div className="bg-card border border-border p-8 rounded-lg">
                            <h3 className="font-serif text-xl text-primary mb-4">🕐 Operating Hours</h3>
                            <p className="text-muted-foreground text-sm mb-1">Check-in: 05:00 AM</p>
                            <p className="text-muted-foreground text-sm">Check-out: 12:00 Noon</p>
                        </div>

                        <div className="bg-card border border-border p-8 rounded-lg">
                            <h3 className="font-serif text-xl text-primary mb-4">📱 Social Media</h3>
                            <p className="text-muted-foreground text-sm">
                                TikTok: <span className="text-primary">@golfsideluxuryasaba</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
