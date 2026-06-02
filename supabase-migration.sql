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
CREATE POLICY "users_view_own_payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

-- Service role (admin) bypass RLS secara otomatis
