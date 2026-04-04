import nodemailer from "nodemailer";
import prisma from "./prisma";

interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("SMTP configuration is missing. Emails will not be sent.");
        return;
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: `"Golfside Luxury Hotel" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });
        console.log(`Email sent successfully to ${to}`);
    } catch (error) {
        console.error("Failed to send email:", error);
    }
}

export async function sendBookingNotificationEmail(bookingData: any) {
    const settings = await prisma.hotelSettings.findFirst();
    const notificationEmail = process.env.NOTIFICATION_EMAIL;

    if (!notificationEmail) {
        console.warn("NOTIFICATION_EMAIL is missing. Admin will not receive alerts.");
        return;
    }

    const customTemplate = settings?.emailNotificationTemplate
        ? settings.emailNotificationTemplate
            .replace("{{guestName}}", `${bookingData.guest.firstName} ${bookingData.guest.lastName}`)
            .replace("{{roomInfo}}", bookingData.room ? `${bookingData.room.category.name} #${bookingData.room.roomNumber}` : "Unassigned Room")
            .replace("{{checkIn}}", new Date(bookingData.checkIn).toLocaleDateString())
            .replace("{{checkOut}}", new Date(bookingData.checkOut).toLocaleDateString())
            .replace("{{totalAmount}}", `₦${Number(bookingData.totalAmount).toLocaleString()}`)
        : null;

    const html = customTemplate || `
        <h2>New Booking Alert</h2>
        <p><strong>Guest:</strong> ${bookingData.guest.firstName} ${bookingData.guest.lastName}</p>
        <p><strong>Room:</strong> ${bookingData.room ? `${bookingData.room.category.name} #${bookingData.room.roomNumber}` : "Unassigned Room"}</p>
        <p><strong>Check-in:</strong> ${new Date(bookingData.checkIn).toLocaleDateString()}</p>
        <p><strong>Check-out:</strong> ${new Date(bookingData.checkOut).toLocaleDateString()}</p>
        <p><strong>Amount:</strong> ₦${Number(bookingData.totalAmount).toLocaleString()}</p>
        <br/>
        <p>Login to the admin dashboard to view details.</p>
    `;

    await sendEmail({
        to: notificationEmail,
        subject: `New Booking Notification: ${bookingData.guest.firstName} ${bookingData.guest.lastName}`,
        html,
    });
}

export async function sendInquiryNotificationEmail(inquiryData: any) {
    const notificationEmail = process.env.NOTIFICATION_EMAIL;

    if (!notificationEmail) {
        console.warn("NOTIFICATION_EMAIL is missing. Admin will not receive alerts for inquiries.");
        return;
    }

    const html = `
        <h2>New Contact Inquiry</h2>
        <p><strong>Name:</strong> ${inquiryData.name}</p>
        <p><strong>Email:</strong> ${inquiryData.email}</p>
        <p><strong>Phone:</strong> ${inquiryData.phone || "Not provided"}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="border-left: 4px solid #ccc; padding-left: 10px; color: #555;">
            ${inquiryData.message}
        </blockquote>
        <br/>
        <p>Login to the admin dashboard to reply.</p>
    `;

    await sendEmail({
        to: notificationEmail,
        subject: `New Inquiry from ${inquiryData.name}`,
        html,
    });
}

export async function sendInquiryReplyEmail(to: string, guestName: string, replyMessage: string) {
    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4a5568;">Reply to Your Inquiry</h2>
            <p>Hello ${guestName},</p>
            <p>Thank you for reaching out to Golfside Luxury Hotel.</p>
            <blockquote style="border-left: 4px solid #d4af37; padding-left: 15px; margin-left: 0; color: #333;">
                ${replyMessage.replace(/\n/g, "<br/>")}
            </blockquote>
            <br/>
            <p>Best regards,</p>
            <p><strong>Golfside Luxury Hotel Management</strong></p>
        </div>
    `;

    await sendEmail({
        to,
        subject: "Re: Your Inquiry to Golfside Luxury Hotel",
        html,
    });
}
