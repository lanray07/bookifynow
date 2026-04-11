# BookifyNow

BookifyNow is a Vercel-ready SaaS booking starter for barbers, salons, and beauty professionals.

## Included

- Marketing homepage with hero, features, pricing, and signup CTA
- Dashboard for business profile, services, working hours, and bookings
- Public booking page with service, date, time, and customer details
- Supabase-ready booking API route and starter SQL schema

## Stack

- Next.js App Router
- Tailwind CSS
- Supabase
- Vercel deployment ready

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase setup

1. Create a Supabase project.
2. Run [`supabase/schema.sql`](/C:/Users/User/Documents/Bookifynow/supabase/schema.sql) in the SQL editor.
3. Copy [`.env.example`](/C:/Users/User/Documents/Bookifynow/.env.example) to `.env.local`.
4. Add:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Without env vars, the app still renders and the booking endpoint works in demo mode.

## Main routes

- `/`
- `/dashboard`
- `/book/bookify-studio`

## Stripe checkout

The pricing cards post to `/api/checkout`, which creates a Stripe Checkout Session
in subscription mode. Add `STRIPE_SECRET_KEY` to `.env.local` and Vercel before
enabling live checkout.

## Credits

- Hero photo by RDNE Stock project on Pexels.

## Deploy to Vercel

1. Push the repo to GitHub.
2. Import it into Vercel.
3. Add the three Supabase environment variables.
4. Point `bookifynow.com` at the Vercel project.
