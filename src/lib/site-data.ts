import { Booking, BusinessProfile, Service, WorkingHour } from "@/lib/types";

export const demoBusiness: BusinessProfile = {
  id: "biz_1",
  name: "Bookify Studio",
  slug: "bookify-studio",
  category: "Salon & beauty",
  tagline: "Bookings that feel polished before the appointment starts.",
  description:
    "BookifyNow helps barbers, salons, and solo beauty professionals run a cleaner booking operation with less back-and-forth.",
  location: "Shoreditch, London",
};

export const demoServices: Service[] = [
  {
    id: "srv_cut",
    name: "Precision Haircut",
    duration: 45,
    price: 35,
    description: "Classic cut with wash, consultation, and finished styling.",
  },
  {
    id: "srv_color",
    name: "Colour Refresh",
    duration: 90,
    price: 85,
    description: "Gloss, tone, or root refresh for clients who need a reset.",
  },
  {
    id: "srv_brows",
    name: "Brow Shape",
    duration: 30,
    price: 22,
    description: "Quick shaping session with tidy finish and aftercare tips.",
  },
];

export const demoWorkingHours: WorkingHour[] = [
  { day: "Monday", enabled: true, open: "09:00", close: "18:00" },
  { day: "Tuesday", enabled: true, open: "09:00", close: "18:00" },
  { day: "Wednesday", enabled: true, open: "10:00", close: "19:00" },
  { day: "Thursday", enabled: true, open: "10:00", close: "19:00" },
  { day: "Friday", enabled: true, open: "09:00", close: "18:00" },
  { day: "Saturday", enabled: true, open: "09:00", close: "16:00" },
  { day: "Sunday", enabled: false, open: "00:00", close: "00:00" },
];

export const demoBookings: Booking[] = [
  {
    id: "bk_1",
    serviceId: "srv_cut",
    customerName: "Amelia Reed",
    customerEmail: "amelia@example.com",
    customerPhone: "+44 7700 900123",
    date: "2026-04-12",
    time: "10:30",
    status: "confirmed",
  },
  {
    id: "bk_2",
    serviceId: "srv_color",
    customerName: "Leah Morgan",
    customerEmail: "leah@example.com",
    customerPhone: "+44 7700 900222",
    date: "2026-04-12",
    time: "13:00",
    status: "confirmed",
  },
  {
    id: "bk_3",
    serviceId: "srv_brows",
    customerName: "Mila Santos",
    customerEmail: "mila@example.com",
    customerPhone: "+44 7700 900333",
    date: "2026-04-13",
    time: "11:15",
    status: "confirmed",
  },
];
