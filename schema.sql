-- Run this once in your Supabase project's SQL Editor
-- (Dashboard → SQL Editor → New query → paste → Run)

-- ── Customers ────────────────────────────────────────────────
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  address text,
  email text,
  created_at timestamptz not null default now()
);

-- ── Orders ───────────────────────────────────────────────────
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete set null,
  name text not null,
  phone text not null,
  address text not null,
  items jsonb not null,        -- e.g. [{"name":"Elaichi Shrikhand","size":"500 g","qty":2,"price":240}]
  total numeric,
  status text not null default 'new',   -- 'new' | 'done'
  created_at timestamptz not null default now()
);

-- ── Row Level Security ──────────────────────────────────────
-- RLS is what makes it SAFE to use the publishable (anon) key in your
-- frontend. Without it, enabling the table at all would let the anon
-- key do anything. With it, you control exactly what anonymous
-- visitors (your customers) can and can't do.

alter table customers enable row level security;
alter table orders    enable row level security;

-- Customers (site visitors) can CREATE their own profile and orders,
-- but cannot read, change, or delete anyone's data — including their own,
-- from the browser. That protects every customer's info from every
-- other visitor.
create policy "anyone can insert a customer profile"
  on customers for insert
  with check (true);

create policy "anyone can insert an order"
  on orders for insert
  with check (true);

-- Only YOU, signed in through Supabase Auth (see README), can view or
-- manage the data — this is what your admin/owner panel should use.
create policy "owner can view customers"
  on customers for select
  using (auth.role() = 'authenticated');

create policy "owner can view orders"
  on orders for select
  using (auth.role() = 'authenticated');

create policy "owner can update orders"
  on orders for update
  using (auth.role() = 'authenticated');

create policy "owner can delete orders"
  on orders for delete
  using (auth.role() = 'authenticated');
