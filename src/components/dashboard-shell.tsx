"use client";

import { useState } from "react";
import {
  CalendarRange,
  Clock3,
  PencilLine,
  Plus,
  Save,
  Scissors,
  Store,
  Trash2,
} from "lucide-react";
import { Booking, BusinessProfile, Service, WorkingHour } from "@/lib/types";

type DashboardShellProps = {
  initialBusiness: BusinessProfile;
  initialServices: Service[];
  initialBookings: Booking[];
  initialWorkingHours: WorkingHour[];
};

export function DashboardShell({
  initialBusiness,
  initialServices,
  initialBookings,
  initialWorkingHours,
}: DashboardShellProps) {
  const [business, setBusiness] = useState(initialBusiness);
  const [services, setServices] = useState(initialServices);
  const [bookings, setBookings] = useState(initialBookings);
  const [workingHours, setWorkingHours] = useState(initialWorkingHours);
  const [saving, setSaving] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newService, setNewService] = useState({
    name: "",
    duration: "45",
    price: "30",
    description: "",
  });

  async function saveBusinessProfile() {
    setSaving("profile");
    setNotice(null);
    setError(null);

    try {
      const response = await fetch(`/api/businesses/${business.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(business),
      });
      const payload = (await response.json()) as {
        business?: BusinessProfile;
        error?: string;
      };

      if (!response.ok || !payload.business) {
        throw new Error(payload.error ?? "Profile could not be saved.");
      }

      setBusiness(payload.business);
      setNotice("Business profile saved.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Profile could not be saved.");
    } finally {
      setSaving(null);
    }
  }

  async function cancelBooking(id: string) {
    setSaving(`booking-${id}`);
    setNotice(null);
    setError(null);

    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Booking could not be cancelled.");
      }

      setBookings((current) =>
        current.map((booking) =>
          booking.id === id ? { ...booking, status: "cancelled" } : booking,
        ),
      );
      setNotice("Booking cancelled.");
    } catch (cancelError) {
      setError(
        cancelError instanceof Error ? cancelError.message : "Booking could not be cancelled.",
      );
    } finally {
      setSaving(null);
    }
  }

  async function addService() {
    if (!newService.name || !newService.description) {
      return;
    }

    setSaving("service");
    setNotice(null);
    setError(null);

    try {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          name: newService.name,
          duration: Number(newService.duration),
          price: Number(newService.price),
          description: newService.description,
        }),
      });
      const payload = (await response.json()) as { service?: Service; error?: string };

      if (!response.ok || !payload.service) {
        throw new Error(payload.error ?? "Service could not be added.");
      }

      setServices((current) => [...current, payload.service as Service]);
      setNewService({
        name: "",
        duration: "45",
        price: "30",
        description: "",
      });
      setNotice("Service added.");
    } catch (serviceError) {
      setError(serviceError instanceof Error ? serviceError.message : "Service could not be added.");
    } finally {
      setSaving(null);
    }
  }

  async function saveWorkingHours() {
    setSaving("hours");
    setNotice(null);
    setError(null);

    try {
      const response = await fetch("/api/working-hours", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: business.id, workingHours }),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Working hours could not be saved.");
      }

      setNotice("Working hours saved.");
    } catch (hoursError) {
      setError(
        hoursError instanceof Error ? hoursError.message : "Working hours could not be saved.",
      );
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="grid gap-6">
        <div className="rounded-[2rem] border border-[#e7dece] bg-white p-6 shadow-[0_16px_50px_rgba(27,22,17,0.06)] sm:p-8">
          <div className="flex items-center gap-3">
            <Store className="h-5 w-5 text-[#8a6842]" />
            <h2 className="text-xl font-semibold text-[#1f1812]">Business profile</h2>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-[#5c5044]">
              Business name
              <input
                value={business.name}
                onChange={(event) => setBusiness((current) => ({ ...current, name: event.target.value }))}
                className="rounded-2xl border border-[#d9ccb8] px-4 py-3 text-[#1f1812] outline-none transition focus:border-[#8a6842]"
              />
            </label>
            <label className="grid gap-2 text-sm text-[#5c5044]">
              Category
              <input
                value={business.category}
                onChange={(event) =>
                  setBusiness((current) => ({ ...current, category: event.target.value }))
                }
                className="rounded-2xl border border-[#d9ccb8] px-4 py-3 text-[#1f1812] outline-none transition focus:border-[#8a6842]"
              />
            </label>
            <label className="grid gap-2 text-sm text-[#5c5044]">
              Slug
              <input
                value={business.slug}
                onChange={(event) => setBusiness((current) => ({ ...current, slug: event.target.value }))}
                className="rounded-2xl border border-[#d9ccb8] px-4 py-3 text-[#1f1812] outline-none transition focus:border-[#8a6842]"
              />
            </label>
            <label className="grid gap-2 text-sm text-[#5c5044]">
              Location
              <input
                value={business.location}
                onChange={(event) =>
                  setBusiness((current) => ({ ...current, location: event.target.value }))
                }
                className="rounded-2xl border border-[#d9ccb8] px-4 py-3 text-[#1f1812] outline-none transition focus:border-[#8a6842]"
              />
            </label>
            <label className="grid gap-2 text-sm text-[#5c5044] sm:col-span-2">
              Tagline
              <input
                value={business.tagline}
                onChange={(event) =>
                  setBusiness((current) => ({ ...current, tagline: event.target.value }))
                }
                className="rounded-2xl border border-[#d9ccb8] px-4 py-3 text-[#1f1812] outline-none transition focus:border-[#8a6842]"
              />
            </label>
            <label className="grid gap-2 text-sm text-[#5c5044] sm:col-span-2">
              Description
              <textarea
                rows={4}
                value={business.description}
                onChange={(event) =>
                  setBusiness((current) => ({ ...current, description: event.target.value }))
                }
                className="rounded-[1.5rem] border border-[#d9ccb8] px-4 py-3 text-[#1f1812] outline-none transition focus:border-[#8a6842]"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={saveBusinessProfile}
            disabled={saving === "profile"}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#201912] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3b2f24] disabled:cursor-not-allowed disabled:bg-[#8d8274]"
          >
            <Save className="h-4 w-4" />
            {saving === "profile" ? "Saving..." : "Save profile"}
          </button>
          {notice ? <p className="mt-4 text-sm text-emerald-700">{notice}</p> : null}
          {error ? <p className="mt-4 text-sm text-rose-700">{error}</p> : null}
        </div>

        <div className="rounded-[2rem] border border-[#e7dece] bg-white p-6 shadow-[0_16px_50px_rgba(27,22,17,0.06)] sm:p-8">
          <div className="flex items-center gap-3">
            <Scissors className="h-5 w-5 text-[#8a6842]" />
            <h2 className="text-xl font-semibold text-[#1f1812]">Services</h2>
          </div>
          <div className="mt-6 grid gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="grid gap-4 rounded-[1.75rem] border border-[#eee6da] bg-[#fcfaf7] p-5 sm:grid-cols-[1.2fr_120px_100px_auto]"
              >
                <div>
                  <p className="font-medium text-[#1f1812]">{service.name}</p>
                  <p className="mt-1 text-sm leading-6 text-[#6f6256]">{service.description}</p>
                </div>
                <div className="text-sm text-[#4b4033]">{service.duration} min</div>
                <div className="text-sm font-medium text-[#4b4033]">£{service.price}</div>
                <button className="inline-flex items-center gap-2 rounded-full border border-[#dacbb8] px-4 py-2 text-sm text-[#47392c] transition hover:border-[#8a6842]">
                  <PencilLine className="h-4 w-4" />
                  Edit
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 rounded-[1.75rem] border border-dashed border-[#d9ccb8] p-5">
            <h3 className="text-base font-semibold text-[#1f1812]">Add service</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={newService.name}
                onChange={(event) => setNewService((current) => ({ ...current, name: event.target.value }))}
                placeholder="Service name"
                className="rounded-2xl border border-[#d9ccb8] px-4 py-3 text-sm text-[#1f1812] outline-none transition focus:border-[#8a6842]"
              />
              <input
                value={newService.description}
                onChange={(event) =>
                  setNewService((current) => ({ ...current, description: event.target.value }))
                }
                placeholder="Short description"
                className="rounded-2xl border border-[#d9ccb8] px-4 py-3 text-sm text-[#1f1812] outline-none transition focus:border-[#8a6842]"
              />
              <input
                type="number"
                min="15"
                step="15"
                value={newService.duration}
                onChange={(event) =>
                  setNewService((current) => ({ ...current, duration: event.target.value }))
                }
                placeholder="Duration"
                className="rounded-2xl border border-[#d9ccb8] px-4 py-3 text-sm text-[#1f1812] outline-none transition focus:border-[#8a6842]"
              />
              <input
                type="number"
                min="1"
                step="1"
                value={newService.price}
                onChange={(event) =>
                  setNewService((current) => ({ ...current, price: event.target.value }))
                }
                placeholder="Price"
                className="rounded-2xl border border-[#d9ccb8] px-4 py-3 text-sm text-[#1f1812] outline-none transition focus:border-[#8a6842]"
              />
            </div>
            <button
              type="button"
              onClick={addService}
              disabled={saving === "service"}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-[#201912] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3b2f24] disabled:cursor-not-allowed disabled:bg-[#8d8274]"
            >
              <Plus className="h-4 w-4" />
              {saving === "service" ? "Adding..." : "Add service"}
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-6">
        <div className="rounded-[2rem] border border-[#e7dece] bg-white p-6 shadow-[0_16px_50px_rgba(27,22,17,0.06)] sm:p-8">
          <div className="flex items-center gap-3">
            <Clock3 className="h-5 w-5 text-[#8a6842]" />
            <h2 className="text-xl font-semibold text-[#1f1812]">Working hours</h2>
          </div>
          <div className="mt-6 grid gap-3">
            {workingHours.map((entry) => (
              <div
                key={entry.day}
                className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 rounded-[1.5rem] border border-[#eee6da] px-4 py-3"
              >
                <div className="text-sm font-medium text-[#2e241b]">{entry.day}</div>
                <label className="inline-flex items-center gap-2 text-sm text-[#5d5145]">
                  <input
                    type="checkbox"
                    checked={entry.enabled}
                    onChange={(event) =>
                      setWorkingHours((current) =>
                        current.map((item) =>
                          item.day === entry.day ? { ...item, enabled: event.target.checked } : item,
                        ),
                      )
                    }
                  />
                  Open
                </label>
                <input
                  type="time"
                  value={entry.open}
                  onChange={(event) =>
                    setWorkingHours((current) =>
                      current.map((item) =>
                        item.day === entry.day ? { ...item, open: event.target.value } : item,
                      ),
                    )
                  }
                  className="rounded-full border border-[#d9ccb8] px-3 py-2 text-sm"
                />
                <input
                  type="time"
                  value={entry.close}
                  onChange={(event) =>
                    setWorkingHours((current) =>
                      current.map((item) =>
                        item.day === entry.day ? { ...item, close: event.target.value } : item,
                      ),
                    )
                  }
                  className="rounded-full border border-[#d9ccb8] px-3 py-2 text-sm"
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={saveWorkingHours}
            disabled={saving === "hours"}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#201912] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3b2f24] disabled:cursor-not-allowed disabled:bg-[#8d8274]"
          >
            <Save className="h-4 w-4" />
            {saving === "hours" ? "Saving..." : "Save working hours"}
          </button>
        </div>

        <div className="rounded-[2rem] border border-[#e7dece] bg-white p-6 shadow-[0_16px_50px_rgba(27,22,17,0.06)] sm:p-8">
          <div className="flex items-center gap-3">
            <CalendarRange className="h-5 w-5 text-[#8a6842]" />
            <h2 className="text-xl font-semibold text-[#1f1812]">Bookings</h2>
          </div>
          <div className="mt-6 grid gap-3">
            {bookings.map((booking) => {
              const service = services.find((item) => item.id === booking.serviceId);

              return (
                <div
                  key={booking.id}
                  className="rounded-[1.5rem] border border-[#eee6da] bg-[#fcfaf7] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-[#1f1812]">{booking.customerName}</p>
                      <p className="mt-1 text-sm text-[#6f6256]">
                        {service?.name ?? "Service"} · {booking.date} at {booking.time}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                        booking.status === "confirmed"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-[#5d5145]">
                    <span>{booking.customerEmail}</span>
                    <span>{booking.customerPhone}</span>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button className="rounded-full border border-[#d8ccb9] px-4 py-2 text-sm text-[#493c2f] transition hover:border-[#8a6842]">
                      Edit service
                    </button>
                    <button
                      type="button"
                      onClick={() => cancelBooking(booking.id)}
                      disabled={saving === `booking-${booking.id}` || booking.status === "cancelled"}
                      className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      {saving === `booking-${booking.id}` ? "Cancelling..." : "Cancel booking"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
