import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import { WorkingHour } from "@/lib/types";

type WorkingHoursPayload = {
  businessId: string;
  workingHours: WorkingHour[];
};

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function dayIndex(day: string) {
  return dayNames.indexOf(day);
}

export async function PUT(request: Request) {
  const payload = (await request.json()) as Partial<WorkingHoursPayload>;

  if (!payload.businessId || !payload.workingHours?.length) {
    return NextResponse.json(
      { error: "Business and working hours are required." },
      { status: 400 },
    );
  }

  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ ok: true });
  }

  const rows = payload.workingHours.map((entry) => ({
    business_id: payload.businessId,
    day_of_week: dayIndex(entry.day),
    is_open: entry.enabled,
    opens_at: entry.open,
    closes_at: entry.close,
  }));

  const { error } = await supabase.from("working_hours").upsert(rows, {
    onConflict: "business_id,day_of_week",
  });

  if (error) {
    return NextResponse.json(
      { error: `Working hours could not be saved: ${error.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
