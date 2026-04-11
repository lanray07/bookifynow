import Link from "next/link";
import { ArrowRight, CalendarRange, Clock3, ShieldCheck, Sparkles } from "lucide-react";

const features = [
  {
    title: "A booking page your clients can trust",
    body: "Share one clean public link for appointments, from first-time clients to regulars.",
    icon: CalendarRange,
  },
  {
    title: "Set services and working hours fast",
    body: "Barbers, salons, and beauty pros can publish services, pricing, and weekly availability without friction.",
    icon: Clock3,
  },
  {
    title: "Admin controls that stay lightweight",
    body: "View, edit, and cancel bookings from a simple dashboard that feels calm on desktop and mobile.",
    icon: ShieldCheck,
  },
];

const pricing = [
  {
    name: "Starter",
    price: "£19",
    description: "For solo professionals who need fast setup and a polished booking page.",
    items: ["1 business profile", "Unlimited services", "Public booking link", "Email capture"],
  },
  {
    name: "Growth",
    price: "£39",
    description: "For busier teams that want stronger scheduling control and more visibility.",
    items: ["Everything in Starter", "Multi-staff ready structure", "Priority support", "Expanded reporting hooks"],
  },
];

export default function Home() {
  return (
    <main className="bg-[#f4efe8] text-[#1b1712]">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.9),_transparent_38%),linear-gradient(135deg,_#0d0d0d_0%,_#271d16_55%,_#5e442a_100%)]" />
        <div className="absolute inset-y-0 right-[-12%] hidden w-[42rem] rounded-full bg-[#e8c89a]/20 blur-3xl lg:block" />
        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-14 pt-6 sm:px-10 lg:px-12">
          <header className="flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold tracking-[0.2em] text-white">
              BOOKIFYNOW
            </Link>
            <nav className="hidden items-center gap-8 text-sm text-white/72 md:flex">
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <Link
                href="/login"
                className="rounded-full border border-white/20 px-5 py-2 text-white transition hover:bg-white/10"
              >
                Signup
              </Link>
            </nav>
          </header>

          <div className="grid flex-1 items-center gap-16 py-14 lg:grid-cols-[0.95fr_1.05fr] lg:py-20">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/70">
                <Sparkles className="h-4 w-4" />
                SaaS booking system
              </span>
              <h1 className="mt-8 text-5xl font-semibold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                Bookings for beauty businesses that want less admin and more flow.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/72 sm:text-lg">
                BookifyNow gives barbers, salons, and beauty professionals a mobile-friendly
                booking page, a clean admin dashboard, and a Supabase-backed foundation ready for
                Vercel.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/login"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f5ead9] px-6 text-sm font-semibold text-[#1b1712] transition hover:bg-white"
                >
                  Signup
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/book/bookify-studio"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  See booking page
                </Link>
              </div>
            </div>

            <div className="grid gap-4 rounded-[2rem] border border-white/12 bg-white/8 p-4 backdrop-blur sm:p-6">
              <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[1.75rem] bg-[#f7f1e8] p-6">
                  <p className="text-xs uppercase tracking-[0.35em] text-[#7c6550]">
                    Booking page
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#1f1812]">
                    Select a service, pick a slot, confirm in seconds.
                  </h2>
                  <div className="mt-6 grid gap-3">
                    {["Precision Haircut", "Colour Refresh", "Brow Shape"].map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-[#dfcfba] bg-white px-4 py-3 text-sm text-[#3f3328]"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-[1.75rem] bg-[#111111] p-6 text-white">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/50">Today</p>
                  <div className="mt-5 grid gap-3">
                    {["09:30", "10:00", "10:30", "11:00"].map((time) => (
                      <div
                        key={time}
                        className={`rounded-full px-4 py-2 text-center text-sm ${
                          time === "10:30"
                            ? "bg-[#e7c58f] font-semibold text-[#231a11]"
                            : "border border-white/15 text-white/70"
                        }`}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-[#17120f] p-6 text-white">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-white/45">Dashboard</p>
                    <p className="mt-2 text-2xl font-semibold">Everything operators need, nothing noisy.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/45">This week</p>
                    <p className="mt-2 text-3xl font-semibold text-[#e7c58f]">28 bookings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.35em] text-[#8b7157]">Features</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[#1f1812] sm:text-5xl">
            Built for appointment-based businesses that need clarity, not clutter.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {features.map(({ title, body, icon: Icon }) => (
            <article key={title} className="rounded-[2rem] border border-[#dfd4c5] bg-[#fbf8f3] p-8">
              <Icon className="h-6 w-6 text-[#8a6842]" />
              <h3 className="mt-6 text-2xl font-semibold text-[#1f1812]">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-[#66594d]">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="pricing" className="border-y border-[#e6dccd] bg-[#efe5d6]">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.35em] text-[#8b7157]">Pricing</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[#1f1812] sm:text-5xl">
              Straightforward pricing for independent businesses and growing teams.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {pricing.map((plan) => (
              <article key={plan.name} className="rounded-[2rem] bg-[#fffaf3] p-8 shadow-[0_18px_50px_rgba(39,29,21,0.08)]">
                <p className="text-sm uppercase tracking-[0.3em] text-[#8b7157]">{plan.name}</p>
                <div className="mt-5 flex items-end gap-3">
                  <span className="text-5xl font-semibold tracking-tight text-[#1f1812]">{plan.price}</span>
                  <span className="pb-2 text-sm text-[#776a5d]">per month</span>
                </div>
                <p className="mt-5 max-w-lg text-sm leading-7 text-[#66594d]">{plan.description}</p>
                <div className="mt-8 grid gap-3 text-sm text-[#2b221a]">
                  {plan.items.map((item) => (
                    <div key={item} className="rounded-full border border-[#e4d7c6] px-4 py-3">
                      {item}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12">
        <div className="rounded-[2.5rem] bg-[#1a140f] px-8 py-10 text-white sm:px-12 sm:py-14">
          <p className="text-xs uppercase tracking-[0.35em] text-white/45">Ready to launch</p>
          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Launch BookifyNow on `bookifynow.com` with Next.js, Supabase, and Vercel.
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/68 sm:text-base">
                The project is structured so you can plug in Supabase credentials, deploy to Vercel,
                and expand from the starter flows without reworking the foundation.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#f5ead9] px-6 text-sm font-semibold text-[#1b1712] transition hover:bg-white"
            >
              Open dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
