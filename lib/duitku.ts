import crypto from 'crypto'

const MERCHANT_CODE = process.env.DUITKU_MERCHANT_CODE!
const API_KEY       = process.env.DUITKU_API_KEY!
const IS_SANDBOX    = process.env.DUITKU_IS_SANDBOX !== 'false'
const BASE_URL      = IS_SANDBOX
  ? 'https://sandbox.duitku.com/webapi/api/merchant'
  : 'https://passport.duitku.com/webapi/api/merchant'

export const PAYMENT_METHODS = [
  { code: 'QRIS', label: 'QRIS',            desc: 'Semua e-wallet & m-banking' },
  { code: 'BC',   label: 'Transfer BCA',    desc: 'Virtual Account BCA' },
  { code: 'M2',   label: 'Transfer Mandiri',desc: 'Virtual Account Mandiri' },
  { code: 'I1',   label: 'Transfer BNI',    desc: 'Virtual Account BNI' },
  { code: 'BV',   label: 'Transfer BRI',    desc: 'Virtual Account BRI' },
]

function md5(str: string) {
  return crypto.createHash('md5').update(str).digest('hex')
}

export function createSignature(amount: number, merchantOrderId: string) {
  return md5(`${MERCHANT_CODE}${amount}${merchantOrderId}${API_KEY}`)
}

export function verifyCallbackSignature(amount: string, merchantOrderId: string, signature: string) {
  const expected = md5(`${MERCHANT_CODE}${amount}${merchantOrderId}${API_KEY}`)
  return expected === signature
}

export interface CreateInvoiceParams {
  merchantOrderId: string
  amount: number
  productDetails: string
  email: string
  phoneNumber: string
  customerName: string
  paymentMethod: string
  callbackUrl: string
  returnUrl: string
}

export async function createInvoice(params: CreateInvoiceParams) {
  const signature = createSignature(params.amount, params.merchantOrderId)

  const res = await fetch(`${BASE_URL}/createInvoice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      merchantCode:    MERCHANT_CODE,
      paymentAmount:   params.amount,
      paymentMethod:   params.paymentMethod,
      merchantOrderId: params.merchantOrderId,
      productDetails:  params.productDetails,
      email:           params.email,
      phoneNumber:     params.phoneNumber,
      customerVaName:  params.customerName,
      callbackUrl:     params.callbackUrl,
      returnUrl:       params.returnUrl,
      signature,
      expiryPeriod:    1440,
    }),
  })

  return res.json() as Promise<{
    merchantCode: string
    reference: string
    paymentUrl: string
    statusCode: string
    statusMessage: string
  }>
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
