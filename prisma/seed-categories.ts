import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding attraction categories...')

  const categories = [
    {
      name: 'Historic',
      description: 'Historical sites, monuments, and heritage locations',
      color: '#8B4513'
    },
    {
      name: 'Natural',
      description: 'Natural landscapes, parks, and scenic areas',
      color: '#228B22'
    },
    {
      name: 'Cultural',
      description: 'Cultural centers, museums, and traditional sites',
      color: '#9932CC'
    },
    {
      name: 'Adventure',
      description: 'Adventure activities and outdoor experiences',
      color: '#FF4500'
    },
    {
      name: 'Beach',
      description: 'Beach destinations and coastal attractions',
      color: '#00CED1'
    },
    {
      name: 'Wildlife',
      description: 'Wildlife reserves, sanctuaries, and nature parks',
      color: '#8FBC8F'
    }
  ]

  for (const category of categories) {
    await prisma.attractionCategory.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    })
    console.log(`Created/updated category: ${category.name}`)
  }

  console.log('Attraction categories seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
