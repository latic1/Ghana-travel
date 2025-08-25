'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MapPin, Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

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
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDeleteDestination = async (id: string) => {
    if (confirm('Are you sure you want to delete this destination? This action cannot be undone.')) {
      setIsDeleting(id)
      try {
        const response = await fetch(`/api/destinations/${id}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          // Remove from local state
          setDestinations(prev => prev.filter(dest => dest.id !== id))
          setFilteredDestinations(prev => prev.filter(dest => dest.id !== id))
          toast.success('Destination deleted successfully')
        } else {
          toast.error('Failed to delete destination')
        }
      } catch (error) {
        console.error('Error deleting destination:', error)
        toast.error('Error deleting destination')
      } finally {
        setIsDeleting(null)
      }
    }
  }

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch('/api/destinations')
        if (response.ok) {
          const data = await response.json()
          setDestinations(data)
          setFilteredDestinations(data)
        } else {
          console.error('Failed to fetch destinations')
        }
      } catch (error) {
        console.error('Error fetching destinations:', error)
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

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading destinations...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Destinations</h2>
          <p className="text-gray-600">Manage tourist destinations and attractions</p>
        </div>
        <Button asChild>
          <Link href="/admin/destinations/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Destination
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
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

      {/* Destinations Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Destinations</CardTitle>
          <CardDescription>Manage and edit destination information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Destination</th>
                  <th className="text-left p-3 font-medium">Location</th>
                  <th className="text-left p-3 font-medium">Category</th>
                  <th className="text-left p-3 font-medium">Price Range</th>
                  <th className="text-left p-3 font-medium">Rating</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDestinations.map((destination) => (
                  <tr key={destination.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-gray-500" />
                        </div>
                        <div>
                          <div className="font-medium">{destination.name}</div>
                          <div className="text-sm text-gray-600 line-clamp-2">
                            {destination.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-sm">{destination.location}</td>
                    <td className="p-3">
                      <Badge className={getCategoryColor(destination.category)}>
                        {destination.category}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={getPriceColor(destination.priceRange)}>
                        {destination.priceRange}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">{destination.rating}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/destinations/${destination.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/destinations/${destination.id}/edit`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                                                 <Button 
                           size="sm" 
                           variant="outline" 
                           className="text-red-600 hover:text-red-700"
                           onClick={() => handleDeleteDestination(destination.id)}
                           disabled={isDeleting === destination.id}
                         >
                           {isDeleting === destination.id ? (
                             <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                           ) : (
                             <Trash2 className="w-4 h-4" />
                           )}
                         </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
