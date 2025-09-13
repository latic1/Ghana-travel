import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const attractions = await prisma.attraction.findMany({
      include: {
        category: true,
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
    
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'location', 'categoryId', 'duration', 'price', 'maxVisitors', 'availableSlots']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate numeric fields
    if (typeof body.price !== 'number' || body.price <= 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      )
    }

    if (typeof body.maxVisitors !== 'number' || body.maxVisitors <= 0) {
      return NextResponse.json(
        { error: 'Max visitors must be a positive number' },
        { status: 400 }
      )
    }

    if (typeof body.availableSlots !== 'number' || body.availableSlots <= 0) {
      return NextResponse.json(
        { error: 'Available slots must be a positive number' },
        { status: 400 }
      )
    }

    if (body.availableSlots > body.maxVisitors) {
      return NextResponse.json(
        { error: 'Available slots cannot exceed max visitors' },
        { status: 400 }
      )
    }

    // Validate rating range
    if (body.rating && (body.rating < 0 || body.rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 0 and 5' },
        { status: 400 }
      )
    }

    // Validate category exists
    const categoryExists = await prisma.attractionCategory.findUnique({
      where: { id: body.categoryId }
    })
    
    if (!categoryExists) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    const attraction = await prisma.attraction.create({
      data: {
        name: body.name.trim(),
        description: body.description.trim(),
        location: body.location.trim(),
        categoryId: body.categoryId,
        images: body.images || '[]',
        rating: body.rating || 0,
        price: body.price,
        duration: body.duration.trim(),
        maxVisitors: body.maxVisitors,
        availableSlots: body.availableSlots,
      },
    })

    return NextResponse.json(attraction, { status: 201 })
  } catch (error) {
    console.error('Error creating attraction:', error)
    
    // Handle Prisma-specific errors
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'An attraction with this name already exists' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create attraction. Please try again.' },
      { status: 500 }
    )
  }
}
