'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface FormData {
  name: string
  description: string
  location: string
  categoryId: string
  images: string
  rating: number
  price: number
  duration: string
  maxVisitors: number
  availableSlots: number
}

interface AttractionCategory {
  id: string
  name: string
  color?: string
}

interface ValidationErrors {
  [key: string]: string
}

export default function NewAttractionPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [categories, setCategories] = useState<AttractionCategory[]>([])
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    location: '',
    categoryId: '',
    images: '',
    rating: 0,
    price: 0,
    duration: '',
    maxVisitors: 0,
    availableSlots: 0
  })

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters long'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required'
    }

    if (!formData.images.trim()) {
      newErrors.images = 'Images are required'
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be a positive number'
    }

    if (!formData.duration.trim()) {
      newErrors.duration = 'Duration is required'
    }

    if (!formData.maxVisitors || formData.maxVisitors <= 0) {
      newErrors.maxVisitors = 'Max visitors must be a positive number'
    }

    if (!formData.availableSlots || formData.availableSlots <= 0) {
      newErrors.availableSlots = 'Available slots must be a positive number'
    }

    if (formData.availableSlots > formData.maxVisitors) {
      newErrors.availableSlots = 'Available slots cannot exceed max visitors'
    }

    if (formData.rating < 0 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 0 and 5'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the validation errors')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/attractions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          images: formData.images ? `["${formData.images}"]` : '[]'
        }),
      })

      if (response.ok) {
        toast.success('Attraction created successfully!')
        router.push('/admin/attractions')
      } else {
        const error = await response.json()
        toast.error(`Failed to create attraction: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating attraction:', error)
      toast.error('Error creating attraction')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/attraction-categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        } else {
          console.error('Failed to fetch categories')
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  const getInputClassName = (field: string) => {
    return `w-full ${errors[field] ? 'border-red-500 focus:border-red-500' : ''}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/attractions">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Destinations
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Add New Attraction</h2>
          <p className="text-gray-600">Create a new tourist attraction</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Attraction Information</CardTitle>
          <CardDescription>Fill in the details for the new attraction</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  className={getInputClassName('name')}
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Cape Coast Castle"
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  className={getInputClassName('location')}
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Cape Coast, Central Region"
                />
                {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="categoryId">Category *</Label>
                <Select value={formData.categoryId} onValueChange={(value) => handleInputChange('categoryId', value)}>
                  <SelectTrigger className={getInputClassName('categoryId')}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
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
                {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId}</p>}
                {categories.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No categories available. <Link href="/admin/attraction-categories/new" className="text-blue-600 hover:underline">Create one first</Link>.
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Price (NGN) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  className={getInputClassName('price')}
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  placeholder="e.g., 5000"
                />
                {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
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
                  className={getInputClassName('rating')}
                  value={formData.rating}
                  onChange={(e) => handleInputChange('rating', parseFloat(e.target.value) || 0)}
                  placeholder="0.0"
                />
                {errors.rating && <p className="text-sm text-red-500">{errors.rating}</p>}
              </div>

              {/* Images */}
              <div className="space-y-2">
                <Label htmlFor="images">Image URL *</Label>
                <Input
                  id="images"
                  className={getInputClassName('images')}
                  value={formData.images}
                  onChange={(e) => handleInputChange('images', e.target.value)}
                  placeholder="e.g., /images/attraction.jpg"
                />
                {errors.images && <p className="text-sm text-red-500">{errors.images}</p>}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                className={getInputClassName('description')}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the attraction..."
                rows={4}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duration *</Label>
              <Input
                id="duration"
                className={getInputClassName('duration')}
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="e.g., 2 hours, Half day, Full day"
              />
              {errors.duration && <p className="text-sm text-red-500">{errors.duration}</p>}
            </div>

            {/* Max Visitors */}
            <div className="space-y-2">
              <Label htmlFor="maxVisitors">Max Visitors *</Label>
              <Input
                id="maxVisitors"
                type="number"
                min="1"
                className={getInputClassName('maxVisitors')}
                value={formData.maxVisitors}
                onChange={(e) => handleInputChange('maxVisitors', parseInt(e.target.value) || 0)}
                placeholder="e.g., 50"
              />
              {errors.maxVisitors && <p className="text-sm text-red-500">{errors.maxVisitors}</p>}
            </div>

            {/* Available Slots */}
            <div className="space-y-2">
              <Label htmlFor="availableSlots">Available Slots *</Label>
              <Input
                id="availableSlots"
                type="number"
                min="1"
                className={getInputClassName('availableSlots')}
                value={formData.availableSlots}
                onChange={(e) => handleInputChange('availableSlots', parseInt(e.target.value) || 0)}
                placeholder="e.g., 30"
              />
              {errors.availableSlots && <p className="text-sm text-red-500">{errors.availableSlots}</p>}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Attraction
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/attractions">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
