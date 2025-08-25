'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Star, Search, Filter, Edit, Trash2, Eye, User, Building2, MapPin, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  user: {
    id: string
    name: string
    email: string
  }
  hotel?: {
    id: string
    name: string
    location: string
  }
  destination?: {
    id: string
    name: string
    location: string
  }
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDeleteReview = async (id: string) => {
    if (confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      setIsDeleting(id)
      try {
        const response = await fetch(`/api/reviews/${id}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          // Remove from local state
          setReviews(prev => prev.filter(review => review.id !== id))
          setFilteredReviews(prev => prev.filter(review => review.id !== id))
          toast.success('Review deleted successfully')
        } else {
          const error = await response.json()
          toast.error(`Failed to delete review: ${error.error}`)
        }
      } catch (error) {
        console.error('Error deleting review:', error)
        toast.error('Error deleting review')
      } finally {
        setIsDeleting(null)
      }
    }
  }

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews')
        if (response.ok) {
          const data = await response.json()
          setReviews(data)
          setFilteredReviews(data)
        } else {
          console.error('Failed to fetch reviews')
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReviews()
  }, [])

  useEffect(() => {
    let filtered = reviews

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (review.hotel?.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (review.destination?.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply rating filter
    if (ratingFilter !== 'all') {
      const rating = parseInt(ratingFilter)
      filtered = filtered.filter(review => review.rating === rating)
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      if (typeFilter === 'hotel') {
        filtered = filtered.filter(review => review.hotel)
      } else if (typeFilter === 'destination') {
        filtered = filtered.filter(review => review.destination)
      }
    }

    setFilteredReviews(filtered)
  }, [reviews, searchTerm, ratingFilter, typeFilter])

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-100 text-green-800'
    if (rating >= 3) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getReviewType = (review: Review) => {
    if (review.hotel) return 'Hotel'
    if (review.destination) return 'Destination'
    return 'Unknown'
  }

  const getReviewTarget = (review: Review) => {
    if (review.hotel) {
      return {
        name: review.hotel.name,
        location: review.hotel.location,
        type: 'hotel'
      }
    }
    if (review.destination) {
      return {
        name: review.destination.name,
        location: review.destination.location,
        type: 'destination'
      }
    }
    return null
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading reviews...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Reviews</h2>
          <p className="text-gray-600">Manage and monitor user reviews and ratings</p>
        </div>
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
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Ratings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="hotel">Hotel Reviews</SelectItem>
                <SelectItem value="destination">Destination Reviews</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-gray-600 flex items-center justify-center">
              {filteredReviews.length} of {reviews.length} reviews
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Reviews</CardTitle>
          <CardDescription>Manage and monitor user feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">User</th>
                  <th className="text-left p-3 font-medium">Rating</th>
                  <th className="text-left p-3 font-medium">Review Target</th>
                  <th className="text-left p-3 font-medium">Comment</th>
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((review) => {
                  const target = getReviewTarget(review)
                  return (
                    <tr key={review.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium">{review.user.name}</div>
                            <div className="text-sm text-gray-600">{review.user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                          <Badge className={getRatingColor(review.rating)}>
                            {review.rating}/5
                          </Badge>
                        </div>
                      </td>
                      <td className="p-3">
                        {target ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {target.type === 'hotel' ? (
                                <Building2 className="w-4 h-4 text-blue-600" />
                              ) : (
                                <MapPin className="w-4 h-4 text-green-600" />
                              )}
                              <span className="font-medium">{target.name}</span>
                            </div>
                            <div className="text-sm text-gray-600">{target.location}</div>
                            <Badge variant="outline" className="text-xs">
                              {target.type === 'hotel' ? 'Hotel' : 'Destination'}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-gray-400">Unknown</span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="max-w-xs">
                          {review.comment ? (
                            <div className="flex items-start gap-2">
                              <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-gray-700 line-clamp-2">
                                {review.comment}
                              </p>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">No comment</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {formatDate(review.createdAt)}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/admin/reviews/${review.id}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/admin/reviews/${review.id}/edit`}>
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteReview(review.id)}
                            disabled={isDeleting === review.id}
                          >
                            {isDeleting === review.id ? (
                              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
