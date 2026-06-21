-- ============================================
-- AFFILIATE & DISCOUNT CODE SYSTEM
-- Teman Skripsi · Juni 2026
-- Jalankan di Supabase SQL Editor
-- ============================================

-- 1. Tabel affiliate_codes
create table if not exists affiliate_codes (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  sales_name text not null,
  sales_email text not null,
  sales_password text not null,
  sales_whatsapp text,
  commission_per_sale integer default 50000,
  discount_amount integer default 50000,
  total_sales integer default 0,
  total_commission integer default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 2. Tambah kolom ke tabel registrations
alter table registrations
  add column if not exists affiliate_code text references affiliate_codes(code),
  add column if not exists discount_amount integer default 0,
  add column if not exists final_price integer;

-- 3. Tabel affiliate_transactions
create table if not exists affiliate_transactions (
  id uuid default gen_random_uuid() primary key,
  affiliate_code text references affiliate_codes(code),
  registration_id uuid references registrations(id) on delete cascade,
  buyer_name text,
  commission_amount integer,
  status text default 'pending',
  created_at timestamptz default now()
);

-- 4. RPC function increment_affiliate_stats
create or replace function increment_affiliate_stats(p_code text, p_commission integer)
returns void as $$
begin
  update affiliate_codes
  set
    total_sales = total_sales + 1,
    total_commission = total_commission + p_commission
  where code = p_code;
end;
$$ language plpgsql security definer;

-- 5. RLS Policies
alter table affiliate_codes enable row level security;
alter table affiliate_transactions enable row level security;

-- Drop existing policies if any
drop policy if exists "Admin only affiliate_codes" on affiliate_codes;
drop policy if exists "Admin only affiliate_transactions" on affiliate_transactions;
drop policy if exists "Public read affiliate_codes" on affiliate_codes;
drop policy if exists "Public read affiliate_transactions" on affiliate_transactions;

-- Service role (API) bisa akses semua
create policy "Service role full access codes" on affiliate_codes
  using (true) with check (true);

create policy "Service role full access transactions" on affiliate_transactions
  using (true) with check (true);
