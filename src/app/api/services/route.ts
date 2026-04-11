import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import { Service } from "@/lib/types";

type ServicePayload = {
  businessId: string;
  name: string;
  duration: number;
  price: number;
  description: string;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<ServicePayload>;

  if (!payload.businessId || !payload.name || !payload.duration || !payload.price) {
    return NextResponse.json(
      { error: "Business, service name, duration, and price are required." },
      { status: 400 },
    );
  }

  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({
      service: {
        id: crypto.randomUUID(),
        name: payload.name,
        duration: payload.duration,
        price: payload.price,
        description: payload.description ?? "",
      } satisfies Service,
    });
  }

  const { data, error } = await supabase
    .from("services")
    .insert({
      business_id: payload.businessId,
      name: payload.name,
      description: payload.description ?? "",
      duration_minutes: payload.duration,
      price_gbp: payload.price,
    })
    .select("id, name, description, duration_minutes, price_gbp")
    .single();

  if (error) {
    return NextResponse.json(
      { error: `Service could not be added: ${error.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({
    service: {
      id: data.id,
      name: data.name,
      duration: data.duration_minutes,
      price: Number(data.price_gbp),
      description: data.description ?? "",
    } satisfies Service,
  });
}
