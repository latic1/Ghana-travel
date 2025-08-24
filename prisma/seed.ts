import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create sample attractions
  const attractions = [
    {
      name: 'Cape Coast Castle',
      description: 'Historic castle with stunning ocean views and rich cultural heritage',
      location: 'Cape Coast, Central Region',
      category: 'HISTORIC' as const,
      imageUrl: '/images/cape-coast-castle.jpg',
      rating: 4.8,
      price: 25.0,
      duration: '2-3 hours',
      maxVisitors: 50,
      availableSlots: 45
    },
    {
      name: 'Kakum National Park',
      description: 'Experience the famous canopy walkway through the rainforest',
      location: 'Cape Coast, Central Region',
      category: 'NATURAL' as const,
      imageUrl: '/images/kakum-park.jpg',
      rating: 4.6,
      price: 15.0,
      duration: '3-4 hours',
      maxVisitors: 100,
      availableSlots: 80
    },
    {
      name: 'Kumasi Cultural Center',
      description: 'Immerse yourself in Ashanti culture and traditional crafts',
      location: 'Kumasi, Ashanti Region',
      category: 'CULTURAL' as const,
      imageUrl: '/images/kumasi-cultural.jpg',
      rating: 4.5,
      price: 20.0,
      duration: '2-3 hours',
      maxVisitors: 75,
      availableSlots: 60
    },
    {
      name: 'Mole National Park',
      description: 'Wildlife safari experience with elephants, antelopes, and more',
      location: 'Sawla, Savannah Region',
      category: 'ADVENTURE' as const,
      imageUrl: '/images/mole-park.jpg',
      rating: 4.7,
      price: 35.0,
      duration: 'Full day',
      maxVisitors: 40,
      availableSlots: 30
    },
    {
      name: 'Elmina Castle',
      description: 'UNESCO World Heritage site with fascinating history',
      location: 'Elmina, Central Region',
      category: 'HISTORIC' as const,
      imageUrl: '/images/elmina-castle.jpg',
      rating: 4.6,
      price: 22.0,
      duration: '2-3 hours',
      maxVisitors: 60,
      availableSlots: 50
    },
    {
      name: 'Boti Falls',
      description: 'Twin waterfalls surrounded by lush vegetation',
      location: 'Boti, Eastern Region',
      category: 'NATURAL' as const,
      imageUrl: '/images/boti-falls.jpg',
      rating: 4.4,
      price: 12.0,
      duration: '2-3 hours',
      maxVisitors: 80,
      availableSlots: 70
    }
  ]

  // Create sample hotels
  const hotels = [
    {
      name: 'Kempinski Hotel Gold Coast City',
      description: 'Luxury 5-star hotel in the heart of Accra with world-class amenities',
      location: 'Accra, Greater Accra',
      category: 'LUXURY' as const,
      imageUrl: '/images/kempinski-hotel.jpg',
      rating: 4.9,
      pricePerNight: 250.0,
      amenities: '["WiFi", "Pool", "Spa", "Restaurant", "Gym", "Concierge"]',
      availableRooms: 15
    },
    {
      name: 'Labadi Beach Hotel',
      description: 'Beachfront resort with stunning ocean views and local charm',
      location: 'Labadi, Greater Accra',
      category: 'RESORT' as const,
      imageUrl: '/images/labadi-beach.jpg',
      rating: 4.6,
      pricePerNight: 180.0,
      amenities: '["WiFi", "Beach Access", "Pool", "Restaurant", "Bar", "Spa"]',
      availableRooms: 25
    },
    {
      name: 'Movenpick Ambassador Hotel',
      description: 'Modern business hotel with excellent conference facilities',
      location: 'Accra, Greater Accra',
      category: 'LUXURY' as const,
      imageUrl: '/images/movenpick-hotel.jpg',
      rating: 4.7,
      pricePerNight: 200.0,
      amenities: '["WiFi", "Pool", "Restaurant", "Gym", "Business Center", "Spa"]',
      availableRooms: 20
    },
    {
      name: 'Coconut Grove Beach Resort',
      description: 'Eco-friendly beach resort with traditional Ghanaian hospitality',
      location: 'Elmina, Central Region',
      category: 'ECO_FRIENDLY' as const,
      imageUrl: '/images/coconut-grove.jpg',
      rating: 4.5,
      pricePerNight: 120.0,
      amenities: '["WiFi", "Beach Access", "Restaurant", "Bar", "Garden", "Local Tours"]',
      availableRooms: 30
    },
    {
      name: 'Golden Tulip Kumasi City',
      description: 'Comfortable hotel in the heart of Kumasi with Ashanti cultural touches',
      location: 'Kumasi, Ashanti Region',
      category: 'BOUTIQUE' as const,
      imageUrl: '/images/golden-tulip.jpg',
      rating: 4.3,
      pricePerNight: 90.0,
      amenities: '["WiFi", "Restaurant", "Bar", "Conference Room", "Local Tours"]',
      availableRooms: 35
    },
    {
      name: 'Budget Inn Accra',
      description: 'Affordable accommodation with clean rooms and friendly service',
      location: 'Accra, Greater Accra',
      category: 'BUDGET' as const,
      imageUrl: '/images/budget-inn.jpg',
      rating: 4.0,
      pricePerNight: 45.0,
      amenities: '["WiFi", "Restaurant", "24/7 Front Desk", "Laundry"]',
      availableRooms: 50
    }
  ]

  console.log('🏨 Creating hotels...')
  for (const hotelData of hotels) {
    await prisma.hotel.create({
      data: hotelData
    })
  }

  console.log('🎯 Creating attractions...')
  for (const attractionData of attractions) {
    await prisma.attraction.create({
      data: attractionData
    })
  }

  console.log('✅ Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
