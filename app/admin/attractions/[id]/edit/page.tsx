'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
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

export default function EditDestinationPage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [destination, setDestination] = useState<Destination | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    category: '',
    imageUrl: '',
    rating: 0,
    priceRange: '',
    bestTimeToVisit: '',
    highlights: ''
  })

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await fetch(`/api/destinations/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setDestination(data)
          setFormData({
            name: data.name,
            description: data.description,
            location: data.location,
            category: data.category,
            imageUrl: data.imageUrl,
            rating: data.rating,
            priceRange: data.priceRange,
            bestTimeToVisit: data.bestTimeToVisit || '',
            highlights: data.highlights ? JSON.parse(data.highlights).join(', ') : ''
          })
        } else {
          toast.error('Failed to fetch destination')
          router.push('/admin/destinations')
        }
      } catch (error) {
        console.error('Error fetching destination:', error)
        toast.error('Error fetching destination')
        router.push('/admin/destinations')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchDestination()
    }
  }, [params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/destinations/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          highlights: `["${formData.highlights.split(',').map(h => h.trim()).join('","')}"]`
        }),
      })

      if (response.ok) {
        toast.success('Destination updated successfully!')
        router.push('/admin/destinations')
      } else {
        const error = await response.json()
        toast.error(`Failed to update destination: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating destination:', error)
      toast.error('Error updating destination')
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
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/destinations">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Destinations
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Edit Destination</h2>
          <p className="text-gray-600">Update destination information</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Destination: {destination.name}</CardTitle>
          <CardDescription>Update the destination details</CardDescription>
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
                  placeholder="e.g., Cape Coast Castle"
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
                  placeholder="e.g., Cape Coast, Central Region"
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
                    <SelectItem value="HISTORIC">Historic</SelectItem>
                    <SelectItem value="NATURAL">Natural</SelectItem>
                    <SelectItem value="CULTURAL">Cultural</SelectItem>
                    <SelectItem value="ADVENTURE">Adventure</SelectItem>
                    <SelectItem value="BEACH">Beach</SelectItem>
                    <SelectItem value="WILDLIFE">Wildlife</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <Label htmlFor="priceRange">Price Range *</Label>
                <Select value={formData.priceRange} onValueChange={(value) => handleInputChange('priceRange', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select price range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BUDGET">Budget</SelectItem>
                    <SelectItem value="MODERATE">Moderate</SelectItem>
                    <SelectItem value="LUXURY">Luxury</SelectItem>
                    <SelectItem value="PREMIUM">Premium</SelectItem>
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

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  placeholder="e.g., /images/destination.jpg"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the destination..."
                rows={4}
                required
              />
            </div>

            {/* Best Time to Visit */}
            <div className="space-y-2">
              <Label htmlFor="bestTimeToVisit">Best Time to Visit</Label>
              <Input
                id="bestTimeToVisit"
                value={formData.bestTimeToVisit}
                onChange={(e) => handleInputChange('bestTimeToVisit', e.target.value)}
                placeholder="e.g., June to August (Dry season)"
              />
            </div>

            {/* Highlights */}
            <div className="space-y-2">
              <Label htmlFor="highlights">Highlights</Label>
              <Input
                id="highlights"
                value={formData.highlights}
                onChange={(e) => handleInputChange('highlights', e.target.value)}
                placeholder="e.g., Historical significance, Ocean views, Guided tours (comma separated)"
              />
              <p className="text-sm text-gray-500">Enter highlights separated by commas</p>
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
                    Update Destination
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/destinations">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
