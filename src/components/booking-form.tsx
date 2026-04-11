"use client";

import { FormEvent, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Clock3, Scissors, UserRound } from "lucide-react";
import { BusinessProfile, Service, WorkingHour } from "@/lib/types";

type BookingFormProps = {
  business: BusinessProfile;
  services: Service[];
  workingHours: WorkingHour[];
  initialDate: string;
};

type FormState = {
  serviceId: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
};

function buildSlots(open: string, close: string) {
  const [openHour, openMinute] = open.split(":").map(Number);
  const [closeHour, closeMinute] = close.split(":").map(Number);
  const start = openHour * 60 + openMinute;
  const end = closeHour * 60 + closeMinute;
  const slots: string[] = [];

  for (let minutes = start; minutes + 30 <= end; minutes += 30) {
    const hours = Math.floor(minutes / 60)
      .toString()
      .padStart(2, "0");
    const remainder = (minutes % 60).toString().padStart(2, "0");
    slots.push(`${hours}:${remainder}`);
  }

  return slots;
}

export function BookingForm({
  business,
  services,
  workingHours,
  initialDate,
}: BookingFormProps) {
  const [form, setForm] = useState<FormState>({
    serviceId: services[0]?.id ?? "",
    date: initialDate,
    time: "",
    name: "",
    phone: "",
    email: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeService = services.find((service) => service.id === form.serviceId) ?? services[0];

  const selectedWorkingDay = useMemo(() => {
    const weekday = new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      timeZone: "UTC",
    }).format(new Date(`${form.date}T00:00:00Z`));

    return workingHours.find((entry) => entry.day === weekday);
  }, [form.date, workingHours]);

  const availableSlots =
    selectedWorkingDay && selectedWorkingDay.enabled
      ? buildSlots(selectedWorkingDay.open, selectedWorkingDay.close)
      : [];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setConfirmation(null);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessSlug: business.slug,
          serviceId: form.serviceId,
          date: form.date,
          time: form.time,
          customerName: form.name,
          customerPhone: form.phone,
          customerEmail: form.email,
        }),
      });

      const payload = (await response.json()) as { confirmation?: string; error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Booking could not be created.");
      }

      setConfirmation(
        payload.confirmation ??
          `Booking confirmed for ${form.name} on ${form.date} at ${form.time}.`,
      );
      setForm((current) => ({
        ...current,
        time: "",
        name: "",
        phone: "",
        email: "",
      }));
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Booking could not be created.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[2rem] border border-white/12 bg-[#111111] p-8 text-white shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
        <span className="inline-flex items-center rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-[0.35em] text-white/60">
          Public booking page
        </span>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
          Book {business.name} in under a minute.
        </h2>
        <p className="mt-4 max-w-lg text-sm leading-7 text-white/68 sm:text-base">
          Customers pick a service, lock a time, and send their details in one clean flow that
          works well on mobile.
        </p>

        <div className="mt-8 space-y-4">
          <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <Scissors className="mt-1 h-5 w-5 text-[#e7c58f]" />
            <div>
              <p className="text-sm font-medium">Choose service</p>
              <p className="mt-1 text-sm text-white/60">
                Show pricing, duration, and descriptions before the customer commits.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <CalendarDays className="mt-1 h-5 w-5 text-[#e7c58f]" />
            <div>
              <p className="text-sm font-medium">Pick date and slot</p>
              <p className="mt-1 text-sm text-white/60">
                Times are generated from your working hours so bookings stay within schedule.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <UserRound className="mt-1 h-5 w-5 text-[#e7c58f]" />
            <div>
              <p className="text-sm font-medium">Capture customer details</p>
              <p className="mt-1 text-sm text-white/60">
                Collect name, phone, and email before confirming the appointment.
              </p>
            </div>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-[2rem] border border-[#d8d0c2] bg-[#f7f1e8] p-6 shadow-[0_20px_60px_rgba(53,39,24,0.10)] sm:p-8"
      >
        <div className="grid gap-6">
          <div>
            <label className="text-sm font-medium text-[#3f3328]" htmlFor="service">
              Service
            </label>
            <select
              id="service"
              value={form.serviceId}
              onChange={(event) =>
                setForm((current) => ({ ...current, serviceId: event.target.value }))
              }
              className="mt-2 w-full rounded-2xl border border-[#cfbfaa] bg-white px-4 py-3 text-sm text-[#2b221a] outline-none transition focus:border-[#7d5f3b]"
            >
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} · {service.duration} min · £{service.price}
                </option>
              ))}
            </select>
            {activeService ? (
              <p className="mt-2 text-sm text-[#6f6256]">{activeService.description}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-[#3f3328]" htmlFor="date">
                Date
              </label>
              <input
                id="date"
                type="date"
                value={form.date}
                min={initialDate}
                onChange={(event) =>
                  setForm((current) => ({ ...current, date: event.target.value, time: "" }))
                }
                className="mt-2 w-full rounded-2xl border border-[#cfbfaa] bg-white px-4 py-3 text-sm text-[#2b221a] outline-none transition focus:border-[#7d5f3b]"
                required
              />
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-[#3f3328]">
                <Clock3 className="h-4 w-4" />
                Available times
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {availableSlots.length ? (
                  availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setForm((current) => ({ ...current, time: slot }))}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        form.time === slot
                          ? "border-[#7d5f3b] bg-[#7d5f3b] text-white"
                          : "border-[#cfbfaa] bg-white text-[#4a3c2e] hover:border-[#7d5f3b]"
                      }`}
                    >
                      {slot}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-[#7e7267]">No working hours available for this day.</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-[#3f3328]" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-[#cfbfaa] bg-white px-4 py-3 text-sm text-[#2b221a] outline-none transition focus:border-[#7d5f3b]"
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#3f3328]" htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                value={form.phone}
                onChange={(event) =>
                  setForm((current) => ({ ...current, phone: event.target.value }))
                }
                className="mt-2 w-full rounded-2xl border border-[#cfbfaa] bg-white px-4 py-3 text-sm text-[#2b221a] outline-none transition focus:border-[#7d5f3b]"
                placeholder="+44 7700 900123"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-[#3f3328]" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-[#cfbfaa] bg-white px-4 py-3 text-sm text-[#2b221a] outline-none transition focus:border-[#7d5f3b]"
              placeholder="you@example.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !form.time}
            suppressHydrationWarning
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#1b1712] px-6 text-sm font-semibold text-white transition hover:bg-[#33291d] disabled:cursor-not-allowed disabled:bg-[#8d8274]"
          >
            {submitting ? "Confirming..." : "Confirm booking"}
          </button>

          {confirmation ? (
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{confirmation}</p>
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
              {error}
            </div>
          ) : null}
        </div>
      </form>
    </div>
  );
}
