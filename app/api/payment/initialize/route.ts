import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { initializePaystackTransaction, convertToKobo, PaystackTransaction } from '@/lib/paystack'

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      type,
      hotelId,
      attractionId,
      checkIn,
      checkOut,
      visitDate,
      numberOfGuests,
      numberOfRooms,
      numberOfPeople,
      totalPrice,
      customerName,
      customerPhone,
      customerEmail
    } = body

    // Validate required fields
    if (!type || !totalPrice || !customerEmail || !customerName || !customerPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate unique reference
    const reference = `TRAVEL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Prepare Paystack transaction
    const transaction: PaystackTransaction = {
      reference,
      amount: convertToKobo(totalPrice),
      email: customerEmail,
      callback_url: `${process.env.NEXTAUTH_URL}/payment/verify?reference=${reference}`,
      metadata: {
        booking_type: type,
        hotel_id: hotelId,
        attraction_id: attractionId,
        check_in: checkIn,
        check_out: checkOut,
        visit_date: visitDate,
        number_of_guests: numberOfGuests,
        number_of_rooms: numberOfRooms,
        number_of_people: numberOfPeople,
        customer_name: customerName,
        customer_phone: customerPhone,
      }
    }

    // Initialize Paystack transaction
    const paystackResponse = await initializePaystackTransaction(transaction)

    return NextResponse.json({
      success: true,
      data: {
        authorization_url: paystackResponse.authorization_url,
        reference: paystackResponse.reference,
        access_code: paystackResponse.access_code,
      }
    })

  } catch (error) {
    console.error('Payment initialization error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize payment' },
      { status: 500 }
    )
  }
}
