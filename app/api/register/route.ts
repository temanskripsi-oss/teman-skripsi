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
    const { full_name, email, phone, product = 'fastrack', affiliate_code, discount_amount = 0 } = await req.json()

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
    const finalPrice = amount - discount_amount

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

    // Validasi ulang affiliate code jika ada
    let validatedCode: string | null = null
    let commissionAmount = 0
    if (affiliate_code) {
      const { data: codeData } = await supabase
        .from('affiliate_codes')
        .select('code, commission_per_sale, discount_amount')
        .eq('code', affiliate_code.toUpperCase().trim())
        .eq('is_active', true)
        .single()

      if (codeData) {
        validatedCode = codeData.code
        commissionAmount = codeData.commission_per_sale
      }
    }

    const { data: newReg } = await supabase.from('registrations').insert({
      full_name,
      email,
      phone,
      batch: product === 'fastrack' ? batch : null,
      product,
      amount,
      merchant_order_id: merchantOrderId,
      status: 'pending',
      affiliate_code: validatedCode,
      discount_amount: validatedCode ? discount_amount : 0,
      final_price: validatedCode ? finalPrice : amount,
    }).select('id').single()

    // Track affiliate transaction
    if (validatedCode && newReg) {
      await supabase.rpc('increment_affiliate_stats', {
        p_code: validatedCode,
        p_commission: commissionAmount,
      })

      await supabase.from('affiliate_transactions').insert({
        affiliate_code: validatedCode,
        registration_id: newReg.id,
        buyer_name: full_name,
        commission_amount: commissionAmount,
        status: 'pending',
      })
    }

    return NextResponse.json({ orderId: merchantOrderId, amount: validatedCode ? finalPrice : amount })
  } catch (err) {
    console.error('[register]', err)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
