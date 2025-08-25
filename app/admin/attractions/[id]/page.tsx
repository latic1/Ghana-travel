'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Star, Calendar, ArrowLeft, Building2, Edit, Trash2 } from 'lucide-react'
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
  hotels?: any[]
  reviews?: any[]
}

export default function ViewDestinationPage() {
  const params = useParams()
  const [destination, setDestination] = useState<Destination | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await fetch(`/api/destinations/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setDestination(data)
        } else {
          toast.error('Failed to fetch destination')
        }
      } catch (error) {
        console.error('Error fetching destination:', error)
        toast.error('Error fetching destination')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchDestination()
    }
  }, [params.id])

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this destination? This action cannot be undone.')) {
      setIsDeleting(true)
      try {
        const response = await fetch(`/api/destinations/${params.id}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          toast.success('Destination deleted successfully')
          // Redirect back to destinations list
          window.location.href = '/admin/destinations'
        } else {
          toast.error('Failed to delete destination')
        }
      } catch (error) {
        console.error('Error deleting destination:', error)
        toast.error('Error deleting destination')
      } finally {
        setIsDeleting(false)
      }
    }
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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading destination...</p>
        </div>
      </div>
    )
  }

  if (!destination) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Destination not found</h3>
        <Button asChild>
          <Link href="/admin/destinations">Back to Destinations</Link>
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
            <Link href="/admin/destinations">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Destinations
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{destination.name}</h2>
            <p className="text-gray-600">Destination details and information</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/admin/destinations/${destination.id}/edit`}>
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
                  <p className="text-gray-900">{destination.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Location</label>
                  <p className="text-gray-900">{destination.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Category</label>
                  <Badge className="bg-blue-100 text-blue-800">{destination.category}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Price Range</label>
                  <Badge className="bg-green-100 text-green-800">{destination.priceRange}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Rating</label>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{destination.rating}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-gray-900">{new Date(destination.createdAt).toLocaleDateString()}</p>
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
              <p className="text-gray-700 leading-relaxed">{destination.description}</p>
            </CardContent>
          </Card>

          {/* Highlights */}
          <Card>
            <CardHeader>
              <CardTitle>Highlights & Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {parseHighlights(destination.highlights).map((highlight: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {highlight}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Hotels */}
          {destination.hotels && destination.hotels.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Nearby Hotels</CardTitle>
                <CardDescription>Accommodations in this area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {destination.hotels.map((hotel: any) => (
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
              {destination.bestTimeToVisit && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-sm">Best Time to Visit</p>
                    <p className="text-sm text-gray-600">{destination.bestTimeToVisit}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">Location</p>
                  <p className="text-sm text-gray-600">{destination.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">Rating</p>
                  <p className="text-sm text-gray-600">{destination.rating} out of 5</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Image Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <MapPin className="w-16 h-16 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">
                {destination.imageUrl || 'No image available'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
