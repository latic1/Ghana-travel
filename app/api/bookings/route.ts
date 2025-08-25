import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET() {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        hotel: {
          select: {
            id: true,
            name: true,
            location: true,
          }
        },
        attraction: {
          select: {
            id: true,
            name: true,
            location: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
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
    
    if (body.type === 'HOTEL') {
      // Validate required fields
      if (!body.hotelId || !body.checkInDate || !body.checkOutDate || !body.numberOfGuests || !body.numberOfRooms || !body.totalPrice) {
        return NextResponse.json(
          { error: 'Missing required fields for hotel booking' },
          { status: 400 }
        )
      }

      // Validate and parse dates
      const checkIn = new Date(body.checkInDate)
      const checkOut = new Date(body.checkOutDate)
      
      if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
        return NextResponse.json(
          { error: 'Invalid date format for check-in or check-out' },
          { status: 400 }
        )
      }

      if (checkIn >= checkOut) {
        return NextResponse.json(
          { error: 'Check-out date must be after check-in date' },
          { status: 400 }
        )
      }

      // Create hotel booking
      const booking = await prisma.booking.create({
        data: {
          userId: session.user.id,
          type: 'HOTEL',
          hotelId: body.hotelId,
          checkIn: checkIn,
          checkOut: checkOut,
          guests: parseInt(body.numberOfGuests),
          rooms: parseInt(body.numberOfRooms),
          totalPrice: parseFloat(body.totalPrice),
          status: 'PENDING',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          },
          hotel: {
            select: {
              id: true,
              name: true,
              location: true,
            }
          }
        }
      })

      return NextResponse.json(booking, { status: 201 })
    } else if (body.type === 'ATTRACTION') {
      // Validate required fields
      if (!body.attractionId || !body.date || !body.numberOfPeople || !body.totalPrice) {
        return NextResponse.json(
          { error: 'Missing required fields for attraction booking' },
          { status: 400 }
        )
      }

      // Validate and parse date
      const visitDate = new Date(body.date)
      
      if (isNaN(visitDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid date format for visit date' },
          { status: 400 }
        )
      }

      // Create attraction booking
      const booking = await prisma.booking.create({
        data: {
          userId: session.user.id,
          type: 'ATTRACTION',
          attractionId: body.attractionId,
          visitDate: visitDate,
          numberOfPeople: parseInt(body.numberOfPeople),
          totalPrice: parseFloat(body.totalPrice),
          status: 'PENDING',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          },
          attraction: {
            select: {
              id: true,
              name: true,
              location: true,
            }
          }
        }
      })

      return NextResponse.json(booking, { status: 201 })
    } else {
      return NextResponse.json(
        { error: 'Invalid booking type. Must be either HOTEL or ATTRACTION' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
