'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Star, Camera, Hotel, Navigation } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import the map selector component to avoid SSR issues
const MapSelector = dynamic(() => import('@/components/MapSelector'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  )
})

interface Location {
  id: string
  name: string
  description: string
  location: string
  region: string
  type: 'attraction' | 'accommodation'
  rating: number
  price?: string
  coordinates: [number, number] // [latitude, longitude]
}

export default function MapsPage() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [locations] = useState<Location[]>([
    {
      id: '1',
      name: 'Cape Coast Castle',
      description: 'Historic castle with stunning ocean views and rich cultural heritage',
      location: 'Cape Coast, Central Region',
      region: 'Central Region',
      type: 'attraction',
      rating: 4.8,
      coordinates: [5.1053, -1.2468]
    },
    {
      id: '2',
      name: 'Kakum National Park',
      description: 'Beautiful rainforest with canopy walkway and diverse wildlife',
      location: 'Cape Coast, Central Region',
      region: 'Central Region',
      type: 'attraction',
      rating: 4.6,
      coordinates: [5.3500, -1.3833]
    },
    {
      id: '3',
      name: 'Mole National Park',
      description: 'Ghana\'s largest wildlife park with elephants, antelopes, and more',
      location: 'Sawla, Savannah Region',
      region: 'Savannah Region',
      type: 'attraction',
      rating: 4.7,
      coordinates: [9.7000, -1.8167]
    },
    {
      id: '4',
      name: 'Lake Volta',
      description: 'World\'s largest man-made lake with fishing and water activities',
      location: 'Eastern Region',
      region: 'Eastern Region',
      type: 'attraction',
      rating: 4.5,
      coordinates: [6.5000, 0.0000]
    },
    {
      id: '5',
      name: 'Kumasi Cultural Centre',
      description: 'Traditional Ashanti culture, crafts, and historical artifacts',
      location: 'Kumasi, Ashanti Region',
      region: 'Ashanti Region',
      type: 'attraction',
      rating: 4.4,
      coordinates: [6.7000, -1.6167]
    },
    {
      id: '6',
      name: 'Labadi Beach',
      description: 'Popular beach with vibrant atmosphere and local cuisine',
      location: 'Accra, Greater Accra Region',
      region: 'Greater Accra Region',
      type: 'attraction',
      rating: 4.3,
      coordinates: [5.5600, -0.1740]
    },
    {
      id: '7',
      name: 'Kempinski Hotel Gold Coast City',
      description: 'Luxury 5-star hotel in the heart of Accra',
      location: 'Accra, Greater Accra Region',
      region: 'Greater Accra Region',
      type: 'accommodation',
      rating: 4.8,
      price: '₵1,000-2,000/night',
      coordinates: [5.5600, -0.1869]
    },
    {
      id: '8',
      name: 'Movenpick Ambassador Hotel',
      description: 'Elegant hotel with ocean views and world-class amenities',
      location: 'Accra, Greater Accra Region',
      region: 'Greater Accra Region',
      type: 'accommodation',
      rating: 4.7,
      price: '₵900-1,750/night',
      coordinates: [5.5500, -0.1900]
    },
    {
      id: '9',
      name: 'Elmina Beach Resort',
      description: 'Beachfront resort with traditional Ghanaian hospitality',
      location: 'Elmina, Central Region',
      region: 'Central Region',
      type: 'accommodation',
      rating: 4.5,
      price: '₵600-1,250/night',
      coordinates: [5.0833, -1.3500]
    },
    {
      id: '10',
      name: 'Kumasi Golden Tulip Hotel',
      description: 'Modern hotel in the heart of Ashanti culture',
      location: 'Kumasi, Ashanti Region',
      region: 'Ashanti Region',
      type: 'accommodation',
      rating: 4.4,
      price: '₵500-1,000/night',
      coordinates: [6.7000, -1.6167]
    }
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Interactive Map of Ghana</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Explore Ghana&apos;s amazing destinations, attractions, and accommodations on our interactive map. 
            Click on markers to learn more about each location.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Map */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-yellow-600" />
                  Ghana Tourism Map
                </CardTitle>
                <CardDescription>
                  Interactive map showing attractions, hotels, and points of interest across Ghana
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <MapSelector 
                  locations={locations}
                  onLocationSelect={setSelectedLocation}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Location Details */}
            {selectedLocation ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {selectedLocation.name}
                      </CardTitle>
                      <CardDescription className="mt-2">{selectedLocation.description}</CardDescription>
                    </div>
                    <Badge variant="secondary">{selectedLocation.region}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{selectedLocation.rating}</span>
                    </div>
                    {selectedLocation.price && (
                      <span className="text-lg font-bold text-foreground">{selectedLocation.price}</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Button className="w-full bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700">
                      {selectedLocation.type === "accommodation" ? "Book Now" : "View Details"}
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Select a Location</CardTitle>
                  <CardDescription>
                    Click on any marker on the map to view detailed information about attractions and accommodations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Camera className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm">Tourist Attractions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Hotel className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm">Accommodations</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                        <MapPin className="w-3 h-3 text-white" />
                        <span className="text-sm">Travel Routes</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {locations.filter((l) => l.type === "attraction").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Attractions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {locations.filter((l) => l.type === "accommodation").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Hotels</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">10</div>
                    <div className="text-sm text-muted-foreground">Regions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">2</div>
                    <div className="text-sm text-muted-foreground">Routes</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
