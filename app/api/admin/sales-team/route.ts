import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import bcrypt from 'bcryptjs'

export async function GET() {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('affiliate_codes')
    .select('*')
    .order('total_sales', { ascending: false })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  const { sales_name, code, sales_email, sales_password, sales_whatsapp } = await req.json()
  if (!sales_name || !code || !sales_email || !sales_password) {
    return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const hashed = await bcrypt.hash(sales_password, 10)

  const { error } = await supabase.from('affiliate_codes').insert({
    sales_name,
    code: code.toUpperCase().trim(),
    sales_email,
    sales_password: hashed,
    sales_whatsapp: sales_whatsapp || null,
  })

  if (error) {
    const msg = error.message.includes('unique') ? 'Kode sudah digunakan, pilih kode lain.' : error.message
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}

export async function PATCH(req: NextRequest) {
  const { id, sales_name, sales_email, sales_whatsapp, sales_password, is_active } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const supabase = createServiceClient()
  const updates: Record<string, unknown> = { sales_name, sales_email, sales_whatsapp, is_active }
  if (sales_password) updates.sales_password = await bcrypt.hash(sales_password, 10)

  const { error } = await supabase.from('affiliate_codes').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const supabase = createServiceClient()
  await supabase.from('affiliate_codes').delete().eq('id', id)
  return NextResponse.json({ ok: true })
}
