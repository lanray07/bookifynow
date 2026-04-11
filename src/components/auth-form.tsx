"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseAuthBrowserClient } from "@/lib/supabase-auth-client";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const supabase = createSupabaseAuthBrowserClient();

    if (!supabase) {
      setError("Supabase auth is not configured.");
      setLoading(false);
      return;
    }

    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
            },
          });

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    if (mode === "signup" && !result.data.session) {
      setMessage("Check your email to confirm your account, then log in.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto grid w-full max-w-md gap-5 rounded-[2rem] border border-[#e3d7c7] bg-[#fffaf3] p-6 shadow-[0_20px_70px_rgba(39,29,21,0.10)] sm:p-8"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-[#8b7157]">BookifyNow</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#1f1812]">
          {mode === "login" ? "Owner login" : "Create your owner account"}
        </h1>
        <p className="mt-3 text-sm leading-7 text-[#66594d]">
          Access the dashboard to manage your business profile, services, working hours, and
          bookings.
        </p>
      </div>

      <label className="grid gap-2 text-sm text-[#5c5044]">
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-2xl border border-[#d9ccb8] px-4 py-3 text-[#1f1812] outline-none transition focus:border-[#8a6842]"
          placeholder="you@example.com"
          required
        />
      </label>

      <label className="grid gap-2 text-sm text-[#5c5044]">
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-2xl border border-[#d9ccb8] px-4 py-3 text-[#1f1812] outline-none transition focus:border-[#8a6842]"
          placeholder="At least 6 characters"
          minLength={6}
          required
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#201912] px-5 text-sm font-semibold text-white transition hover:bg-[#3b2f24] disabled:cursor-not-allowed disabled:bg-[#8d8274]"
      >
        {loading ? "Please wait..." : mode === "login" ? "Log in" : "Sign up"}
      </button>

      <button
        type="button"
        onClick={() => {
          setMode((current) => (current === "login" ? "signup" : "login"));
          setError(null);
          setMessage(null);
        }}
        className="text-sm font-semibold text-[#5e442a]"
      >
        {mode === "login" ? "Need an account? Sign up" : "Already have an account? Log in"}
      </button>

      {message ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          {error}
        </div>
      ) : null}
    </form>
  );
}
