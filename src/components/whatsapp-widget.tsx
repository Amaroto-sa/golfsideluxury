"use client";

import React from "react";
import Image from "next/image";
import { MessageCircle } from "lucide-react";

export function WhatsAppWidget({ phoneNumber }: { phoneNumber: string }) {
    if (!phoneNumber) return null;

    // Clean phone number for link (remove spaces, etc.)
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
    const whatsappUrl = `https://wa.me/${cleanNumber}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-8 right-8 z-[100] group"
            aria-label="Chat with us on WhatsApp"
        >
            {/* Tooltip */}
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-x-2 group-hover:translate-x-0 shadow-2xl border border-white/10">
                Chat with us!
                <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-zinc-900 rotate-45 border-r border-t border-white/10" />
            </div>

            {/* Glowing effect */}
            <div className="absolute inset-0 bg-[#25D366] rounded-full blur-xl opacity-40 animate-pulse group-hover:opacity-60 transition-opacity" />

            {/* Main Button */}
            <div className="relative bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-500 flex items-center justify-center border-4 border-white/20">
                <MessageCircle size={32} fill="currentColor" className="stroke-none" />
            </div>
        </a>
    );
}
