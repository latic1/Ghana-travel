'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MapPin, Star, Search, Filter, Calendar, Eye } from 'lucide-react'
import Link from 'next/link'

interface Destination {
  id: string
  name: string
  description: string
  location: string
  category: string
  imageUrl: string
  rating: number
  priceRange: string
  bestTimeToVisit?: string
  highlights: string
  createdAt: string
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [priceFilter, setPriceFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch('/api/attractions')
        if (response.ok) {
          const data = await response.json()
          setDestinations(data)
          setFilteredDestinations(data)
        } else {
          console.error('Failed to fetch attractions')
        }
      } catch (error) {
        console.error('Error fetching attractions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDestinations()
  }, [])

  useEffect(() => {
    let filtered = destinations

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(dest =>
        dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(dest => dest.category === categoryFilter)
    }

    // Apply price filter
    if (priceFilter !== 'all') {
      filtered = filtered.filter(dest => dest.priceRange === priceFilter)
    }

    setFilteredDestinations(filtered)
  }, [destinations, searchTerm, categoryFilter, priceFilter])

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      HISTORIC: 'bg-blue-100 text-blue-800',
      NATURAL: 'bg-green-100 text-green-800',
      CULTURAL: 'bg-purple-100 text-purple-800',
      ADVENTURE: 'bg-orange-100 text-orange-800',
      BEACH: 'bg-cyan-100 text-cyan-800',
      WILDLIFE: 'bg-brown-100 text-brown-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const getPriceColor = (price: string) => {
    const colors: { [key: string]: string } = {
      BUDGET: 'bg-green-100 text-green-800',
      MODERATE: 'bg-yellow-100 text-yellow-800',
      LUXURY: 'bg-purple-100 text-purple-800',
      PREMIUM: 'bg-red-100 text-red-800'
    }
    return colors[price] || 'bg-gray-100 text-gray-800'
  }

  const parseHighlights = (highlights: string) => {
    try {
      return JSON.parse(highlights)
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
            <p className="text-gray-600">Loading attractions...</p>
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
          Discover Ghana's Amazing Destinations
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          From historic castles to pristine beaches, explore the diverse attractions that make Ghana a unique travel destination.
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
                  placeholder="Search destinations..."
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
                  <SelectItem value="HISTORIC">Historic</SelectItem>
                  <SelectItem value="NATURAL">Natural</SelectItem>
                  <SelectItem value="CULTURAL">Cultural</SelectItem>
                  <SelectItem value="ADVENTURE">Adventure</SelectItem>
                  <SelectItem value="BEACH">Beach</SelectItem>
                  <SelectItem value="WILDLIFE">Wildlife</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Prices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="BUDGET">Budget</SelectItem>
                  <SelectItem value="MODERATE">Moderate</SelectItem>
                  <SelectItem value="LUXURY">Luxury</SelectItem>
                  <SelectItem value="PREMIUM">Premium</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-gray-600 flex items-center justify-center">
                {filteredDestinations.length} of {destinations.length} destinations
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDestinations.map((destination) => (
          <Card key={destination.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="w-16 h-16 text-gray-400" />
              </div>
              <div className="absolute top-3 right-3">
                <Badge className={getPriceColor(destination.priceRange)}>
                  {destination.priceRange}
                </Badge>
              </div>
            </div>
            
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{destination.name}</CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{destination.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{destination.rating}</span>
                    <Badge className={getCategoryColor(destination.category)}>
                      {destination.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <CardDescription className="mb-4 line-clamp-3">
                {destination.description}
              </CardDescription>
              
              {destination.bestTimeToVisit && (
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Best time: {destination.bestTimeToVisit}</span>
                </div>
              )}
              
              <div className="mb-4">
                <h4 className="font-medium text-sm mb-2">Highlights:</h4>
                <div className="flex flex-wrap gap-1">
                  {parseHighlights(destination.highlights).map((highlight: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Button asChild className="w-full">
                <Link href={`/attractions/${destination.id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDestinations.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No destinations found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
        </div>
      )}
    </div>
  )
}
