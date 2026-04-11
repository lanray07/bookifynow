export type Service = {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
};

export type BookingStatus = "confirmed" | "cancelled";

export type Booking = {
  id: string;
  serviceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  status: BookingStatus;
};

export type WorkingHour = {
  day: string;
  enabled: boolean;
  open: string;
  close: string;
};

export type BusinessProfile = {
  id: string;
  name: string;
  slug: string;
  category: string;
  tagline: string;
  description: string;
  location: string;
};
