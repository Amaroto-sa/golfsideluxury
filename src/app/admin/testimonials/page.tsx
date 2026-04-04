import React from "react";
import prisma from "@/lib/prisma";
import { TestimonialsClient } from "@/components/admin/testimonials-client";

export default async function TestimonialsAdminPage() {
    const testimonials = await prisma.testimonial.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="max-w-7xl mx-auto py-8">
            <TestimonialsClient testimonials={testimonials} />
        </div>
    );
}
