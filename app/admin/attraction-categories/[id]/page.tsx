'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Trash2, MapPin, Star, Calendar } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface AttractionCategory {
  id: string
  name: string
  description?: string
  color?: string
  createdAt: string
  attractions: Array<{
    id: string
    name: string
    location: string
    rating: number
    price: number
  }>
  _count: {
    attractions: number
  }
}

export default function ViewAttractionCategoryPage() {
  const params = useParams()
  const [category, setCategory] = useState<AttractionCategory | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/attraction-categories/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setCategory(data)
        } else {
          toast.error('Failed to fetch category')
        }
      } catch (error) {
        console.error('Error fetching category:', error)
        toast.error('Error fetching category')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchCategory()
    }
  }, [params.id])

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      setIsDeleting(true)
      try {
        const response = await fetch(`/api/attraction-categories/${params.id}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          toast.success('Category deleted successfully')
          // Redirect back to categories list
          window.location.href = '/admin/attraction-categories'
        } else {
          const error = await response.json()
          toast.error(error.error || 'Failed to delete category')
        }
      } catch (error) {
        console.error('Error deleting category:', error)
        toast.error('Error deleting category')
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
          <p className="text-gray-600">Loading category...</p>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Category not found</h3>
        <Button asChild>
          <Link href="/admin/attraction-categories">Back to Categories</Link>
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
            <Link href="/admin/attraction-categories">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Categories
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            {category.color && (
              <div 
                className="w-6 h-6 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: category.color }}
              />
            )}
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{category.name}</h2>
              <p className="text-gray-600">Category details and attractions</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/admin/attraction-categories/${category.id}/edit`}>
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
              <CardTitle>Category Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900">{category.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Color</label>
                  <div className="flex items-center gap-2">
                    {category.color && (
                      <div 
                        className="w-6 h-6 rounded border-2 border-gray-300"
                        style={{ backgroundColor: category.color }}
                      />
                    )}
                    <span className="text-gray-900">{category.color || 'No color set'}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Attractions</label>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {category._count.attractions}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-gray-900">{new Date(category.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {category.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{category.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Attractions */}
          {category.attractions && category.attractions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attractions in this Category</CardTitle>
                <CardDescription>All attractions that belong to this category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.attractions.map((attraction) => (
                    <div key={attraction.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{attraction.name}</h4>
                        <p className="text-sm text-gray-600">{attraction.location}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            {attraction.rating}
                          </span>
                          <span className="text-green-600 font-medium">₦{attraction.price.toLocaleString()}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/attractions/${attraction.id}`}>
                          View
                        </Link>
                      </Button>
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
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">Created</p>
                  <p className="text-sm text-gray-600">{new Date(category.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">Attractions</p>
                  <p className="text-sm text-gray-600">{category._count.attractions} total</p>
                </div>
              </div>

              {category.color && (
                <div className="flex items-center gap-3">
                  <div 
                    className="w-5 h-5 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: category.color }}
                  />
                  <div>
                    <p className="font-medium text-sm">Color</p>
                    <p className="text-sm text-gray-600">{category.color}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" asChild>
                <Link href={`/admin/attraction-categories/${category.id}/edit`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Category
                </Link>
              </Button>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/admin/attractions/new">
                  Add Attraction
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
