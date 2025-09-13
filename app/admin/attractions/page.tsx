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

interface Attraction {
  id: string
  name: string
  description: string
  location: string
  category: {
    id: string
    name: string
    description?: string
    color?: string
    createdAt: string
    updatedAt: string
  }
  images: string
  rating: number
  price: number
  duration: string
  maxVisitors: number
  availableSlots: number
  createdAt: string
}

interface AttractionCategory {
  id: string
  name: string
  color?: string
}

export default function AttractionsPage() {
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [filteredAttractions, setFilteredAttractions] = useState<Attraction[]>([])
  const [categories, setCategories] = useState<AttractionCategory[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [priceFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDeleteAttraction = async (id: string) => {
    if (confirm('Are you sure you want to delete this attraction? This action cannot be undone.')) {
      setIsDeleting(id)
      try {
        const response = await fetch(`/api/attractions/${id}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          // Remove from local state
          setAttractions(prev => prev.filter(attraction => attraction.id !== id))
          setFilteredAttractions(prev => prev.filter(attraction => attraction.id !== id))
          toast.success('Attraction deleted successfully')
        } else {
          toast.error('Failed to delete attraction')
        }
      } catch (error) {
        console.error('Error deleting attraction:', error)
        toast.error('Error deleting attraction')
      } finally {
        setIsDeleting(null)
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch attractions and categories in parallel
        const [attractionsResponse, categoriesResponse] = await Promise.all([
          fetch('/api/attractions'),
          fetch('/api/attraction-categories')
        ])

        if (attractionsResponse.ok) {
          const attractionsData = await attractionsResponse.json()
          setAttractions(attractionsData)
          setFilteredAttractions(attractionsData)
        } else {
          console.error('Failed to fetch attractions')
        }

        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          setCategories(categoriesData)
        } else {
          console.error('Failed to fetch categories')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    let filtered = attractions

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(attraction =>
        attraction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attraction.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attraction.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(attraction => attraction.category.name === categoryFilter)
    }

    // Apply price filter (we'll remove this for now since we changed to numeric price)
    // if (priceFilter !== 'all') {
    //   filtered = filtered.filter(attraction => attraction.priceRange === priceFilter)
    // }

    setFilteredAttractions(filtered)
  }, [attractions, searchTerm, categoryFilter, priceFilter])

  const getCategoryColor = (category: { name: string; color?: string }) => {
    // Use the category's color if available, otherwise use default colors
    if (category.color) {
      return `bg-[${category.color}]/10 text-[${category.color}]`
    }
    
    const colors: { [key: string]: string } = {
      HISTORIC: 'bg-blue-100 text-blue-800',
      NATURAL: 'bg-green-100 text-green-800',
      CULTURAL: 'bg-purple-100 text-purple-800',
      ADVENTURE: 'bg-orange-100 text-orange-800',
      BEACH: 'bg-cyan-100 text-cyan-800',
      WILDLIFE: 'bg-brown-100 text-brown-800'
    }
    return colors[category.name] || 'bg-gray-100 text-gray-800'
  }


  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading attractions...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Attractions</h2>
          <p className="text-gray-600">Manage tourist attractions and destinations</p>
        </div>
        <Button asChild>
          <Link href="/admin/attractions/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Attraction
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search attractions..."
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
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    <div className="flex items-center gap-2">
                      {category.color && (
                        <div 
                          className="w-3 h-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: category.color }}
                        />
                      )}
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="text-sm text-gray-600 flex items-center justify-center">
              {filteredAttractions.length} of {attractions.length} attractions
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Destinations Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Attractions</CardTitle>
          <CardDescription>Manage and edit attraction information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Attraction</th>
                  <th className="text-left p-3 font-medium">Location</th>
                  <th className="text-left p-3 font-medium">Category</th>
                  <th className="text-left p-3 font-medium">Price</th>
                  <th className="text-left p-3 font-medium">Rating</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttractions.map((attraction) => (
                  <tr key={attraction.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-gray-500" />
                        </div>
                        <div>
                          <div className="font-medium">{attraction.name}</div>
                          <div className="text-sm text-gray-600 line-clamp-2">
                            {attraction.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-sm">{attraction.location}</td>
                    <td className="p-3">
                      <Badge className={getCategoryColor(attraction.category)}>
                        {attraction.category.name}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <span className="text-green-600 font-medium">₵{attraction.price.toLocaleString()}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">{attraction.rating}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/attractions/${attraction.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/attractions/${attraction.id}/edit`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                                                 <Button 
                           size="sm" 
                           variant="outline" 
                           className="text-red-600 hover:text-red-700"
                           onClick={() => handleDeleteAttraction(attraction.id)}
                           disabled={isDeleting === attraction.id}
                         >
                           {isDeleting === attraction.id ? (
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
