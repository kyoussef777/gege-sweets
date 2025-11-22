import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET() {
  try {
    const items = await prisma.menuItem.findMany({
      include: { category: true },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, imageUrl, categoryId } = body

    const newItem = await prisma.menuItem.create({
      data: {
        name,
        description: description || null,
        imageUrl: imageUrl || null,
        categoryId,
        order: 0,
      },
      include: { category: true },
    })

    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    console.error('Create menu item error:', error)
    return NextResponse.json({ error: 'Failed to create item' }, { status: 400 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, description, imageUrl } = body

    const updated = await prisma.menuItem.update({
      where: { id },
      data: {
        name,
        description: description || null,
        imageUrl: imageUrl || null,
      },
      include: { category: true },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Update menu item error:', error)
    return NextResponse.json({ error: 'Failed to update item' }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    await prisma.menuItem.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete menu item error:', error)
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 400 })
  }
}
