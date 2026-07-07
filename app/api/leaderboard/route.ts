import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.AFFILIATE_JWT_SECRET ?? 'teman-skripsi-affiliate-secret-2026')

export async function GET(req: NextRequest) {
  const token = req.cookies.get('affiliate_token')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { payload } = await jwtVerify(token, SECRET)
    const myEmail = payload.email as string
    const supabase = createServiceClient()

    const { data } = await supabase
      .from('affiliate_codes')
      .select('code, sales_name, sales_email, total_sales, total_commission')
      .eq('is_active', true)

    // Gabungkan kode fastrack + mentoring milik sales yang sama jadi satu baris leaderboard
    const grouped = new Map<string, { sales_email: string; sales_name: string; codes: string[]; total_sales: number; total_commission: number }>()
    for (const row of data ?? []) {
      const existing = grouped.get(row.sales_email)
      if (existing) {
        existing.codes.push(row.code)
        existing.total_sales += row.total_sales
        existing.total_commission += row.total_commission
      } else {
        grouped.set(row.sales_email, {
          sales_email: row.sales_email,
          sales_name: row.sales_name,
          codes: [row.code],
          total_sales: row.total_sales,
          total_commission: row.total_commission,
        })
      }
    }
    const leaderboard = Array.from(grouped.values()).sort((a, b) => b.total_sales - a.total_sales)

    const { data: myTransactions } = await supabase
      .from('affiliate_transactions')
      .select('commission_amount, status, affiliate_code')

    const myCodes = leaderboard.find(e => e.sales_email === myEmail)?.codes ?? []
    const pendingCommission = (myTransactions ?? [])
      .filter(t => t.status === 'pending' && myCodes.includes(t.affiliate_code))
      .reduce((s, t) => s + t.commission_amount, 0)

    return NextResponse.json({
      leaderboard,
      myEmail,
      myName: payload.name,
      pendingCommission,
    })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
