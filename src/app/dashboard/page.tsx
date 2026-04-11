import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { BookifyLogo } from "@/components/bookify-logo";
import { DashboardShell } from "@/components/dashboard-shell";
import { createSupabaseAuthServerClient } from "@/lib/supabase-auth-server";
import { getDashboardData } from "@/lib/supabase-data";

export default async function DashboardPage() {
  const supabase = await createSupabaseAuthServerClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (!user) {
    redirect("/login");
  }

  const { business, services, bookings, workingHours } = await getDashboardData(user.id);

  return (
    <main className="min-h-screen bg-[#f5efe7] px-6 py-8 sm:px-10 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 rounded-[2rem] bg-[#1b1712] px-6 py-8 text-white shadow-[0_18px_60px_rgba(31,24,18,0.18)] sm:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <BookifyLogo tone="light" />
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Create your profile, manage services, and control bookings from one place.
            </h1>
            <p className="mt-4 text-sm leading-7 text-white/70 sm:text-base">
              This starter dashboard covers the core admin surface small businesses need: business
              details, services, working hours, and appointment management.
            </p>
          </div>
          <Link
            href={`/book/${business.slug}`}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f6ead9] px-6 text-sm font-semibold text-[#1b1712] transition hover:bg-white"
          >
            Open public booking page
            <ArrowRight className="h-4 w-4" />
          </Link>
          <form action="/auth/logout" method="post">
            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Log out
            </button>
          </form>
        </div>

        <div className="mt-8">
          <DashboardShell
            initialBusiness={business}
            initialServices={services}
            initialBookings={bookings}
            initialWorkingHours={workingHours}
          />
        </div>
      </div>
    </main>
  );
}
