'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Calendar, Building2, Search, Filter, BookOpen } from "lucide-react"
import SearchAndFilter, { SearchFilters } from "@/components/SearchAndFilter"
import Link from "next/link"

interface Attraction {
  id: string
  name: string
  description: string
  location: string
  category: string
  imageUrl: string
  rating: number
  price: number
  duration: string
  maxVisitors: number
  availableSlots: number
}

interface Hotel {
  id: string
  name: string
  description: string
  location: string
  category: string
  imageUrl: string
  rating: number
  pricePerNight: number
  amenities: string
  availableRooms: number
}

export default function HomePage() {
  const { data: session } = useSession()
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [filteredAttractions, setFilteredAttractions] = useState<Attraction[]>([])
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([])
  const [searchResults, setSearchResults] = useState<{
    attractions: Attraction[]
    hotels: Hotel[]
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attractionsRes, hotelsRes] = await Promise.all([
          fetch('/api/attractions'),
          fetch('/api/hotels')
        ])

        if (attractionsRes.ok) {
          const attractionsData = await attractionsRes.json()
          setAttractions(attractionsData)
          setFilteredAttractions(attractionsData)
        }

        if (hotelsRes.ok) {
          const hotelsData = await hotelsRes.json()
          setHotels(hotelsData)
          setFilteredHotels(hotelsData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSearch = (filters: SearchFilters) => {
    let filteredAttr = attractions
    let filteredHot = hotels

    // Apply search term filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase()
      filteredAttr = attractions.filter(attraction =>
        attraction.name.toLowerCase().includes(searchTerm) ||
        attraction.description.toLowerCase().includes(searchTerm) ||
        attraction.location.toLowerCase().includes(searchTerm)
      )
      filteredHot = hotels.filter(hotel =>
        hotel.name.toLowerCase().includes(searchTerm) ||
        hotel.description.toLowerCase().includes(searchTerm) ||
        hotel.location.toLowerCase().includes(searchTerm)
      )
    }

    // Apply type filter
    if (filters.type === 'attraction') {
      filteredHot = []
    } else if (filters.type === 'hotel') {
      filteredAttr = []
    }

    // Apply category filter
    if (filters.category !== 'all') {
      filteredAttr = filteredAttr.filter(attraction => attraction.category === filters.category)
      filteredHot = filteredHot.filter(hotel => hotel.category === filters.category)
    }

    // Apply price filter
    if (filters.priceRange !== 'all') {
      switch (filters.priceRange) {
        case 'budget':
          filteredAttr = filteredAttr.filter(attraction => attraction.price <= 50)
          filteredHot = filteredHot.filter(hotel => hotel.pricePerNight <= 50)
          break
        case 'moderate':
          filteredAttr = filteredAttr.filter(attraction => attraction.price > 50 && attraction.price <= 150)
          filteredHot = filteredHot.filter(hotel => hotel.pricePerNight > 50 && hotel.pricePerNight <= 150)
          break
        case 'luxury':
          filteredAttr = filteredAttr.filter(attraction => attraction.price > 150)
          filteredHot = filteredHot.filter(hotel => hotel.pricePerNight > 150)
          break
      }
    }

    // Apply location filter
    if (filters.location) {
      const location = filters.location.toLowerCase()
      filteredAttr = filteredAttr.filter(attraction => attraction.location.toLowerCase().includes(location))
      filteredHot = filteredHot.filter(hotel => hotel.location.toLowerCase().includes(location))
    }

    setSearchResults({
      attractions: filteredAttr,
      hotels: filteredHot
    })
  }

  const handleClear = () => {
    setSearchResults(null)
    setFilteredAttractions(attractions)
    setFilteredHotels(hotels)
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      HISTORIC: 'bg-blue-100 text-blue-800',
      NATURAL: 'bg-green-100 text-green-800',
      CULTURAL: 'bg-purple-100 text-purple-800',
      ADVENTURE: 'bg-orange-100 text-orange-800',
      LUXURY: 'bg-purple-100 text-purple-800',
      BOUTIQUE: 'bg-pink-100 text-pink-800',
      ECO_FRIENDLY: 'bg-green-100 text-green-800',
      BUDGET: 'bg-blue-100 text-blue-800',
      RESORT: 'bg-orange-100 text-orange-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }



  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing attractions and hotels...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-yellow-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Discover the Heart of
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-red-600"> Ghana</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience rich culture, stunning landscapes, and warm hospitality. Your gateway to unforgettable
              adventures in West Africa.
            </p>
            
            {/* Search and Filter Component */}
            <div className="max-w-3xl mx-auto mb-8">
              <SearchAndFilter 
                onSearch={handleSearch}
                onClear={handleClear}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700"
                asChild
              >
                <Link href="/attractions">
                  <MapPin className="w-5 h-5 mr-2" />
                  Explore Attractions
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-yellow-600 text-yellow-700 hover:bg-yellow-50 bg-transparent"
                asChild
              >
                <Link href="/hotels">
                  <Building2 className="w-5 h-5 mr-2" />
                  Find Hotels
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-yellow-600 text-yellow-700 hover:bg-yellow-50 bg-transparent"
                asChild
              >
                <Link href="/maps">
                  <Calendar className="w-5 h-5 mr-2" />
                  View Interactive Map
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      {searchResults && (
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-foreground mb-4">Search Results</h3>
              <p className="text-muted-foreground">
                Found {searchResults.attractions.length} attractions and {searchResults.hotels.length} hotels
              </p>
            </div>

            {/* Attractions Results */}
            {searchResults.attractions.length > 0 && (
              <div className="mb-12">
                <h4 className="text-2xl font-bold text-foreground mb-6">Attractions</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.attractions.map((attraction) => (
                    <Card key={attraction.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 relative">
                        <img
                          src={attraction.imageUrl || "/placeholder-s2dgm.png"}
                          alt={attraction.name}
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-4 left-4 bg-white/90 text-foreground">
                          {attraction.category}
                        </Badge>
                      </div>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-yellow-600" />
                          {attraction.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {attraction.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{attraction.rating}</span>
                            </div>
                            <span className="text-lg font-bold text-foreground">${attraction.price}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p>Duration: {attraction.duration}</p>
                            <p>Available slots: {attraction.availableSlots}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="w-full bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700"
                            asChild
                          >
                            <Link href={`/attractions/${attraction.id}`}>
                              <BookOpen className="w-4 h-4 mr-2" />
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Hotels Results */}
            {searchResults.hotels.length > 0 && (
              <div>
                <h4 className="text-2xl font-bold text-foreground mb-6">Hotels</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.hotels.map((hotel) => (
                    <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative">
                        <img
                          src={hotel.imageUrl || "/placeholder-s2dgm.png"}
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-4 left-4 bg-white/90 text-foreground">
                          {hotel.category}
                        </Badge>
                      </div>
                      <CardHeader>
                        <CardTitle>{hotel.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {hotel.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{hotel.rating}</span>
                            </div>
                            <span className="text-lg font-bold text-foreground">${hotel.pricePerNight}/night</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p>Available rooms: {hotel.availableRooms}</p>
                            <p>Location: {hotel.location}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="w-full bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700"
                            asChild
                          >
                            <Link href={`/hotels/${hotel.id}`}>
                              <BookOpen className="w-4 h-4 mr-2" />
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {searchResults.attractions.length === 0 && searchResults.hotels.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Featured Attractions */}
      {!searchResults && (
        <section id="attractions" className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground mb-4">Featured Attractions</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From historic castles to pristine beaches, discover Ghana's most captivating attractions
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAttractions.slice(0, 6).map((attraction) => (
                <Card key={attraction.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 relative">
                    <img
                      src={attraction.imageUrl || "/placeholder-s2dgm.png"}
                      alt={attraction.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-4 left-4 bg-white/90 text-foreground">
                      {attraction.category}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-yellow-600" />
                      {attraction.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {attraction.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{attraction.rating}</span>
                        </div>
                        <span className="text-lg font-bold text-foreground">${attraction.price}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Duration: {attraction.duration}</p>
                        <p>Available slots: {attraction.availableSlots}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="w-full bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700"
                        asChild
                      >
                        <Link href={`/attractions/${attraction.id}`}>
                          <BookOpen className="w-4 h-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredAttractions.length > 6 && (
              <div className="text-center mt-8">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-yellow-600 text-yellow-700 hover:bg-yellow-50 bg-transparent"
                  asChild
                >
                  <Link href="/attractions">
                    <MapPin className="w-5 h-5 mr-2" />
                    View All Attractions
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Featured Hotels */}
      {!searchResults && (
        <section id="accommodations" className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground mb-4">Featured Hotels</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From luxury resorts to eco-lodges, find the perfect accommodation for your Ghana adventure
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHotels.slice(0, 6).map((hotel) => (
                <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative">
                    <img
                      src={hotel.imageUrl || "/placeholder-s2dgm.png"}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-4 left-4 bg-white/90 text-foreground">
                      {hotel.category}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle>{hotel.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {hotel.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{hotel.rating}</span>
                        </div>
                        <span className="text-lg font-bold text-foreground">${hotel.pricePerNight}/night</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Available rooms: {hotel.availableRooms}</p>
                        <p>Location: {hotel.location}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="w-full bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700"
                        asChild
                      >
                        <Link href={`/hotels/${hotel.id}`}>
                          <BookOpen className="w-4 h-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredHotels.length > 6 && (
              <div className="text-center mt-8">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-yellow-600 text-yellow-700 hover:bg-yellow-50 bg-transparent"
                  asChild
                >
                  <Link href="/hotels">
                    <Building2 className="w-5 h-5 mr-2" />
                    View All Hotels
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Travel Routes */}
      <section id="routes" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Popular Travel Routes</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the best ways to explore Ghana with our curated travel routes and transportation options
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  Golden Triangle Route
                </CardTitle>
                <CardDescription>Accra → Cape Coast → Kumasi (7 days)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm">Accra: Modern capital & cultural hub</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm">Cape Coast: Historic castles & beaches</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm">Kumasi: Ashanti culture & crafts</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">From $850 per person</span>
                  <Button size="sm">View Details</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  Northern Safari Adventure
                </CardTitle>
                <CardDescription>Tamale → Mole → Larabanga (5 days)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Tamale: Northern cultural center</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Mole: Wildlife safari experience</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Larabanga: Ancient mosque & traditions</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">From $650 per person</span>
                  <Button size="sm">View Details</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}
