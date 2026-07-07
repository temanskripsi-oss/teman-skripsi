import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'

const SECRET = new TextEncoder().encode(process.env.AFFILIATE_JWT_SECRET ?? 'teman-skripsi-affiliate-secret-2026')

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const { data: rows } = await supabase
      .from('affiliate_codes')
      .select('id, code, sales_name, sales_email, sales_password, is_active')
      .eq('sales_email', email.toLowerCase().trim())
      .order('created_at', { ascending: true })

    const sales = rows?.[0]
    if (!sales) return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 })
    if (!sales.is_active) return NextResponse.json({ error: 'Akun kamu tidak aktif. Hubungi admin.' }, { status: 403 })

    const valid = await bcrypt.compare(password, sales.sales_password)
    if (!valid) return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 })

    const token = await new SignJWT({ email: sales.sales_email, name: sales.sales_name })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(SECRET)

    const res = NextResponse.json({ ok: true, name: sales.sales_name, email: sales.sales_email })
    res.cookies.set('affiliate_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return res
  } catch {
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete('affiliate_token')
  return res
}
