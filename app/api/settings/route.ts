import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'default' },
    })
    return NextResponse.json(settings || {})
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { phone, email, address, hours, instagram, facebook } = body

    const updated = await prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: {
        phone,
        email,
        address,
        hours,
        instagram,
        facebook,
      },
      create: {
        id: 'default',
        phone,
        email,
        address,
        hours,
        instagram,
        facebook,
      },
    })

    // Revalidate the home page to show updated contact info
    revalidatePath('/')
    revalidatePath('/menu')

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 400 })
  }
}
