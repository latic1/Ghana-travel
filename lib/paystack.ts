// Paystack configuration and utilities
export const PAYSTACK_CONFIG = {
  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
  secretKey: process.env.PAYSTACK_SECRET_KEY || '',
  baseUrl: 'https://api.paystack.co',
}

export interface PaystackTransaction {
  reference: string
  amount: number // Amount in kobo (smallest currency unit)
  email: string
  callback_url: string
  metadata: {
    booking_type: 'HOTEL' | 'ATTRACTION'
    hotel_id?: string
    attraction_id?: string
    check_in?: string
    check_out?: string
    visit_date?: string
    number_of_guests?: number
    number_of_rooms?: number
    number_of_people?: number
    customer_name: string
    customer_phone: string
  }
}

export interface PaystackVerifyResponse {
  status: boolean
  message: string
  data: {
    reference: string
    amount: number
    status: string
    gateway_response: string
    paid_at: string
    channel: string
    currency: string
    customer: {
      email: string
      customer_code: string
      first_name: string
      last_name: string
    }
    metadata: any
  }
}

// Initialize Paystack transaction
export async function initializePaystackTransaction(transaction: PaystackTransaction) {
  try {
    const response = await fetch(`${PAYSTACK_CONFIG.baseUrl}/transaction/initialize`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_CONFIG.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    })

    const data = await response.json()
    
    if (!data.status) {
      throw new Error(data.message || 'Failed to initialize transaction')
    }

    return data.data
  } catch (error) {
    console.error('Paystack initialization error:', error)
    throw error
  }
}

// Verify Paystack transaction
export async function verifyPaystackTransaction(reference: string): Promise<PaystackVerifyResponse> {
  try {
    const response = await fetch(`${PAYSTACK_CONFIG.baseUrl}/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_CONFIG.secretKey}`,
      },
    })

    const data = await response.json()
    
    if (!data.status) {
      throw new Error(data.message || 'Failed to verify transaction')
    }

    return data
  } catch (error) {
    console.error('Paystack verification error:', error)
    throw error
  }
}

// Convert amount to kobo (Paystack expects amount in smallest currency unit)
export function convertToKobo(amount: number): number {
  return Math.round(amount * 100)
}

// Convert amount from kobo to naira
export function convertFromKobo(amount: number): number {
  return amount / 100
}
