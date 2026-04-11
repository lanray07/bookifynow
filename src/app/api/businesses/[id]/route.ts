import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import { BusinessProfile } from "@/lib/types";

type BusinessRouteProps = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: BusinessRouteProps) {
  const { id } = await params;
  const payload = (await request.json()) as Partial<BusinessProfile>;

  if (!payload.name || !payload.slug || !payload.category) {
    return NextResponse.json(
      { error: "Business name, slug, and category are required." },
      { status: 400 },
    );
  }

  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ business: { ...payload, id } });
  }

  const { data, error } = await supabase
    .from("businesses")
    .update({
      name: payload.name,
      slug: payload.slug,
      category: payload.category,
      tagline: payload.tagline ?? "",
      description: payload.description ?? "",
      location: payload.location ?? "",
    })
    .eq("id", id)
    .select("id, name, slug, category, tagline, description, location")
    .single();

  if (error) {
    return NextResponse.json(
      { error: `Business profile could not be saved: ${error.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({
    business: {
      id: data.id,
      name: data.name,
      slug: data.slug,
      category: data.category,
      tagline: data.tagline ?? "",
      description: data.description ?? "",
      location: data.location ?? "",
    } satisfies BusinessProfile,
  });
}
