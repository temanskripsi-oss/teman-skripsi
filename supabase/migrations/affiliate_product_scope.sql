-- ============================================
-- AFFILIATE CODES: PER-PRODUCT SCOPING
-- Teman Skripsi · Juli 2026
-- Jalankan di Supabase SQL Editor
-- ============================================

-- 1. Tambah kolom product (fastrack | mentoring)
alter table affiliate_codes
  add column if not exists product text not null default 'fastrack';

-- 2. Sales lama (satu kode generik) dianggap kode fastrack, biar gak ganggu histori.
--    Beri komentar biar admin ingat harus tambah kode "mentoring" terpisah kalau perlu.
comment on column affiliate_codes.product is 'fastrack = diskon/komisi 50rb, mentoring = diskon/komisi 100rb (berlaku utk mentoring-sempro & mentoring-penelitian)';

-- 3. Kode boleh sama persis di produk berbeda (mestinya gak akan kejadian karena
--    prefix FT/MP beda), tapi unique constraint lama sudah cukup (code unik global).
