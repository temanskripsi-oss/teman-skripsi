import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getNextBatch } from '@/lib/mayar'

const PRICES: Record<string, number> = {
  fastrack:               Number(process.env.FASTRACK_PRICE   ?? 500_000),
  'mentoring-sempro':     Number(process.env.SEMPRO_PRICE     ?? 2_000_000),
  'mentoring-penelitian': Number(process.env.PENELITIAN_PRICE ?? 2_250_000),
}

const ORDER_PREFIX: Record<string, string> = {
  fastrack:               'FT',
  'mentoring-sempro':     'SP',
  'mentoring-penelitian': 'PN',
}

export async function POST(req: NextRequest) {
  try {
    const { full_name, email, phone, product = 'fastrack' } = await req.json()

    if (!full_name || !email || !phone) {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 })
    }

    if (!PRICES[product]) {
      return NextResponse.json({ error: 'Produk tidak valid' }, { status: 400 })
    }

    const { value: batch } = getNextBatch()
    const prefix = ORDER_PREFIX[product]
    const merchantOrderId = product === 'fastrack'
      ? `${prefix}-${batch}-${Date.now()}`
      : `${prefix}-${Date.now()}`

    const supabase = createServiceClient()
    const amount = PRICES[product]

    if (product === 'fastrack') {
      const { data: existing } = await supabase
        .from('registrations')
        .select('id, status')
        .eq('email', email)
        .eq('batch', batch)
        .neq('status', 'expired')
        .maybeSingle()

      if (existing) {
        return NextResponse.json({ error: 'Email ini sudah terdaftar untuk batch ini.' }, { status: 409 })
      }
    }

    await supabase.from('registrations').insert({
      full_name,
      email,
      phone,
      batch: product === 'fastrack' ? batch : null,
      product,
      amount,
      merchant_order_id: merchantOrderId,
      status: 'pending',
    })

    return NextResponse.json({ orderId: merchantOrderId, amount })
  } catch (err) {
    console.error('[register]', err)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
