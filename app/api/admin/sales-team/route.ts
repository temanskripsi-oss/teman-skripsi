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

  const codes = data ?? []

  // Kode dari Collabs Hunter dilengkapi info prospect-nya (format collabs, followers)
  // biar di halaman Sales Team kelihatan mana KOL dan dia ambil paket yang mana.
  const collabCodes = codes.filter(c => c.source === 'collabs_hunter').map(c => c.code)
  if (collabCodes.length === 0) return NextResponse.json(codes)

  const { data: prospects } = await supabase
    .from('collabs_prospects')
    .select('username_ig, followers_count, format_collab, affiliate_code_ft, affiliate_code_mp')
    .or(`affiliate_code_ft.in.(${collabCodes.join(',')}),affiliate_code_mp.in.(${collabCodes.join(',')})`)

  const byCode = new Map<string, NonNullable<typeof prospects>[number]>()
  for (const p of prospects ?? []) {
    if (p.affiliate_code_ft) byCode.set(p.affiliate_code_ft, p)
    if (p.affiliate_code_mp) byCode.set(p.affiliate_code_mp, p)
  }

  return NextResponse.json(codes.map(c => {
    const p = byCode.get(c.code)
    return p ? {
      ...c,
      collab_username: p.username_ig,
      collab_format: p.format_collab,
      collab_followers: p.followers_count,
    } : c
  }))
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
  const { error } = await supabase.from('affiliate_codes').delete().eq('sales_email', sales_email)
  if (error) {
    const msg = error.code === '23503'
      ? 'Sales ini tidak bisa dihapus karena sudah punya transaksi/pendaftaran. Nonaktifkan saja kodenya.'
      : error.message
    return NextResponse.json({ error: msg }, { status: 400 })
  }
  return NextResponse.json({ ok: true })
}
