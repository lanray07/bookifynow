import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingForm } from "@/components/booking-form";
import { getBookingPageData } from "@/lib/supabase-data";

type BookingPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BookingPage({ params }: BookingPageProps) {
  const { slug } = await params;
  const initialDate = new Date().toISOString().slice(0, 10);
  const pageData = await getBookingPageData(slug);

  if (!pageData) {
    notFound();
  }

  const { business, services, workingHours } = pageData;

  return (
    <main className="min-h-screen bg-[#f2ebe2] px-6 py-8 sm:px-10 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#8b7157]">BookifyNow</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#1f1812] sm:text-5xl">
              {business.name}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#66594d] sm:text-base">
              {business.tagline} Based in {business.location}.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-full border border-[#d4c5b2] px-5 py-3 text-sm font-semibold text-[#2a2119] transition hover:border-[#8a6842]"
          >
            Back to dashboard
          </Link>
        </div>

        <BookingForm
          business={business}
          services={services}
          workingHours={workingHours}
          initialDate={initialDate}
        />
      </div>
    </main>
  );
}
