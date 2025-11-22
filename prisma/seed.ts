import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Validate required environment variables
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error(
      '❌ Missing required environment variables:\n' +
      '   ADMIN_EMAIL and ADMIN_PASSWORD must be set in your .env file\n' +
      '   Example:\n' +
      '   ADMIN_EMAIL=your-email@example.com\n' +
      '   ADMIN_PASSWORD=YourSecurePassword123!'
    )
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)

  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL },
    update: {
      password: hashedPassword,
      role: 'admin',
    },
    create: {
      email: process.env.ADMIN_EMAIL,
      name: 'Admin',
      password: hashedPassword,
      role: 'admin',
    },
  })

  console.log('✓ Admin user created')

  // Create or update site settings with default contact info
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      phone: '+1 (555) 123-4567',
      email: 'info@gegesweets.com',
      address: '123 Sweet Street, Dessert City, CA 90210',
      hours: 'Mon-Sat: 9AM-8PM, Sun: 10AM-6PM',
      instagram: 'https://instagram.com/gegesweets',
      facebook: 'https://facebook.com/gegesweets',
    },
  })

  console.log('✓ Site settings created')

  // Clear existing data
  await prisma.menuItem.deleteMany({})
  await prisma.category.deleteMany({})

  // Create categories
  const dessertCups = await prisma.category.create({
    data: {
      name: 'Dessert Cups',
      description: 'Individual servings of our most beloved desserts',
      order: 1,
    },
  })

  const chocolateTreats = await prisma.category.create({
    data: {
      name: 'Chocolate Treats',
      description: 'Premium chocolates and handcrafted treats',
      order: 2,
    },
  })

  const chocolateBars = await prisma.category.create({
    data: {
      name: 'Chocolate Bars & Pieces',
      description: 'Luxurious chocolate bars in various sizes',
      order: 3,
    },
  })

  const egyptianCookies = await prisma.category.create({
    data: {
      name: 'Egyptian Cookies',
      description: 'Traditional cookies made from time-honored recipes',
      order: 4,
    },
  })

  console.log('✓ Categories created')

  // DESSERT CUPS
  await prisma.menuItem.createMany({
    data: [
      { name: 'Cold Kunafa with Cream Cup', categoryId: dessertCups.id, order: 1 },
      { name: 'Cold Kunafa with Cream & Nuts Cup', categoryId: dessertCups.id, order: 2 },
      { name: 'Coffee Tiramisu Cup', categoryId: dessertCups.id, order: 3 },
      { name: 'Pistachio Tiramisu Cup', categoryId: dessertCups.id, order: 4 },
      { name: 'Biscoff Tiramisu Cup', categoryId: dessertCups.id, order: 5 },
      { name: 'Rice Pudding Cup', categoryId: dessertCups.id, order: 6 },
      { name: 'Oreo Cheesecake Cup', categoryId: dessertCups.id, order: 7 },
      { name: 'Biscoff Cheesecake Cup', categoryId: dessertCups.id, order: 8 },
      { name: 'Dubai Chocolate Cheesecake Cup', categoryId: dessertCups.id, order: 9 },
      { name: '3-Layer Baklava Cup', categoryId: dessertCups.id, order: 10 },
      { name: 'Mango Pudding Cup', categoryId: dessertCups.id, order: 11 },
      { name: 'Flan Cup', categoryId: dessertCups.id, order: 12 },
    ],
  })

  console.log('✓ Dessert Cups added (12 items)')

  // CHOCOLATE TREATS
  await prisma.menuItem.createMany({
    data: [
      { name: 'Chocolate Covered Pretzels', categoryId: chocolateTreats.id, order: 1 },
      { name: 'Chocolate Covered Strawberries', categoryId: chocolateTreats.id, order: 2 },
    ],
  })

  console.log('✓ Chocolate Treats added (2 items)')

  // CHOCOLATE BARS & PIECES
  await prisma.menuItem.createMany({
    data: [
      { name: 'Dubai Chocolate Bars', description: 'Available in Mini, Small, Medium, Large', categoryId: chocolateBars.id, order: 1 },
      { name: 'Chocolate with Nuts', description: 'Available in Mini, Small, Medium', categoryId: chocolateBars.id, order: 2 },
      { name: 'Chocolate with Biscoff Filling', description: 'Available in Mini, Small, Medium', categoryId: chocolateBars.id, order: 3 },
      { name: 'Chocolate with Coconut Filling', description: 'Available in Mini, Small, Medium', categoryId: chocolateBars.id, order: 4 },
    ],
  })

  console.log('✓ Chocolate Bars & Pieces added (4 items)')

  // EGYPTIAN COOKIES
  await prisma.menuItem.createMany({
    data: [
      { name: 'Mixed Cookie Plate', categoryId: egyptianCookies.id, order: 1 },
      { name: 'Decorated Cookies', categoryId: egyptianCookies.id, order: 2 },
      { name: 'Kahk', categoryId: egyptianCookies.id, order: 3 },
      { name: 'Biscuits', categoryId: egyptianCookies.id, order: 4 },
      { name: 'Coffee Cookies', categoryId: egyptianCookies.id, order: 5 },
      { name: 'Ghorayba', categoryId: egyptianCookies.id, order: 6 },
      { name: 'Butter Cookies (Betefour)', categoryId: egyptianCookies.id, order: 7 },
    ],
  })

  console.log('✓ Egyptian Cookies added (7 items)')

  // Clear existing features and create default ones
  await prisma.homeFeature.deleteMany({})

  await prisma.homeFeature.createMany({
    data: [
      {
        title: 'Dessert Cups',
        description: 'Individual servings of our most beloved desserts, from kunafa to tiramisu and cheesecake.',
        order: 1,
      },
      {
        title: 'Chocolate Delights',
        description: 'Premium chocolates including our famous Dubai chocolate bars and handcrafted treats.',
        order: 2,
      },
      {
        title: 'Egyptian Cookies',
        description: 'Traditional cookies like kahk, ghorayba, and betefour, made from time-honored recipes.',
        order: 3,
      },
    ],
  })

  console.log('✓ Home features created (3 features)')
  console.log('\n✅ Database seeded successfully with all menu items and features!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
