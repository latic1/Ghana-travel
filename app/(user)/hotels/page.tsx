'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Building2, Star, Search, Bed, DollarSign, MapPin } from 'lucide-react'
import Link from 'next/link'

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
  destinationId: string
  createdAt: string
  destination?: {
    name: string
  }
}

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [priceFilter, setPriceFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch('/api/hotels')
        if (response.ok) {
          const data = await response.json()
          setHotels(data)
          setFilteredHotels(data)
        } else {
          console.error('Failed to fetch hotels')
        }
      } catch (error) {
        console.error('Error fetching hotels:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHotels()
  }, [])

  useEffect(() => {
    let filtered = hotels

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(hotel =>
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(hotel => hotel.category === categoryFilter)
    }

    // Apply price filter
    if (priceFilter !== 'all') {
      switch (priceFilter) {
        case 'budget':
          filtered = filtered.filter(hotel => hotel.pricePerNight <= 250)
          break
        case 'moderate':
          filtered = filtered.filter(hotel => hotel.pricePerNight > 250 && hotel.pricePerNight <= 750)
          break
        case 'luxury':
          filtered = filtered.filter(hotel => hotel.pricePerNight > 750)
          break
      }
    }

    setFilteredHotels(filtered)
  }, [hotels, searchTerm, categoryFilter, priceFilter])

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      LUXURY: 'bg-purple-100 text-purple-800',
      BOUTIQUE: 'bg-pink-100 text-pink-800',
      ECO_FRIENDLY: 'bg-green-100 text-green-800',
      BUDGET: 'bg-blue-100 text-blue-800',
      RESORT: 'bg-orange-100 text-orange-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const parseAmenities = (amenities: string) => {
    try {
      return JSON.parse(amenities)
    } catch {
      return []
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading hotels...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find Your Perfect Stay in Ghana
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          From luxury resorts to eco-friendly lodges, discover comfortable accommodations across Ghana&apos;s most beautiful destinations.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search hotels..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="LUXURY">Luxury</SelectItem>
                  <SelectItem value="BOUTIQUE">Boutique</SelectItem>
                  <SelectItem value="ECO_FRIENDLY">Eco-Friendly</SelectItem>
                  <SelectItem value="BUDGET">Budget</SelectItem>
                  <SelectItem value="RESORT">Resort</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Prices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="budget">Budget (₵0-₵250)</SelectItem>
                  <SelectItem value="moderate">Moderate (₵251-₵750)</SelectItem>
                  <SelectItem value="luxury">Luxury (₵751+)</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-gray-600 flex items-center justify-center">
                {filteredHotels.length} of {hotels.length} hotels
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.map((hotel) => (
          <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Building2 className="w-16 h-16 text-gray-400" />
              </div>
              <div className="absolute top-3 right-3">
                <Badge className={getCategoryColor(hotel.category)}>
                  {hotel.category}
                </Badge>
              </div>
            </div>
            
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{hotel.name}</CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{hotel.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{hotel.rating}</span>
                    <Badge className={getCategoryColor(hotel.category)}>
                      {hotel.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <CardDescription className="mb-4 line-clamp-3">
                {hotel.description}
              </CardDescription>
              
              <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Bed className="w-4 h-4" />
                  <span>{hotel.availableRooms} rooms</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-medium">₵{hotel.pricePerNight}/night</span>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-sm mb-2">Amenities:</h4>
                <div className="flex flex-wrap gap-1">
                  {parseAmenities(hotel.amenities).slice(0, 3).map((amenity: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {parseAmenities(hotel.amenities).length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{parseAmenities(hotel.amenities).length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
              
              <Button asChild className="w-full">
                <Link href={`/hotels/${hotel.id}`}>
                  <Building2 className="w-4 h-4 mr-2" />
                  View Details
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredHotels.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hotels found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
        </div>
      )}
    </div>
  )
}
