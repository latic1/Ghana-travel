import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const attraction = await prisma.attraction.findUnique({
      where: { id },
      include: {
        category: true,
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

    if (!attraction) {
      return NextResponse.json(
        { error: 'Attraction not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(attraction)
  } catch (error) {
    console.error('Error fetching attraction:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attraction' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const attraction = await prisma.attraction.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        location: body.location,
        categoryId: body.categoryId,
        images: body.images,
        rating: body.rating,
        price: body.price,
        duration: body.duration,
        maxVisitors: body.maxVisitors,
        availableSlots: body.availableSlots,
      },
    })

    return NextResponse.json(attraction)
  } catch (error) {
    console.error('Error updating attraction:', error)
    return NextResponse.json(
      { error: 'Failed to update attraction' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.attraction.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Attraction deleted successfully' })
  } catch (error) {
    console.error('Error deleting attraction:', error)
    return NextResponse.json(
      { error: 'Failed to delete attraction' },
      { status: 500 }
    )
  }
}
