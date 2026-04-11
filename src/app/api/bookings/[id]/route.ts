import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

type BookingRouteProps = {
  params: Promise<{ id: string }>;
};

type BookingPatchPayload = {
  status: "confirmed" | "cancelled";
};

export async function PATCH(request: Request, { params }: BookingRouteProps) {
  const { id } = await params;
  const payload = (await request.json()) as Partial<BookingPatchPayload>;

  if (!payload.status || !["confirmed", "cancelled"].includes(payload.status)) {
    return NextResponse.json({ error: "A valid booking status is required." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ ok: true });
  }

  const { error } = await supabase
    .from("bookings")
    .update({ status: payload.status })
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: `Booking could not be updated: ${error.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
