-- 1. Tambah kolom role ke tabel profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user';

-- 2. Set role admin untuk akun kamu (ganti email sesuai akun admin)
UPDATE profiles SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'your-admin@email.com');

-- 3. Buat tabel payments
CREATE TABLE IF NOT EXISTS payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount integer NOT NULL,
  description text DEFAULT '',
  payment_date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'pending')),
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 4. Enable RLS untuk payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 5. Policy: user hanya bisa lihat payment miliknya sendiri
DROP POLICY IF EXISTS "users_view_own_payments" ON payments;
CREATE POLICY "users_view_own_payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

-- Service role (admin) bypass RLS secara otomatis

-- 6. Buat tabel feedbacks (written feedback dari mentor ke klien)
CREATE TABLE IF NOT EXISTS feedbacks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  type text NOT NULL CHECK (type IN ('pdf', 'video')),
  url text NOT NULL,
  session_number integer,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 7. Enable RLS untuk feedbacks
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- 8. Policy: user hanya bisa lihat feedback miliknya sendiri
DROP POLICY IF EXISTS "users_view_own_feedbacks" ON feedbacks;
CREATE POLICY "users_view_own_feedbacks" ON feedbacks
  FOR SELECT USING (auth.uid() = user_id);

-- Service role (admin) bypass RLS secara otomatis

-- 9. Buat tabel tasks (tugas mingguan per produk)
CREATE TABLE IF NOT EXISTS tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  week_number integer NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  product text NOT NULL DEFAULT 'fastrack',
  order_index integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_view_tasks" ON tasks;
CREATE POLICY "users_view_tasks" ON tasks
  FOR SELECT USING (true);

-- 10. Buat tabel task_submissions (pengumpulan tugas oleh klien)
CREATE TABLE IF NOT EXISTS task_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  url text NOT NULL,
  notes text DEFAULT '',
  status text NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewed', 'revision')),
  mentor_feedback text DEFAULT '',
  submitted_at timestamptz DEFAULT now() NOT NULL,
  reviewed_at timestamptz,
  UNIQUE (task_id, user_id)
);

ALTER TABLE task_submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_manage_own_submissions" ON task_submissions;
CREATE POLICY "users_manage_own_submissions" ON task_submissions
  FOR ALL USING (auth.uid() = user_id);

-- 11. Tambah mentor_id ke profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS mentor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS profiles_mentor_id_idx ON profiles(mentor_id);

-- 12. Tambah start_date ke profiles (tanggal mulai program, untuk hitung deadline mingguan)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS start_date date;

-- 13. Tabel week_configs (judul/subtitle per minggu per produk)
CREATE TABLE IF NOT EXISTS week_configs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  week_number integer NOT NULL,
  title text NOT NULL DEFAULT '',
  product text NOT NULL DEFAULT 'fastrack',
  UNIQUE (week_number, product)
);

ALTER TABLE week_configs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_view_week_configs" ON week_configs;
CREATE POLICY "users_view_week_configs" ON week_configs FOR SELECT USING (true);

-- 14. Tabel registrations (pendaftaran via payment gateway Duitku)
CREATE TABLE IF NOT EXISTS registrations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  batch text NOT NULL,
  amount integer NOT NULL DEFAULT 500000,
  merchant_order_id text NOT NULL UNIQUE,
  duitku_reference text,
  payment_url text,
  payment_method text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'active', 'expired')),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  paid_at timestamptz
);

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
