'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Star, Calendar, ArrowLeft, Building2, Edit, Trash2 } from 'lucide-react'
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
  hotels?: {
    id: string
    name: string
    description: string
    location: string
    images: string
    rating: number
    pricePerNight: number
  }[]
  reviews?: {
    id: string
    rating: number
    comment: string
    user: {
      name: string
    }
    createdAt: string
  }[]
}

export default function ViewAttractionPage() {
  const params = useParams()
  const [attraction, setAttraction] = useState<Attraction | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchAttraction = async () => {
      try {
        const response = await fetch(`/api/attractions/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setAttraction(data)
        } else {
          toast.error('Failed to fetch attraction')
        }
      } catch (error) {
        console.error('Error fetching attraction:', error)
        toast.error('Error fetching attraction')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchAttraction()
    }
  }, [params.id])

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this attraction? This action cannot be undone.')) {
      setIsDeleting(true)
      try {
        const response = await fetch(`/api/attractions/${params.id}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          toast.success('Attraction deleted successfully')
          // Redirect back to attractions list
          window.location.href = '/admin/attractions'
        } else {
          toast.error('Failed to delete attraction')
        }
      } catch (error) {
        console.error('Error deleting attraction:', error)
        toast.error('Error deleting attraction')
      } finally {
        setIsDeleting(false)
      }
    }
  }


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading attraction...</p>
        </div>
      </div>
    )
  }

  if (!attraction) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Attraction not found</h3>
        <Button asChild>
          <Link href="/admin/attractions">Back to Attractions</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/attractions">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Attractions
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{attraction.name}</h2>
            <p className="text-gray-600">Attraction details and information</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/admin/attractions/${attraction.id}/edit`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900">{attraction.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Location</label>
                  <p className="text-gray-900">{attraction.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Category</label>
                  <Badge className="bg-blue-100 text-blue-800">{attraction.category?.name || 'No category'}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Price</label>
                  <span className="text-green-600 font-medium">₦{attraction.price?.toLocaleString() || '0'}</span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Duration</label>
                  <p className="text-gray-900">{attraction.duration || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Max Visitors</label>
                  <p className="text-gray-900">{attraction.maxVisitors || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Available Slots</label>
                  <p className="text-gray-900">{attraction.availableSlots || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Rating</label>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{attraction.rating}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-gray-900">{new Date(attraction.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{attraction.description}</p>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Duration</label>
                  <p className="text-gray-900">{attraction.duration}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Capacity</label>
                  <p className="text-gray-900">{attraction.maxVisitors} visitors max</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Available Slots</label>
                  <p className="text-gray-900">{attraction.availableSlots} slots available</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Price</label>
                  <p className="text-green-600 font-medium text-lg">₦{attraction.price.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hotels */}
          {attraction.hotels && attraction.hotels.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Nearby Hotels</CardTitle>
                <CardDescription>Accommodations in this area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attraction.hotels.map((hotel) => (
                    <div key={hotel.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{hotel.name}</h4>
                        <p className="text-sm text-gray-600">{hotel.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            {hotel.rating}
                          </span>
                          <span className="text-green-600 font-medium">${hotel.pricePerNight}/night</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">Location</p>
                  <p className="text-sm text-gray-600">{attraction.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">Rating</p>
                  <p className="text-sm text-gray-600">{attraction.rating} out of 5</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">Duration</p>
                  <p className="text-sm text-gray-600">{attraction.duration}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xs font-bold">₦</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Price</p>
                  <p className="text-sm text-gray-600">₦{attraction.price.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Image Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <MapPin className="w-16 h-16 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">
                {attraction.images || 'No images available'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
