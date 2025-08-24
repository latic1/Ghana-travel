import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const attractions = await prisma.attraction.findMany({
      include: {
        reviews: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(attractions)
  } catch (error) {
    console.error('Error fetching attractions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attractions' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const attraction = await prisma.attraction.create({
      data: {
        name: body.name,
        description: body.description,
        location: body.location,
        category: body.category,
        imageUrl: body.imageUrl,
        rating: body.rating || 0,
        price: body.price,
        duration: body.duration,
        maxVisitors: body.maxVisitors,
        availableSlots: body.availableSlots,
      },
    })

    return NextResponse.json(attraction, { status: 201 })
  } catch (error) {
    console.error('Error creating attraction:', error)
    return NextResponse.json(
      { error: 'Failed to create attraction' },
      { status: 500 }
    )
  }
}
