-- ============================================
-- COLLABS HUNTER: DAILY TRACKER & FOLLOW-UP
-- Teman Skripsi · Agustus 2026
-- Jalankan di Supabase SQL Editor
-- ============================================

-- Target harian (20 DM/hari) diturunin dari dm_sent_at yang udah ada,
-- jadi ga perlu tabel counter terpisah. Yang kurang cuma penjadwalan follow-up.
alter table collabs_prospects
  add column if not exists next_followup_at date,
  add column if not exists last_contact_at timestamptz;

-- Panel "Follow-up Hari Ini" query-nya: next_followup_at <= current_date
create index if not exists idx_collabs_prospects_followup
  on collabs_prospects(next_followup_at)
  where next_followup_at is not null;

-- Progress harian & deal mingguan di-scan by date
create index if not exists idx_collabs_prospects_dm_sent_at on collabs_prospects(dm_sent_at);
create index if not exists idx_collabs_prospects_deal_at on collabs_prospects(deal_at);
