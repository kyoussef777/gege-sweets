import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Menu - GeGe Sweets | Egyptian Desserts & Traditional Sweets',
  description: 'Browse our complete menu of authentic Egyptian desserts including kunafa, baklava, kahk, ghorayba, betefour, and premium chocolate treats. Order your favorites today!',
  keywords: ['dessert menu', 'Egyptian sweets menu', 'kunafa menu', 'Middle Eastern desserts', 'traditional sweets', 'order desserts online'],
  openGraph: {
    title: 'Menu - GeGe Sweets Egyptian Desserts',
    description: 'Browse our complete menu of authentic Egyptian and Middle Eastern desserts.',
    type: 'website',
  },
}

async function getMenuData() {
  const [categories, settings] = await Promise.all([
    prisma.category.findMany({
      include: {
        menuItems: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: {
        order: 'asc',
      },
    }),
    prisma.siteSettings.findUnique({
      where: { id: 'default' },
    }),
  ])
  return { categories, settings }
}

export default async function MenuPage() {
  const { categories, settings } = await getMenuData()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-egyptian-gold transition-colors mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            Our Menu
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Discover our authentic Egyptian delicacies</p>
        </div>
      </header>

      {/* Menu Content */}
      <div className="max-w-7xl mx-auto py-12 px-4">
        {categories.map((category) => (
          <section key={category.id} className="mb-16 animate-fade-in">
            {/* Category Header */}
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 pb-3 border-b-2 border-egyptian-gold inline-block">
                {category.name}
              </h2>
              {category.description && (
                <p className="text-gray-600 mt-3">{category.description}</p>
              )}
            </div>

            {/* Menu Items Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.menuItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 hover:border-egyptian-gold"
                >
                  {item.imageUrl && (
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                      <Image
                        src={item.imageUrl}
                        alt={`${item.name} - Egyptian dessert`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {item.name}
                    </h3>

                    {item.description && (
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Contact Section */}
      {settings && (settings.phone || settings.email) && (
        <section className="bg-gradient-to-br from-gray-50 to-white border-t border-gray-200 py-12 px-4 mt-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Now</h2>
              <p className="text-gray-600">Contact us to place your order</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {settings.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-3 bg-white px-6 py-4 rounded-xl border border-gray-200 hover:border-egyptian-gold hover:shadow-md transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-egyptian-gold-light flex items-center justify-center">
                    <svg className="w-5 h-5 text-egyptian-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-gray-600">Call Us</div>
                    <div className="font-bold text-gray-900">{settings.phone}</div>
                  </div>
                </a>
              )}
              {settings.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-3 bg-white px-6 py-4 rounded-xl border border-gray-200 hover:border-egyptian-gold hover:shadow-md transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-egyptian-gold-light flex items-center justify-center">
                    <svg className="w-5 h-5 text-egyptian-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-gray-600">Email Us</div>
                    <div className="font-bold text-gray-900">{settings.email}</div>
                  </div>
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-700 mb-4">
            <span className="gold-accent font-bold text-lg">GeGe Sweets</span>
            <span className="text-gray-500 mx-2">|</span>
            Where tradition meets taste
          </p>
          <div className="flex justify-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-egyptian-gold transition-colors">
              Home
            </Link>
            <Link href="/admin" className="text-gray-600 hover:text-egyptian-gold transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
