'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Filter, Edit, Trash2, Eye, Palette } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface AttractionCategory {
  id: string
  name: string
  description?: string
  color?: string
  createdAt: string
  _count: {
    attractions: number
  }
}

export default function AttractionCategoriesPage() {
  const [categories, setCategories] = useState<AttractionCategory[]>([])
  const [filteredCategories, setFilteredCategories] = useState<AttractionCategory[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      setIsDeleting(id)
      try {
        const response = await fetch(`/api/attraction-categories/${id}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          // Remove from local state
          setCategories(prev => prev.filter(cat => cat.id !== id))
          setFilteredCategories(prev => prev.filter(cat => cat.id !== id))
          toast.success('Category deleted successfully')
        } else {
          const error = await response.json()
          toast.error(error.error || 'Failed to delete category')
        }
      } catch (error) {
        console.error('Error deleting category:', error)
        toast.error('Error deleting category')
      } finally {
        setIsDeleting(null)
      }
    }
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/attraction-categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
          setFilteredCategories(data)
        } else {
          console.error('Failed to fetch categories')
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    let filtered = categories

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredCategories(filtered)
  }, [categories, searchTerm])

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading categories...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Attraction Categories</h2>
          <p className="text-gray-600">Manage attraction categories and types</p>
        </div>
        <Button asChild>
          <Link href="/admin/attraction-categories/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Search Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="text-sm text-gray-600 flex items-center justify-center">
              {filteredCategories.length} of {categories.length} categories
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {category.color && (
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: category.color }}
                    />
                  )}
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </div>
                <Badge variant="outline">
                  {category._count.attractions} attractions
                </Badge>
              </div>
              {category.description && (
                <CardDescription className="mt-2">
                  {category.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Created {new Date(category.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/admin/attraction-categories/${category.id}`}>
                      <Eye className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/admin/attraction-categories/${category.id}/edit`}>
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteCategory(category.id)}
                    disabled={isDeleting === category.id}
                  >
                    {isDeleting === category.id ? (
                      <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first attraction category.'}
            </p>
            {!searchTerm && (
              <Button asChild>
                <Link href="/admin/attraction-categories/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
