'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Star, Building2, Edit, Trash2, Bed, DollarSign, ArrowLeft } from 'lucide-react'
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
  createdAt: string
  destination?: {
    name: string
  }
  reviews?: any[]
}

export default function ViewHotelPage() {
  const params = useParams()
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await fetch(`/api/hotels/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setHotel(data)
        } else {
          toast.error('Failed to fetch hotel')
        }
      } catch (error) {
        console.error('Error fetching hotel:', error)
        toast.error('Error fetching hotel')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchHotel()
    }
  }, [params.id])

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this hotel? This action cannot be undone.')) {
      setIsDeleting(true)
      try {
        const response = await fetch(`/api/hotels/${params.id}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          toast.success('Hotel deleted successfully')
          // Redirect back to hotels list
          window.location.href = '/admin/hotels'
        } else {
          toast.error('Failed to delete hotel')
        }
      } catch (error) {
        console.error('Error deleting hotel:', error)
        toast.error('Error deleting hotel')
      } finally {
        setIsDeleting(false)
      }
    }
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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hotel...</p>
        </div>
      </div>
    )
  }

  if (!hotel) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Hotel not found</h3>
        <Button asChild>
          <Link href="/admin/hotels">Back to Hotels</Link>
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
            <Link href="/admin/hotels">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hotels
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{hotel.name}</h2>
            <p className="text-gray-600">Hotel details and information</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/admin/hotels/${hotel.id}/edit`}>
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
                  <p className="text-gray-900">{hotel.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Location</label>
                  <p className="text-gray-900">{hotel.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Category</label>
                  <Badge className="bg-blue-100 text-blue-800">{hotel.category}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Destination</label>
                  <p className="text-gray-900">{hotel.destination?.name || 'Unknown'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Rating</label>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{hotel.rating}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Price Per Night</label>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-medium">{hotel.pricePerNight}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Available Rooms</label>
                  <div className="flex items-center gap-1">
                    <Bed className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{hotel.availableRooms}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-gray-900">{new Date(hotel.createdAt).toLocaleDateString()}</p>
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
              <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Amenities & Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {parseAmenities(hotel.amenities).map((amenity: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          {hotel.reviews && hotel.reviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Guest Reviews</CardTitle>
                <CardDescription>Customer feedback and ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hotel.reviews.map((review: any) => (
                    <div key={review.id} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{review.rating}</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          by {review.user?.name || 'Anonymous'}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-gray-700">{review.comment}</p>
                      )}
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
                <Building2 className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">Category</p>
                  <p className="text-sm text-gray-600">{hotel.category}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">Location</p>
                  <p className="text-sm text-gray-600">{hotel.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">Rating</p>
                  <p className="text-sm text-gray-600">{hotel.rating} out of 5</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">Price Per Night</p>
                  <p className="text-sm text-gray-600">${hotel.pricePerNight}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Bed className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">Available Rooms</p>
                  <p className="text-sm text-gray-600">{hotel.availableRooms}</p>
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
                <Building2 className="w-16 h-16 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">
                {hotel.imageUrl || 'No image available'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
