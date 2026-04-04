// Shared TypeScript types for the application

export interface HotelSettingsData {
    id?: string;
    hotelName: string;
    aboutText: string;
    phoneNumber: string;
    email: string;
    address: string;
    checkInTime: string;
    checkOutTime: string;
    logoUrl: string | null;
    faviconUrl: string | null;
    bookingPolicy: string;
    homepageHero: string | null;
}

export interface RoomCategoryData {
    id: string;
    name: string;
    description: string | null;
    price: number;
    coverImage: string | null;
    rooms?: RoomData[];
    _count?: { rooms: number };
}

export interface RoomData {
    id: string;
    roomNumber: string;
    status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
    categoryId: string;
    category?: RoomCategoryData;
}

export interface GuestData {
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
    phoneNumber: string;
    address: string | null;
    bookings?: BookingData[];
}

export interface BookingData {
    id: string;
    guestId: string;
    guest?: GuestData;
    roomId: string | null;
    room?: RoomData | null;
    checkIn: string | Date;
    checkOut: string | Date;
    adults: number;
    status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
    paymentStatus: "PENDING" | "PARTIAL" | "COMPLETED" | "REFUNDED";
    totalAmount: number;
    amountPaid: number;
    createdAt?: string | Date;
}

export interface InquiryData {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    message: string;
    status: "NEW" | "READ" | "RESOLVED";
    createdAt: string | Date;
}

export interface GalleryImageData {
    id: string;
    title: string | null;
    url: string;
    order: number;
}

export interface AmenityData {
    id: string;
    name: string;
    icon: string | null;
}

export interface RulePolicyData {
    id: string;
    title: string;
    content: string;
    order: number;
}

export interface SocialLinkData {
    id: string;
    platform: string;
    url: string;
    icon: string | null;
}

export interface NotificationData {
    id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    linkUrl: string | null;
    createdAt: string | Date;
}

export interface DashboardStats {
    totalBookings: number;
    pendingReservations: number;
    confirmedBookings: number;
    occupiedRooms: number;
    availableRooms: number;
    recentInquiries: number;
    unreadNotifications: number;
}
