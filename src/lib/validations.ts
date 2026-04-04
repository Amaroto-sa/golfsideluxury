import { z } from "zod";

// ─── Auth ────────────────────────────────────────────────────────
export const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

// ─── Hotel Settings ──────────────────────────────────────────────
export const hotelSettingsSchema = z.object({
    hotelName: z.string().min(1, "Hotel name is required"),
    phoneNumber: z.string().min(5, "Phone number is required"),
    email: z.string().email("Valid email required"),
    address: z.string().min(1, "Address is required"),
    checkInTime: z.string().min(1, "Check-in time is required"),
    checkOutTime: z.string().min(1, "Check-out time is required"),
    aboutText: z.string().min(10, "About text must be at least 10 characters"),
    bookingPolicy: z.string().min(5, "Booking policy is required"),
    emailNotificationTemplate: z.string().optional(),
});

// ─── Booking ─────────────────────────────────────────────────────
export const bookingSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Valid email required").optional().or(z.literal("")),
    phoneNumber: z.string().min(7, "Phone number is required"),
    categoryId: z.string().min(1, "Please select a room category"),
    roomId: z.string().optional(),
    checkIn: z.string().min(1, "Check-in date is required"),
    checkOut: z.string().min(1, "Check-out date is required"),
    adults: z.coerce.number().min(1).max(2, "Maximum 2 adults per room"),
    bookingType: z.enum(["reservation", "full"], {
        required_error: "Please select booking type",
    }),
});

// ─── Inquiry ─────────────────────────────────────────────────────
export const inquirySchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Valid email required"),
    phone: z.string().optional(),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

// ─── Room Category ───────────────────────────────────────────────
export const roomCategorySchema = z.object({
    name: z.string().min(1, "Category name is required"),
    description: z.string().optional(),
    price: z.coerce.number().min(1, "Price must be greater than 0"),
    coverImage: z.string().optional(),
});

// ─── Room ────────────────────────────────────────────────────────
export const roomSchema = z.object({
    roomNumber: z.string().min(1, "Room number is required"),
    categoryId: z.string().min(1, "Category is required"),
    status: z.enum(["AVAILABLE", "OCCUPIED", "MAINTENANCE"]),
});

// ─── Guest ───────────────────────────────────────────────────────
export const guestSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Valid email required").optional().or(z.literal("")),
    phoneNumber: z.string().min(7, "Phone number is required"),
    address: z.string().optional(),
});

// ─── Amenity ─────────────────────────────────────────────────────
export const amenitySchema = z.object({
    name: z.string().min(1, "Amenity name is required"),
    icon: z.string().optional(),
});

// ─── Rule / Policy ───────────────────────────────────────────────
export const rulePolicySchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(3, "Content is required"),
    order: z.coerce.number().min(0).default(0),
});

// ─── Social Link ─────────────────────────────────────────────────
export const socialLinkSchema = z.object({
    platform: z.string().min(1, "Platform name is required"),
    url: z.string().url("A valid URL is required"),
    icon: z.string().optional(),
});

// ─── Gallery Image ───────────────────────────────────────────────
export const galleryImageSchema = z.object({
    title: z.string().optional(),
    url: z.string().min(1, "Image URL is required"),
    order: z.coerce.number().min(0).default(0),
});

// Export all types
export type LoginInput = z.infer<typeof loginSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type InquiryInput = z.infer<typeof inquirySchema>;
export type RoomCategoryInput = z.infer<typeof roomCategorySchema>;
export type RoomInput = z.infer<typeof roomSchema>;
export type GuestInput = z.infer<typeof guestSchema>;
export type AmenityInput = z.infer<typeof amenitySchema>;
export type RulePolicyInput = z.infer<typeof rulePolicySchema>;
export type SocialLinkInput = z.infer<typeof socialLinkSchema>;
export type GalleryImageInput = z.infer<typeof galleryImageSchema>;
export type HotelSettingsInput = z.infer<typeof hotelSettingsSchema>;
