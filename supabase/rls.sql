-- Lock down direct public access to application tables.
-- The Next.js app uses SUPABASE_SERVICE_ROLE_KEY only on the server, so server routes
-- can still read/write these tables while anonymous direct Supabase requests cannot.

alter table if exists public.users enable row level security;
alter table if exists public.businesses enable row level security;
alter table if exists public.services enable row level security;
alter table if exists public.working_hours enable row level security;
alter table if exists public.bookings enable row level security;

-- Remove any permissive starter policies if they were created while prototyping.
drop policy if exists "Allow anonymous access" on public.users;
drop policy if exists "Allow anonymous access" on public.businesses;
drop policy if exists "Allow anonymous access" on public.services;
drop policy if exists "Allow anonymous access" on public.working_hours;
drop policy if exists "Allow anonymous access" on public.bookings;

drop policy if exists "Enable read access for all users" on public.users;
drop policy if exists "Enable read access for all users" on public.businesses;
drop policy if exists "Enable read access for all users" on public.services;
drop policy if exists "Enable read access for all users" on public.working_hours;
drop policy if exists "Enable read access for all users" on public.bookings;
