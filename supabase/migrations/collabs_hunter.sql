-- ============================================
-- COLLABS HUNTER: OUTREACH & AFFILIATE PIPELINE
-- Teman Skripsi · Juli 2026
-- Jalankan di Supabase SQL Editor
-- ============================================

-- 1. Kolom source di affiliate_codes, buat tracking asal channel kode (optional analytics)
alter table affiliate_codes
  add column if not exists source text default 'manual';

-- 2. Tabel collabs_prospects
create table if not exists collabs_prospects (
  id uuid primary key default gen_random_uuid(),
  username_ig text not null,
  followers_count integer not null default 0,
  kampus text,
  status text not null default 'target'
    check (status in ('target', 'dm_sent', 'deal', 'live', 'rejected')),
  format_collab text
    check (format_collab in ('sg_statis', 'video_promosi')),
  affiliate_code_ft text references affiliate_codes(code) on delete set null,
  affiliate_code_mp text references affiliate_codes(code) on delete set null,
  notes text,
  dm_sent_at timestamptz,
  deal_at timestamptz,
  live_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_collabs_prospects_status on collabs_prospects(status);
create unique index if not exists idx_collabs_prospects_username on collabs_prospects(lower(username_ig));

-- 3. RLS (service role only, sama kayak affiliate_codes/affiliate_transactions)
alter table collabs_prospects enable row level security;

drop policy if exists "Service role full access collabs_prospects" on collabs_prospects;

create policy "Service role full access collabs_prospects" on collabs_prospects
  using (true) with check (true);
