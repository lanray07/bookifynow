import { PostgrestError } from "@supabase/supabase-js";
import { demoBusiness, demoServices, demoWorkingHours } from "@/lib/site-data";
import { createSupabaseServerClient } from "@/lib/supabase";
import { Booking, BusinessProfile, Service, WorkingHour } from "@/lib/types";

type BusinessRow = {
  id: string;
  name: string;
  slug: string;
  category: string;
  tagline: string | null;
  description: string | null;
  location: string | null;
};

type ServiceRow = {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price_gbp: number;
};

type WorkingHourRow = {
  day_of_week: number;
  is_open: boolean;
  opens_at: string;
  closes_at: string;
};

type BookingRow = {
  id: string;
  service_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_date: string;
  booking_time: string;
  status: Booking["status"];
};

export type BookingPageData = {
  business: BusinessProfile;
  services: Service[];
  workingHours: WorkingHour[];
};

export type DashboardData = BookingPageData & {
  bookings: Booking[];
};

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function mapBusiness(row: BusinessRow): BusinessProfile {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category,
    tagline: row.tagline ?? "",
    description: row.description ?? "",
    location: row.location ?? "",
  };
}

function mapService(row: ServiceRow): Service {
  return {
    id: row.id,
    name: row.name,
    duration: row.duration_minutes,
    price: Number(row.price_gbp),
    description: row.description ?? "",
  };
}

function mapWorkingHour(row: WorkingHourRow): WorkingHour {
  return {
    day: dayNames[row.day_of_week] ?? "Monday",
    enabled: row.is_open,
    open: row.opens_at.slice(0, 5),
    close: row.closes_at.slice(0, 5),
  };
}

function mapBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    serviceId: row.service_id ?? "",
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    date: row.booking_date,
    time: row.booking_time.slice(0, 5),
    status: row.status,
  };
}

function logSupabaseError(action: string, error: PostgrestError | null) {
  if (error) {
    console.error(`Supabase ${action} failed:`, error.message);
  }
}

function dayIndex(day: string) {
  return dayNames.indexOf(day);
}

async function ensureDemoBusiness(ownerId?: string) {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data: existingBusiness, error: businessError } = await supabase
    .from("businesses")
    .select("id, name, slug, category, tagline, description, location")
    .eq("slug", demoBusiness.slug)
    .maybeSingle<BusinessRow>();

  logSupabaseError("business lookup", businessError);

  let business = existingBusiness;

  if (!business) {
    const { data: createdBusiness, error: createError } = await supabase
      .from("businesses")
      .insert({
        owner_id: ownerId ?? null,
        name: demoBusiness.name,
        slug: demoBusiness.slug,
        category: demoBusiness.category,
        tagline: demoBusiness.tagline,
        description: demoBusiness.description,
        location: demoBusiness.location,
      })
      .select("id, name, slug, category, tagline, description, location")
      .single<BusinessRow>();

    logSupabaseError("business insert", createError);
    business = createdBusiness;
  } else if (ownerId) {
    const { error: ownerError } = await supabase
      .from("businesses")
      .update({ owner_id: ownerId })
      .eq("id", business.id)
      .is("owner_id", null);

    logSupabaseError("business owner assignment", ownerError);
  }

  if (!business) {
    return null;
  }

  const { data: existingServices, error: servicesError } = await supabase
    .from("services")
    .select("id")
    .eq("business_id", business.id);

  logSupabaseError("service lookup", servicesError);

  if (!existingServices?.length) {
    const { error } = await supabase.from("services").insert(
      demoServices.map((service) => ({
        business_id: business.id,
        name: service.name,
        description: service.description,
        duration_minutes: service.duration,
        price_gbp: service.price,
      })),
    );

    logSupabaseError("service seed", error);
  }

  const { data: existingHours, error: hoursError } = await supabase
    .from("working_hours")
    .select("id")
    .eq("business_id", business.id);

  logSupabaseError("working hours lookup", hoursError);

  if (!existingHours?.length) {
    const { error } = await supabase.from("working_hours").insert(
      demoWorkingHours.map((entry) => ({
        business_id: business.id,
        day_of_week: dayIndex(entry.day),
        is_open: entry.enabled,
        opens_at: entry.open,
        closes_at: entry.close,
      })),
    );

    logSupabaseError("working hours seed", error);
  }

  return business;
}

export async function getBookingPageData(slug: string): Promise<BookingPageData | null> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return slug === demoBusiness.slug
      ? { business: demoBusiness, services: demoServices, workingHours: demoWorkingHours }
      : null;
  }

  if (slug === demoBusiness.slug) {
    await ensureDemoBusiness();
  }

  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("id, name, slug, category, tagline, description, location")
    .eq("slug", slug)
    .maybeSingle<BusinessRow>();

  logSupabaseError("business fetch", businessError);

  if (!business) {
    return null;
  }

  const [{ data: services, error: servicesError }, { data: workingHours, error: hoursError }] =
    await Promise.all([
      supabase
        .from("services")
        .select("id, name, description, duration_minutes, price_gbp")
        .eq("business_id", business.id)
        .order("created_at"),
      supabase
        .from("working_hours")
        .select("day_of_week, is_open, opens_at, closes_at")
        .eq("business_id", business.id)
        .order("day_of_week"),
    ]);

  logSupabaseError("services fetch", servicesError);
  logSupabaseError("working hours fetch", hoursError);

  return {
    business: mapBusiness(business),
    services: (services ?? []).map((service) => mapService(service as ServiceRow)),
    workingHours: (workingHours ?? []).map((entry) => mapWorkingHour(entry as WorkingHourRow)),
  };
}

export async function getDashboardData(ownerId?: string): Promise<DashboardData> {
  if (ownerId) {
    await ensureDemoBusiness(ownerId);
  }

  const bookingPageData =
    (await getBookingPageData(demoBusiness.slug)) ?? {
      business: demoBusiness,
      services: demoServices,
      workingHours: demoWorkingHours,
    };
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return {
      ...bookingPageData,
      bookings: [],
    };
  }

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("id, service_id, customer_name, customer_email, customer_phone, booking_date, booking_time, status")
    .eq("business_slug", bookingPageData.business.slug)
    .order("booking_date", { ascending: true })
    .order("booking_time", { ascending: true });

  logSupabaseError("bookings fetch", error);

  return {
    ...bookingPageData,
    bookings: (bookings ?? []).map((booking) => mapBooking(booking as BookingRow)),
  };
}
