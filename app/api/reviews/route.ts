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

    const reviews = await prisma.review.findMany({
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
        destination: {
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

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
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
    
    // Create new review
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        hotelId: body.hotelId || null,
        destinationId: body.destinationId || null,
        rating: body.rating,
        comment: body.comment || '',
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
        },
        destination: {
          select: {
            id: true,
            name: true,
            location: true,
          }
        }
      }
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}
