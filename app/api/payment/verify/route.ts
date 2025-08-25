import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { verifyPaystackTransaction } from '@/lib/paystack'
import { prisma } from '@/lib/db'

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
    const { reference } = body

    if (!reference) {
      return NextResponse.json(
        { error: 'Reference is required' },
        { status: 400 }
      )
    }

    // Verify Paystack transaction
    const verification = await verifyPaystackTransaction(reference)

    if (verification.data.status !== 'success') {
      return NextResponse.json(
        { error: 'Payment not successful' },
        { status: 400 }
      )
    }

    // Extract metadata from verification
    const metadata = verification.data.metadata
    const {
      booking_type,
      hotel_id,
      attraction_id,
      check_in,
      check_out,
      visit_date,
      number_of_guests,
      number_of_rooms,
      number_of_people,
      customer_name,
      customer_phone
    } = metadata

    // Create booking in database
    let booking
    if (booking_type === 'HOTEL') {
      booking = await prisma.booking.create({
        data: {
          userId: session.user.id,
          type: 'HOTEL',
          hotelId: hotel_id,
          checkIn: check_in ? new Date(check_in) : null,
          checkOut: check_out ? new Date(check_out) : null,
          guests: number_of_guests || null,
          rooms: number_of_rooms || null,
          totalPrice: verification.data.amount / 100, // Convert from kobo
          status: 'CONFIRMED',
        }
      })
    } else if (booking_type === 'ATTRACTION') {
      booking = await prisma.booking.create({
        data: {
          userId: session.user.id,
          type: 'ATTRACTION',
          attractionId: attraction_id,
          visitDate: visit_date ? new Date(visit_date) : null,
          numberOfPeople: number_of_people || null,
          totalPrice: verification.data.amount / 100, // Convert from kobo
          status: 'CONFIRMED',
        }
      })
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: verification.data.amount / 100,
        currency: verification.data.currency,
        paymentMethod: verification.data.channel,
        transactionReference: reference,
        status: 'SUCCESS',
        paidAt: new Date(verification.data.paid_at),
        metadata: {
          paystackData: verification.data,
          customerInfo: {
            name: customer_name,
            phone: customer_phone,
            email: verification.data.customer.email
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        booking,
        payment,
        verification: verification.data
      }
    })

  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
