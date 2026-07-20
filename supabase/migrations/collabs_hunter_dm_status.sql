-- ============================================
-- COLLABS HUNTER: DM SUB-STATUS
-- Teman Skripsi · Juli 2026
-- Jalankan di Supabase SQL Editor
-- ============================================

-- Sub-status DM lebih detail dari status utama (target/dm_sent/deal/live/rejected).
-- Dipakai buat tracking progres chat per prospect: udah dikirim, dibales, pindah ke WA,
-- closing, atau ghosting (ga dibales/ga dibuka sama sekali).
alter table collabs_prospects
  add column if not exists dm_status text not null default 'belum_dm'
    check (dm_status in ('belum_dm', 'terkirim', 'balas', 'pindah_wa', 'closing', 'ghosting'));
