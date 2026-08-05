import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'

const PRODUCT_CONFIG = {
  fastrack: { suffix: '50', amount: 50_000 },
  mentoring: { suffix: '100', amount: 100_000 },
} as const

function tierPrefix(followers: number) {
  if (followers >= 10_000) return 'KOL'
  if (followers >= 5_000) return 'MC'
  return ''
}

function sanitizeUsername(username: string) {
  return username.toUpperCase().replace(/[^A-Z0-9]/g, '')
}

const FOLLOWUP_DAYS = 3

function followupDate(days = FOLLOWUP_DAYS) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

// dm_status yang masih butuh dikejar → dijadwalin follow-up otomatis.
// closing & ghosting nutup thread-nya, jadi jadwalnya dikosongin.
const NEEDS_FOLLOWUP: Record<string, boolean> = {
  terkirim: true, balas: true, pindah_wa: true,
  belum_dm: false, closing: false, ghosting: false,
}

export async function GET() {
  const supabase = createServiceClient()
  const { data: prospects, error } = await supabase
    .from('collabs_prospects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  const codes = (prospects ?? []).flatMap(p => [p.affiliate_code_ft, p.affiliate_code_mp]).filter(Boolean) as string[]

  let salesByCode = new Map<string, number>()
  if (codes.length > 0) {
    const { data: affiliateCodes } = await supabase
      .from('affiliate_codes')
      .select('code, total_sales')
      .in('code', codes)
    salesByCode = new Map((affiliateCodes ?? []).map(a => [a.code, a.total_sales]))
  }

  const result = (prospects ?? []).map(p => ({
    ...p,
    sales_ft: p.affiliate_code_ft ? (salesByCode.get(p.affiliate_code_ft) ?? 0) : 0,
    sales_mp: p.affiliate_code_mp ? (salesByCode.get(p.affiliate_code_mp) ?? 0) : 0,
  }))

  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const { username_ig, followers_count, kampus, notes } = await req.json()
  if (!username_ig || followers_count === undefined || followers_count === null) {
    return NextResponse.json({ error: 'Username IG dan followers count wajib diisi' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { error } = await supabase.from('collabs_prospects').insert({
    username_ig: username_ig.trim().replace(/^@/, ''),
    followers_count,
    kampus: kampus || null,
    notes: notes || null,
  })

  if (error) {
    const msg = error.message.includes('unique') ? 'Username IG ini sudah ada di daftar prospect.' : error.message
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { id, status, dm_status, format_collab, code_base, username_ig, followers_count, kampus, notes, next_followup_at } = body
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const supabase = createServiceClient()

  // Edit form fields / dm_status, no main status change
  if (!status) {
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (username_ig !== undefined) updates.username_ig = username_ig.trim().replace(/^@/, '')
    if (followers_count !== undefined) updates.followers_count = followers_count
    if (kampus !== undefined) updates.kampus = kampus || null
    if (notes !== undefined) updates.notes = notes || null
    if (next_followup_at !== undefined) updates.next_followup_at = next_followup_at || null

    if (dm_status !== undefined) {
      updates.dm_status = dm_status
      updates.last_contact_at = new Date().toISOString()
      // Jadwal follow-up auto-geser tiap ada progres chat, kecuali di-override manual
      if (next_followup_at === undefined) {
        updates.next_followup_at = NEEDS_FOLLOWUP[dm_status] ? followupDate() : null
      }
      // dm_sent_at nyetir counter harian, jadi diisi begitu DM-nya kekirim.
      // Status utama ikut naik dari target biar angka kartu funnel nyambung sama counter.
      if (dm_status !== 'belum_dm') {
        const { data: current } = await supabase
          .from('collabs_prospects').select('dm_sent_at, status').eq('id', id).single()
        if (!current?.dm_sent_at) updates.dm_sent_at = new Date().toISOString()
        if (current?.status === 'target') updates.status = 'dm_sent'
      }
    }

    const { error } = await supabase.from('collabs_prospects').update(updates).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  }

  if (status === 'deal') {
    if (!format_collab) return NextResponse.json({ error: 'Format collabs wajib dipilih' }, { status: 400 })

    const { data: prospect } = await supabase.from('collabs_prospects').select('*').eq('id', id).single()
    if (!prospect) return NextResponse.json({ error: 'Prospect tidak ditemukan' }, { status: 404 })

    const prefix = tierPrefix(prospect.followers_count)
    // Admin boleh mempersingkat basis kode lewat modal (nama lengkap sering kepanjangan
    // buat dipakai sebagai kode diskon). Kalau kosong, balik ke username-nya.
    const sanitized = sanitizeUsername(code_base || prospect.username_ig)
    if (!sanitized) return NextResponse.json({ error: 'Kode diskon nggak boleh kosong' }, { status: 400 })
    if (sanitized.length > 20) return NextResponse.json({ error: 'Kode diskon maksimal 20 karakter' }, { status: 400 })
    const randomPass = await bcrypt.hash(randomBytes(16).toString('hex'), 10)

    const rows = (['fastrack', 'mentoring'] as const).map(product => ({
      sales_name: prospect.username_ig,
      code: `${prefix}${sanitized}${PRODUCT_CONFIG[product].suffix}`,
      product,
      sales_email: `${sanitized.toLowerCase()}.${product}@collabs.temanskripsi.local`,
      sales_password: randomPass,
      discount_amount: PRODUCT_CONFIG[product].amount,
      commission_per_sale: PRODUCT_CONFIG[product].amount,
      source: 'collabs_hunter',
    }))

    const { data: inserted, error: affError } = await supabase.from('affiliate_codes').insert(rows).select()
    if (affError) {
      const msg = affError.message.includes('unique') ? 'Kode diskon untuk username ini sudah pernah dibuat.' : affError.message
      return NextResponse.json({ error: msg }, { status: 400 })
    }

    const codeFt = inserted?.find(r => r.product === 'fastrack')?.code ?? null
    const codeMp = inserted?.find(r => r.product === 'mentoring')?.code ?? null

    const { error: updError } = await supabase.from('collabs_prospects').update({
      status: 'deal',
      format_collab,
      affiliate_code_ft: codeFt,
      affiliate_code_mp: codeMp,
      deal_at: new Date().toISOString(),
      last_contact_at: new Date().toISOString(),
      next_followup_at: null,
      updated_at: new Date().toISOString(),
    }).eq('id', id)

    if (updError) return NextResponse.json({ error: updError.message }, { status: 400 })

    return NextResponse.json({ ok: true, code_ft: codeFt, code_mp: codeMp })
  }

  const timestampField = status === 'dm_sent' ? 'dm_sent_at' : status === 'live' ? 'live_at' : null
  const updates: Record<string, unknown> = { status, updated_at: new Date().toISOString() }
  if (timestampField) updates[timestampField] = new Date().toISOString()

  if (status === 'dm_sent') {
    updates.last_contact_at = new Date().toISOString()
    updates.next_followup_at = followupDate()
  } else if (status === 'live' || status === 'rejected') {
    updates.next_followup_at = null
  }

  const { error } = await supabase.from('collabs_prospects').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const supabase = createServiceClient()
  const { error } = await supabase.from('collabs_prospects').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
