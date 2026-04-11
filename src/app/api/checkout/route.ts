import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

type PlanId = "starter" | "growth";

const priceIds: Record<PlanId, string> = {
  growth: "price_1TKu1wEy1lhVQH8aYRBNMtxt",
  starter: "price_1TKu1BEy1lhVQH8aqbvn4Do5",
};

function isPlanId(value: FormDataEntryValue | null): value is PlanId {
  return value === "starter" || value === "growth";
}

function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const planId = formData.get("plan");

  if (!isPlanId(planId)) {
    return NextResponse.json({ error: "Please choose a valid subscription plan." }, { status: 400 });
  }

  const stripe = getStripeClient();

  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured yet. Add STRIPE_SECRET_KEY to enable checkout." },
      { status: 500 },
    );
  }

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceIds[planId],
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${origin}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/#pricing`,
  });

  if (!session.url) {
    return NextResponse.json({ error: "Stripe did not return a checkout URL." }, { status: 500 });
  }

  return NextResponse.redirect(session.url, { status: 303 });
}
