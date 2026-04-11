import Link from "next/link";
import { ArrowRight, MapPin, Search, Sparkles } from "lucide-react";
import { BookifyLogo } from "@/components/bookify-logo";
import { getBusinessDirectoryData } from "@/lib/supabase-data";

type BookDirectoryPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function BookDirectoryPage({ searchParams }: BookDirectoryPageProps) {
  const { q } = await searchParams;
  const businesses = await getBusinessDirectoryData(q);
  const query = q?.trim() ?? "";

  return (
    <main className="min-h-screen bg-[#f4efe8] text-[#1b1712]">
      <section className="relative isolate overflow-hidden border-b border-[#e1d5c6]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(232,200,154,0.28),_transparent_35%),linear-gradient(135deg,_#fff8ee_0%,_#efe3d2_58%,_#dbc5aa_100%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-8 sm:px-10 lg:px-12">
          <header className="flex items-center justify-between gap-4">
            <BookifyLogo />
            <Link
              href="/login"
              className="rounded-full border border-[#d4c5b2] px-5 py-3 text-sm font-semibold text-[#2a2119] transition hover:border-[#8a6842]"
            >
              List your business
            </Link>
          </header>

          <div className="grid gap-10 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#d8c4aa] bg-white/55 px-4 py-2 text-xs uppercase tracking-[0.35em] text-[#8b7157]">
                <Sparkles className="h-4 w-4" />
                Book local beauty pros
              </span>
              <h1 className="mt-8 max-w-3xl text-5xl font-semibold tracking-[-0.04em] text-[#1f1812] sm:text-6xl">
                Find a barber, salon, or beauty professional near you.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#66594d] sm:text-lg">
                Search by service, business, or location, then pick an available booking page.
              </p>
            </div>

            <form action="/book" className="rounded-[2rem] border border-[#dfd4c5] bg-[#fffaf3] p-4 shadow-[0_18px_60px_rgba(39,29,21,0.12)] sm:p-5">
              <label htmlFor="business-search" className="text-sm font-semibold text-[#2f251d]">
                What are you looking for?
              </label>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8b7157]" />
                  <input
                    id="business-search"
                    name="q"
                    defaultValue={query}
                    placeholder="Haircut, brows, salon, Shoreditch..."
                    className="min-h-12 w-full rounded-full border border-[#dfcfba] bg-white py-3 pl-12 pr-4 text-sm text-[#1f1812] outline-none transition placeholder:text-[#9b8b7a] focus:border-[#8a6842]"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#1f1812] px-6 text-sm font-semibold text-white transition hover:bg-[#3c2d20]"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#8b7157]">Available businesses</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#1f1812]">
              {businesses.length ? "Choose where to book" : "No businesses found yet"}
            </h2>
          </div>
          {query ? (
            <Link href="/book" className="text-sm font-semibold text-[#755632] underline underline-offset-4">
              Clear search
            </Link>
          ) : null}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {businesses.map((business) => (
            <article
              key={business.id}
              className="flex min-h-72 flex-col rounded-[2rem] border border-[#dfd4c5] bg-[#fffaf3] p-7 shadow-[0_18px_50px_rgba(39,29,21,0.08)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#8b7157]">{business.category}</p>
                  <h3 className="mt-4 text-3xl font-semibold tracking-tight text-[#1f1812]">
                    {business.name}
                  </h3>
                </div>
                <span className="rounded-full bg-[#efe5d6] px-3 py-1 text-xs font-semibold text-[#6d5337]">
                  {business.serviceCount} services
                </span>
              </div>
              <p className="mt-5 flex items-center gap-2 text-sm text-[#66594d]">
                <MapPin className="h-4 w-4 text-[#8a6842]" />
                {business.location}
              </p>
              <p className="mt-5 flex-1 text-sm leading-7 text-[#66594d]">{business.tagline}</p>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-[#776a5d]">
                  {business.startingPrice ? `From £${business.startingPrice}` : "Prices on booking page"}
                </p>
                <Link
                  href={`/book/${business.slug}`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#1f1812] px-5 text-sm font-semibold text-white transition hover:bg-[#3c2d20]"
                >
                  Book now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {!businesses.length ? (
          <div className="mt-10 rounded-[2rem] border border-dashed border-[#cdbb9f] bg-[#fffaf3] p-8 text-[#66594d]">
            Try a broader search, or check back as more local businesses join BookifyNow.
          </div>
        ) : null}
      </section>
    </main>
  );
}
