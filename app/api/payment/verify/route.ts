import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { verifyPaystackTransaction } from '@/lib/paystack'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    
    // If no session, we'll try to verify payment anyway and create booking
    // This handles cases where session is lost during Paystack redirect

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
      // If no session, we can't create a booking - return error
      if (!session) {
        return NextResponse.json(
          { 
            error: 'Session expired. Please sign in again to complete your booking.',
            requiresAuth: true 
          },
          { status: 401 }
        )
      }
      
      booking = await prisma.booking.create({
        data: {
          userId: session.user.id,
          type: 'HOTEL',
          hotelId: hotel_id as string,
          checkIn: check_in ? new Date(check_in as string) : null,
          checkOut: check_out ? new Date(check_out as string) : null,
          guests: number_of_guests ? Number(number_of_guests) : null,
          rooms: number_of_rooms ? Number(number_of_rooms) : null,
          totalPrice: verification.data.amount / 100, // Convert from kobo
          status: 'CONFIRMED',
        }
      })
    } else if (booking_type === 'ATTRACTION') {
      // If no session, we can't create a booking - return error
      if (!session) {
        return NextResponse.json(
          { 
            error: 'Session expired. Please sign in again to complete your booking.',
            requiresAuth: true 
          },
          { status: 401 }
        )
      }
      
      booking = await prisma.booking.create({
        data: {
          userId: session.user.id,
          type: 'ATTRACTION',
          attractionId: attraction_id as string,
          visitDate: visit_date ? new Date(visit_date as string) : null,
          numberOfPeople: number_of_people ? Number(number_of_people) : null,
          totalPrice: verification.data.amount / 100, // Convert from kobo
          status: 'CONFIRMED',
        }
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid booking type' },
        { status: 400 }
      )
    }

    if (!booking) {
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      )
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
        paidAt: new Date(verification.data.paid_at as string),
        metadata: JSON.stringify({
          paystackData: verification.data,
          customerInfo: {
            name: customer_name,
            phone: customer_phone,
            email: verification.data.customer.email
          }
        })
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
