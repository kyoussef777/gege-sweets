import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import AnimatedTitle from '@/components/AnimatedTitle'

export const metadata: Metadata = {
  title: 'GeGe Sweets - Authentic Egyptian Desserts | Traditional Middle Eastern Sweets',
  description: 'Experience authentic Egyptian desserts handcrafted with love. From signature kunafa to traditional cookies and premium chocolate treats. Order your favorite Middle Eastern sweets today.',
  keywords: ['Egyptian desserts', 'Middle Eastern sweets', 'kunafa', 'Egyptian cookies', 'kahk', 'ghorayba', 'baklava', 'authentic desserts', 'halal desserts', 'traditional sweets'],
  openGraph: {
    title: 'GeGe Sweets - Authentic Egyptian Desserts',
    description: 'Handcrafted Egyptian desserts made with the finest ingredients. Order traditional Middle Eastern sweets today.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GeGe Sweets - Authentic Egyptian Desserts',
    description: 'Handcrafted Egyptian desserts made with the finest ingredients.',
  },
}

async function getData() {
  const [settings, features] = await Promise.all([
    prisma.siteSettings.findUnique({
      where: { id: 'default' },
    }),
    prisma.homeFeature.findMany({
      orderBy: { order: 'asc' },
    }),
  ])
  return { settings, features }
}

export default async function Home() {
  const { settings, features } = await getData()

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'GeGe Sweets',
    description: 'Authentic Egyptian desserts handcrafted with love',
    servesCuisine: 'Egyptian, Middle Eastern Desserts',
    ...(settings?.phone && { telephone: settings.phone }),
    ...(settings?.email && { email: settings.email }),
    ...(settings?.address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: settings.address,
      }
    }),
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-gray-50 to-white" aria-label="Hero section">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-28">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo/Title */}
            <div className="mb-8">
              <AnimatedTitle />
              <div className="flex items-center justify-center gap-3 mb-6" role="presentation" aria-hidden="true">
                <div className="h-px w-12 bg-egyptian-gold"></div>
                <p className="text-xl md:text-2xl gold-accent font-semibold">
                  Authentic Egyptian Delicacies
                </p>
                <div className="h-px w-12 bg-egyptian-gold"></div>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Experience the rich traditions of Egyptian desserts, handcrafted with love and the finest ingredients.
              From signature kunafa to authentic cookies and decadent chocolate treats, every bite tells a story.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-base px-8" aria-label="View our menu of Egyptian desserts">
                <Link href="/menu">View Our Menu</Link>
              </Button>
              {settings?.phone && (
                <Button asChild variant="outline" size="lg" className="text-base px-8" aria-label="Call us to order">
                  <a href={`tel:${settings.phone}`}>📞 Order Now</a>
                </Button>
              )}
              <Button asChild variant="outline" size="lg" className="text-base px-8">
                <a href="#about">Learn More</a>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-egyptian-gold to-transparent" role="presentation" aria-hidden="true"></div>
      </section>

      {/* Features Section */}
      {features.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div key={feature.id} className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-egyptian-gold transition-all duration-300 hover:shadow-lg">
                  {feature.imageUrl ? (
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden border-2 border-egyptian-gold">
                      <img
                        src={feature.imageUrl}
                        alt={feature.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-egyptian-gold-light to-egyptian-gold flex items-center justify-center text-3xl">
                      🎂
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Story
          </h2>
          <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
            <p>
              At GeGe Sweets, we bring the authentic flavors of Egypt to your table. Each dessert is crafted
              with passion, using traditional methods passed down through generations.
            </p>
            <p>
              From the bustling streets of Cairo to your home, we deliver sweetness with every bite.
            </p>
            <p className="text-xl gold-accent font-semibold mt-6">
              Made with love, served with pride.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Order?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Explore our full menu and discover your new favorite treat
          </p>
          <Button asChild size="lg" className="text-base px-12">
            <Link href="/menu">Browse Menu</Link>
          </Button>
        </div>
      </section>

      {/* Contact Section */}
      {settings && (
        <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white border-t border-gray-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Get in Touch
              </h2>
              <p className="text-lg text-gray-600">
                We'd love to hear from you
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-8">
              {settings.phone && (
                <div className="text-center p-6 bg-white rounded-xl border border-gray-200 hover:border-egyptian-gold transition-all duration-300 w-64">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-egyptian-gold-light flex items-center justify-center">
                    <svg className="w-6 h-6 text-egyptian-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Phone</h3>
                  <a href={`tel:${settings.phone}`} className="text-gray-600 hover:text-egyptian-gold transition-colors">
                    {settings.phone}
                  </a>
                </div>
              )}

              {settings.email && (
                <div className="text-center p-6 bg-white rounded-xl border border-gray-200 hover:border-egyptian-gold transition-all duration-300 w-64">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-egyptian-gold-light flex items-center justify-center">
                    <svg className="w-6 h-6 text-egyptian-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Email</h3>
                  <a href={`mailto:${settings.email}`} className="text-gray-600 hover:text-egyptian-gold transition-colors break-all">
                    {settings.email}
                  </a>
                </div>
              )}

              {settings.address && (
                <div className="text-center p-6 bg-white rounded-xl border border-gray-200 hover:border-egyptian-gold transition-all duration-300 w-64">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-egyptian-gold-light flex items-center justify-center">
                    <svg className="w-6 h-6 text-egyptian-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Location</h3>
                  <p className="text-gray-600">{settings.address}</p>
                </div>
              )}

              {settings.hours && (
                <div className="text-center p-6 bg-white rounded-xl border border-gray-200 hover:border-egyptian-gold transition-all duration-300 w-64">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-egyptian-gold-light flex items-center justify-center">
                    <svg className="w-6 h-6 text-egyptian-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Hours</h3>
                  <p className="text-gray-600">{settings.hours}</p>
                </div>
              )}
            </div>

            {(settings.instagram || settings.facebook) && (
              <div className="mt-12 text-center">
                <h3 className="font-bold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex justify-center gap-4">
                  {settings.instagram && (
                    <a
                      href={settings.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-egyptian-gold-light hover:bg-egyptian-gold flex items-center justify-center transition-all duration-300 group"
                      aria-label="Follow us on Instagram"
                    >
                      <svg className="w-6 h-6 text-egyptian-gold group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  )}
                  {settings.facebook && (
                    <a
                      href={settings.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-egyptian-gold-light hover:bg-egyptian-gold flex items-center justify-center transition-all duration-300 group"
                      aria-label="Follow us on Facebook"
                    >
                      <svg className="w-6 h-6 text-egyptian-gold group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">GeGe Sweets</h3>
            <p className="text-gray-600">Where tradition meets taste</p>
          </div>
          <div className="flex justify-center gap-8 mb-8">
            <Link href="/menu" className="text-gray-600 hover:text-egyptian-gold transition-colors font-medium">
              Menu
            </Link>
            <Link href="/admin" className="text-gray-600 hover:text-egyptian-gold transition-colors font-medium">
              Admin
            </Link>
          </div>
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 GeGe Sweets. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
