"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export function BookingsExportButton({ bookings }: { bookings: any[] }) {
    function exportToCSV() {
        if (!bookings || bookings.length === 0) {
            alert("No bookings to export.");
            return;
        }

        const headers = ["ID", "Guest Name", "Phone", "Email", "Room", "Check-In", "Check-Out", "Adults", "Status", "Payment", "Total (NGN)", "Paid (NGN)"];
        const rows = bookings.map(b => [
            b.id,
            `"${b.guest?.firstName} ${b.guest?.lastName}"`,
            `"${b.guest?.phoneNumber}"`,
            `"${b.guest?.email || ""}"`,
            b.room ? `"#${b.room.roomNumber} - ${b.room.category?.name}"` : "Unassigned",
            new Date(b.checkIn).toISOString().split('T')[0],
            new Date(b.checkOut).toISOString().split('T')[0],
            b.adults,
            b.status,
            b.paymentStatus,
            b.totalAmount,
            b.amountPaid
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(r => r.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `hotel_bookings_export_${new Date().toISOString().split("T")[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <Button variant="outline" onClick={exportToCSV} className="hidden sm:flex">
            Export CSV
        </Button>
    );
}
