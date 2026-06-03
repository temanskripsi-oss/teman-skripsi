import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { createInvoice, getNextBatch } from '@/lib/duitku'

const PRICES: Record<string, number> = {
  fastrack:               Number(process.env.FASTRACK_PRICE   ?? 500_000),
  'mentoring-sempro':     Number(process.env.SEMPRO_PRICE     ?? 2_000_000),
  'mentoring-penelitian': Number(process.env.PENELITIAN_PRICE ?? 2_250_000),
}

const PRODUCT_LABELS: Record<string, string> = {
  fastrack:               'Fast Track Sempro',
  'mentoring-sempro':     'Mentoring Privat Sempro',
  'mentoring-penelitian': 'Mentoring Privat Bab 4–5',
}

const ORDER_PREFIX: Record<string, string> = {
  fastrack:               'FT',
  'mentoring-sempro':     'SP',
  'mentoring-penelitian': 'PN',
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

export async function POST(req: NextRequest) {
  try {
    const { full_name, email, phone, payment_method, product = 'fastrack' } = await req.json()

    if (!full_name || !email || !phone || !payment_method) {
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

    // Untuk fastrack: cek duplikat per batch
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

    const result = await createInvoice({
      merchantOrderId,
      amount,
      productDetails: `${PRODUCT_LABELS[product]}`,
      email,
      phoneNumber: phone,
      customerName: full_name,
      paymentMethod: payment_method,
      callbackUrl: `${BASE_URL}/api/duitku/callback`,
      returnUrl: `${BASE_URL}/daftar/sukses?orderId=${merchantOrderId}`,
    })

    if (result.statusCode !== '00') {
      return NextResponse.json({ error: result.statusMessage ?? 'Gagal membuat invoice' }, { status: 500 })
    }

    await supabase.from('registrations').insert({
      full_name,
      email,
      phone,
      batch: product === 'fastrack' ? batch : null,
      product,
      amount,
      merchant_order_id: merchantOrderId,
      duitku_reference: result.reference,
      payment_url: result.paymentUrl,
      payment_method,
      status: 'pending',
    })

    return NextResponse.json({ paymentUrl: result.paymentUrl })
  } catch (err) {
    console.error('[duitku/create]', err)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
