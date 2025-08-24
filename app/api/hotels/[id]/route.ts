import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id: params.id },
      include: {
        destination: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    if (!hotel) {
      return NextResponse.json(
        { error: 'Hotel not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(hotel)
  } catch (error) {
    console.error('Error fetching hotel:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hotel' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const hotel = await prisma.hotel.update({
      where: { id: params.id },
      data: {
        name: body.name,
        description: body.description,
        location: body.location,
        category: body.category,
        imageUrl: body.imageUrl,
        rating: body.rating,
        pricePerNight: body.pricePerNight,
        amenities: body.amenities,
        availableRooms: body.availableRooms,
        destinationId: body.destinationId,
      },
    })

    return NextResponse.json(hotel)
  } catch (error) {
    console.error('Error updating hotel:', error)
    return NextResponse.json(
      { error: 'Failed to update hotel' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.hotel.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Hotel deleted successfully' })
  } catch (error) {
    console.error('Error deleting hotel:', error)
    return NextResponse.json(
      { error: 'Failed to delete hotel' },
      { status: 500 }
    )
  }
}
