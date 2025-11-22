import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET() {
  try {
    const features = await prisma.homeFeature.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(features)
  } catch (error) {
    console.error('Fetch features error:', error)
    return NextResponse.json({ error: 'Failed to fetch features' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, imageUrl, order } = body

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
    }

    const feature = await prisma.homeFeature.create({
      data: {
        title,
        description,
        imageUrl: imageUrl || null,
        order: order || 0,
      },
    })

    return NextResponse.json(feature)
  } catch (error) {
    console.error('Create feature error:', error)
    return NextResponse.json({ error: 'Failed to create feature' }, { status: 400 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, title, description, imageUrl, order } = body

    if (!id) {
      return NextResponse.json({ error: 'Feature ID is required' }, { status: 400 })
    }

    const updated = await prisma.homeFeature.update({
      where: { id },
      data: {
        title,
        description,
        imageUrl,
        order,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Update feature error:', error)
    return NextResponse.json({ error: 'Failed to update feature' }, { status: 400 })
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
      return NextResponse.json({ error: 'Feature ID is required' }, { status: 400 })
    }

    await prisma.homeFeature.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete feature error:', error)
    return NextResponse.json({ error: 'Failed to delete feature' }, { status: 400 })
  }
}
