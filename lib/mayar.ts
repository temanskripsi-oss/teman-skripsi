const API_KEY  = process.env.MAYAR_API_KEY!
const IS_SANDBOX = process.env.MAYAR_IS_SANDBOX !== 'false'
const BASE_URL = IS_SANDBOX
  ? 'https://api.mayar.club/hl/v1'
  : 'https://api.mayar.id/hl/v1'

export interface CreateInvoiceParams {
  merchantOrderId: string
  amount: number
  productDetails: string
  email: string
  phoneNumber: string
  customerName: string
  returnUrl: string
}

export interface MayarInvoiceResponse {
  statusCode: number
  messages: string
  data: {
    id: string
    transactionId: string
    link: string
    expiredAt: number
    extraData: { noCustomer: string; idProd: string }
  }
}

export async function createInvoice(params: CreateInvoiceParams): Promise<MayarInvoiceResponse> {
  const expiredAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

  const res = await fetch(`${BASE_URL}/invoice/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      name:        params.customerName,
      email:       params.email,
      mobile:      params.phoneNumber,
      redirectUrl: params.returnUrl,
      description: params.productDetails,
      expiredAt,
      items: [{
        quantity:    1,
        rate:        params.amount,
        description: params.productDetails,
      }],
      extraData: {
        noCustomer: params.merchantOrderId,
        idProd:     params.merchantOrderId,
      },
    }),
  })

  return res.json()
}

export function getBatchLabel(batchValue: string) {
  const [year, month] = batchValue.split('-').map(Number)
  return new Date(year, month - 1, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
}

export function getNextBatch() {
  const now  = new Date()
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const value = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`
  const label = next.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  return { value, label }
}
