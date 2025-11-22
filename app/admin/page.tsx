import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import SimpleCMS from '@/components/admin/SimpleCMS'

export default async function AdminPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/admin/login')
  }

  // Fetch all data server-side
  const [categories, menuItems, settings, features] = await Promise.all([
    prisma.category.findMany({
      orderBy: { order: 'asc' },
    }),
    prisma.menuItem.findMany({
      include: {
        category: true,
      },
      orderBy: { order: 'asc' },
    }),
    prisma.siteSettings.findUnique({
      where: { id: 'default' },
    }),
    prisma.homeFeature.findMany({
      orderBy: { order: 'asc' },
    }),
  ])

  return (
    <SimpleCMS
      initialCategories={categories}
      initialMenuItems={menuItems}
      initialSettings={settings || {
        id: 'default',
        phone: '',
        email: '',
        address: '',
        hours: '',
        instagram: '',
        facebook: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      }}
      initialFeatures={features}
      user={session.user}
    />
  )
}
