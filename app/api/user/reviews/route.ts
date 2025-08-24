import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function GET() {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const reviews = await prisma.review.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        hotel: {
          select: {
            id: true,
            name: true,
            location: true,
            imageUrl: true,
          }
        },
        attraction: {
          select: {
            id: true,
            name: true,
            location: true,
            imageUrl: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching user reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}
