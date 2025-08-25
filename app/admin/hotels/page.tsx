'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Building2, Plus, Search, Filter, Edit, Trash2, Eye, MapPin } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

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
  destinationName: string
  createdAt: string
}

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [priceFilter, setPriceFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDeleteHotel = async (id: string) => {
    if (confirm('Are you sure you want to delete this hotel? This action cannot be undone.')) {
      setIsDeleting(id)
      try {
        const response = await fetch(`/api/hotels/${id}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          // Remove from local state
          setHotels(prev => prev.filter(hotel => hotel.id !== id))
          setFilteredHotels(prev => prev.filter(hotel => hotel.id !== id))
          toast.success('Hotel deleted successfully')
        } else {
          toast.error('Failed to delete hotel')
        }
      } catch (error) {
        console.error('Error deleting hotel:', error)
        toast.error('Error deleting hotel')
      } finally {
        setIsDeleting(null)
      }
    }
  }

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
      filtered = filtered.filter(hotel => {
        if (priceFilter === 'budget') return hotel.pricePerNight <= 100
        if (priceFilter === 'moderate') return hotel.pricePerNight > 100 && hotel.pricePerNight <= 200
        if (priceFilter === 'luxury') return hotel.pricePerNight > 200
        return true
      })
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

  const getPriceRange = (price: number) => {
    if (price <= 100) return 'BUDGET'
    if (price <= 200) return 'MODERATE'
    return 'LUXURY'
  }

  const getPriceColor = (price: string) => {
    const colors: { [key: string]: string } = {
      BUDGET: 'bg-green-100 text-green-800',
      MODERATE: 'bg-yellow-100 text-yellow-800',
      LUXURY: 'bg-purple-100 text-purple-800'
    }
    return colors[price] || 'bg-gray-100 text-gray-800'
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading hotels...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Hotels</h2>
          <p className="text-gray-600">Manage accommodation options and hotels</p>
        </div>
        <Button asChild>
          <Link href="/admin/hotels/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Hotel
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
                <SelectItem value="budget">Budget ($0-100)</SelectItem>
                <SelectItem value="moderate">Moderate ($101-200)</SelectItem>
                <SelectItem value="luxury">Luxury ($200+)</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-gray-600 flex items-center justify-center">
              {filteredHotels.length} of {hotels.length} hotels
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hotels Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Hotels</CardTitle>
          <CardDescription>Manage and edit hotel information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Hotel</th>
                  <th className="text-left p-3 font-medium">Location</th>
                  <th className="text-left p-3 font-medium">Category</th>
                  <th className="text-left p-3 font-medium">Price/Night</th>
                  <th className="text-left p-3 font-medium">Rating</th>
                  <th className="text-left p-3 font-medium">Available Rooms</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHotels.map((hotel) => (
                  <tr key={hotel.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-gray-500" />
                        </div>
                        <div>
                          <div className="font-medium">{hotel.name}</div>
                          <div className="text-sm text-gray-600 line-clamp-2">
                            {hotel.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        <div>{hotel.location}</div>
                        <div className="text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {hotel.destinationName}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={getCategoryColor(hotel.category)}>
                        {hotel.category.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="font-medium">${hotel.pricePerNight}</span>
                        <Badge className={getPriceColor(getPriceRange(hotel.pricePerNight))}>
                          {getPriceRange(hotel.pricePerNight)}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">{hotel.rating}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          hotel.availableRooms > 10 ? 'bg-green-100 text-green-800' :
                          hotel.availableRooms > 0 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {hotel.availableRooms} rooms
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/hotels/${hotel.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/hotels/${hotel.id}/edit`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                                                 <Button 
                           size="sm" 
                           variant="outline" 
                           className="text-red-600 hover:text-red-700"
                           onClick={() => handleDeleteHotel(hotel.id)}
                           disabled={isDeleting === hotel.id}
                         >
                           {isDeleting === hotel.id ? (
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
