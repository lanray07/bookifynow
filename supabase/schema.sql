create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text unique not null,
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references users(id) on delete cascade,
  name text not null,
  slug text unique not null,
  category text not null,
  tagline text,
  description text,
  location text,
  created_at timestamptz not null default now()
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null,
  description text,
  duration_minutes integer not null,
  price_gbp numeric(10,2) not null,
  created_at timestamptz not null default now()
);

create table if not exists working_hours (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  day_of_week integer not null check (day_of_week between 0 and 6),
  is_open boolean not null default true,
  opens_at time not null,
  closes_at time not null,
  unique (business_id, day_of_week)
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade,
  service_id uuid references services(id) on delete set null,
  business_slug text not null,
  booking_date date not null,
  booking_time time not null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists bookings_business_slug_date_idx
  on bookings (business_slug, booking_date, booking_time);

alter table users enable row level security;
alter table businesses enable row level security;
alter table services enable row level security;
alter table working_hours enable row level security;
alter table bookings enable row level security;
