import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const category = await prisma.attractionCategory.findUnique({
      where: { id },
      include: {
        attractions: {
          select: {
            id: true,
            name: true,
            location: true,
            rating: true,
            price: true
          }
        },
        _count: {
          select: {
            attractions: true
          }
        }
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error fetching attraction category:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attraction category' },
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
    
    // Validate required fields
    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      )
    }

    // Check if category exists
    const existingCategory = await prisma.attractionCategory.findUnique({
      where: { id }
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Check if another category with the same name exists
    const duplicateCategory = await prisma.attractionCategory.findFirst({
      where: {
        name: body.name.trim(),
        id: { not: id }
      }
    })

    if (duplicateCategory) {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 400 }
      )
    }

    const category = await prisma.attractionCategory.update({
      where: { id },
      data: {
        name: body.name.trim(),
        description: body.description?.trim() || null,
        color: body.color?.trim() || null,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error updating attraction category:', error)
    
    // Handle Prisma-specific errors
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update attraction category. Please try again.' },
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
    // Check if category exists
    const existingCategory = await prisma.attractionCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            attractions: true
          }
        }
      }
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Check if category has attractions
    if (existingCategory._count.attractions > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category that has attractions. Please move or delete the attractions first.' },
        { status: 400 }
      )
    }

    await prisma.attractionCategory.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting attraction category:', error)
    return NextResponse.json(
      { error: 'Failed to delete attraction category. Please try again.' },
      { status: 500 }
    )
  }
}
