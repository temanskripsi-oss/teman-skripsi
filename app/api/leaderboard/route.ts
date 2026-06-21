import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.AFFILIATE_JWT_SECRET ?? 'teman-skripsi-affiliate-secret-2026')

export async function GET(req: NextRequest) {
  // Verify token
  const token = req.cookies.get('affiliate_token')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { payload } = await jwtVerify(token, SECRET)
    const supabase = createServiceClient()

    const { data } = await supabase
      .from('affiliate_codes')
      .select('code, sales_name, total_sales, total_commission')
      .eq('is_active', true)
      .order('total_sales', { ascending: false })

    // Komisi pending milik user yang login
    const { data: myTransactions } = await supabase
      .from('affiliate_transactions')
      .select('commission_amount, status')
      .eq('affiliate_code', payload.code as string)

    const pendingCommission = (myTransactions ?? [])
      .filter(t => t.status === 'pending')
      .reduce((s, t) => s + t.commission_amount, 0)

    return NextResponse.json({
      leaderboard: data ?? [],
      myCode: payload.code,
      myName: payload.name,
      pendingCommission,
    })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
