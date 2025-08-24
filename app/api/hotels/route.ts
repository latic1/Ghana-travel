import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const hotels = await prisma.hotel.findMany({
      include: {
        destination: true,
        reviews: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(hotels)
  } catch (error) {
    console.error('Error fetching hotels:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hotels' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const hotel = await prisma.hotel.create({
      data: {
        name: body.name,
        description: body.description,
        location: body.location,
        category: body.category,
        imageUrl: body.imageUrl,
        rating: body.rating || 0,
        pricePerNight: body.pricePerNight,
        amenities: body.amenities,
        availableRooms: body.availableRooms || 0,
        destinationId: body.destinationId,
      },
    })

    return NextResponse.json(hotel, { status: 201 })
  } catch (error) {
    console.error('Error creating hotel:', error)
    return NextResponse.json(
      { error: 'Failed to create hotel' },
      { status: 500 }
    )
  }
}
