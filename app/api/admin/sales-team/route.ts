import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import bcrypt from 'bcryptjs'

const PRODUCT_CONFIG = {
  fastrack: { prefix: 'FT', suffix: '50', amount: 50_000 },
  mentoring: { prefix: 'MP', suffix: '100', amount: 100_000 },
} as const

function autoCode(name: string, product: keyof typeof PRODUCT_CONFIG) {
  const first = name.trim().split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '')
  const { prefix, suffix } = PRODUCT_CONFIG[product]
  return first ? `${prefix}${first}${suffix}` : ''
}

export async function GET() {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('affiliate_codes')
    .select('*')
    .order('total_sales', { ascending: false })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  const { sales_name, sales_email, sales_password, sales_whatsapp } = await req.json()
  if (!sales_name || !sales_email || !sales_password) {
    return NextResponse.json({ error: 'Nama, email, dan password wajib diisi' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const hashed = await bcrypt.hash(sales_password, 10)

  const rows = (['fastrack', 'mentoring'] as const).map(product => ({
    sales_name,
    code: autoCode(sales_name, product),
    product,
    sales_email,
    sales_password: hashed,
    sales_whatsapp: sales_whatsapp || null,
    discount_amount: PRODUCT_CONFIG[product].amount,
    commission_per_sale: PRODUCT_CONFIG[product].amount,
  }))

  const { error } = await supabase.from('affiliate_codes').insert(rows)

  if (error) {
    const msg = error.message.includes('unique') ? 'Kode atau email sudah digunakan, coba nama lain.' : error.message
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}

export async function PATCH(req: NextRequest) {
  const { id, original_email, sales_name, sales_email, sales_whatsapp, sales_password, is_active } = await req.json()

  const supabase = createServiceClient()

  // Toggle status satu kode saja (dari tombol aktif/nonaktif per baris)
  if (id && !original_email) {
    const { error } = await supabase.from('affiliate_codes').update({ is_active }).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  }

  // Edit profil sales — berlaku untuk kedua kode (fastrack + mentoring) sekaligus
  if (!original_email) return NextResponse.json({ error: 'original_email required' }, { status: 400 })

  const updates: Record<string, unknown> = { sales_name, sales_email, sales_whatsapp, is_active }
  if (sales_password) updates.sales_password = await bcrypt.hash(sales_password, 10)

  const { error } = await supabase.from('affiliate_codes').update(updates).eq('sales_email', original_email)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const { sales_email } = await req.json()
  if (!sales_email) return NextResponse.json({ error: 'sales_email required' }, { status: 400 })
  const supabase = createServiceClient()
  await supabase.from('affiliate_codes').delete().eq('sales_email', sales_email)
  return NextResponse.json({ ok: true })
}
