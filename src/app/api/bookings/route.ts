import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

type BookingPayload = {
  businessSlug: string;
  serviceId: string;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<BookingPayload>;

  if (
    !payload.businessSlug ||
    !payload.serviceId ||
    !payload.date ||
    !payload.time ||
    !payload.customerName ||
    !payload.customerPhone ||
    !payload.customerEmail
  ) {
    return NextResponse.json(
      { error: "Please complete service, date, time, and customer details." },
      { status: 400 },
    );
  }

  const supabase = createSupabaseServerClient();

  if (supabase) {
    const { data: business } = await supabase
      .from("businesses")
      .select("id")
      .eq("slug", payload.businessSlug)
      .maybeSingle<{ id: string }>();

    const { error } = await supabase.from("bookings").insert({
      business_id: business?.id ?? null,
      business_slug: payload.businessSlug,
      service_id: isUuid(payload.serviceId) ? payload.serviceId : null,
      booking_date: payload.date,
      booking_time: payload.time,
      customer_name: payload.customerName,
      customer_phone: payload.customerPhone,
      customer_email: payload.customerEmail,
      status: "confirmed",
    });

    if (error) {
      return NextResponse.json(
        { error: `Supabase could not save this booking yet: ${error.message}` },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({
    confirmation: `Booking confirmed for ${payload.customerName} on ${payload.date} at ${payload.time}.`,
  });
}
