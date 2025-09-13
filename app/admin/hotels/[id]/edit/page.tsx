'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import ImageUpload from '@/components/ImageUpload'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface Hotel {
  id: string
  name: string
  description: string
  location: string
  category: string
  images: string
  rating: number
  pricePerNight: number
  amenities: string
  availableRooms: number
  createdAt: string
}

export default function EditHotelPage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    category: '',
    images: '',
    rating: 0,
    pricePerNight: 0,
    amenities: '',
    availableRooms: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch hotel data
        const hotelResponse = await fetch(`/api/hotels/${params.id}`)
        if (hotelResponse.ok) {
          const hotelData = await hotelResponse.json()
          setHotel(hotelData)
          setFormData({
            name: hotelData.name,
            description: hotelData.description,
            location: hotelData.location,
            category: hotelData.category,
            images: hotelData.images,
            rating: hotelData.rating,
            pricePerNight: hotelData.pricePerNight,
            amenities: hotelData.amenities ? JSON.parse(hotelData.amenities).join(', ') : '',
            availableRooms: hotelData.availableRooms,
          })
        } else {
          toast.error('Failed to fetch hotel')
          router.push('/admin/hotels')
        }

      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Error fetching data')
        router.push('/admin/hotels')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchData()
    }
  }, [params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/hotels/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amenities: `["${formData.amenities.split(',').map(h => h.trim()).join('","')}"]`
        }),
      })

      if (response.ok) {
        toast.success('Hotel updated successfully!')
        router.push('/admin/hotels')
      } else {
        const error = await response.json()
        toast.error(`Failed to update hotel: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating hotel:', error)
      toast.error('Error updating hotel')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/hotels">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hotels
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Edit Hotel</h2>
          <p className="text-gray-600">Update hotel information</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Hotel: {hotel.name}</CardTitle>
          <CardDescription>Update the hotel details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Oceanview Resort Accra"
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Accra, Greater Accra Region"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LUXURY">Luxury</SelectItem>
                    <SelectItem value="BOUTIQUE">Boutique</SelectItem>
                    <SelectItem value="ECO_FRIENDLY">Eco-Friendly</SelectItem>
                    <SelectItem value="BUDGET">Budget</SelectItem>
                    <SelectItem value="RESORT">Resort</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => handleInputChange('rating', parseFloat(e.target.value) || 0)}
                  placeholder="0.0"
                />
              </div>

              {/* Price Per Night */}
              <div className="space-y-2">
                <Label htmlFor="pricePerNight">Price Per Night *</Label>
                <Input
                  id="pricePerNight"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.pricePerNight}
                  onChange={(e) => handleInputChange('pricePerNight', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  required
                />
              </div>

              {/* Available Rooms */}
              <div className="space-y-2">
                <Label htmlFor="availableRooms">Available Rooms</Label>
                <Input
                  id="availableRooms"
                  type="number"
                  min="0"
                  value={formData.availableRooms}
                  onChange={(e) => handleInputChange('availableRooms', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>

              {/* Image Upload */}
              <ImageUpload
                value={formData.images}
                onChange={(value) => handleInputChange('images', value as string)}
                multiple={false}
                folder="hotels"
                label="Hotel Image"
                description="Upload a main image for this hotel"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the hotel..."
                rows={4}
                required
              />
            </div>

            {/* Amenities */}
            <div className="space-y-2">
              <Label htmlFor="amenities">Amenities</Label>
              <Input
                id="amenities"
                value={formData.amenities}
                onChange={(e) => handleInputChange('amenities', e.target.value)}
                placeholder="e.g., Pool, WiFi, Restaurant, Spa (comma separated)"
              />
              <p className="text-sm text-gray-500">Enter amenities separated by commas</p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Hotel
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/hotels">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
