'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, Building2, MapPin, MessageSquare, MessageCircle, Edit } from 'lucide-react'
import Link from 'next/link'

interface UserReview {
  id: string
  rating: number
  comment: string
  createdAt: string
  hotel?: {
    id: string
    name: string
    location: string
    imageUrl: string
  }
  destination?: {
    id: string
    name: string
    location: string
    imageUrl: string
  }
}

export default function UserReviewsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [reviews, setReviews] = useState<UserReview[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchUserReviews()
    }
  }, [session])

  const fetchUserReviews = async () => {
    try {
      const response = await fetch('/api/user/reviews')
      if (response.ok) {
        const data = await response.json()
        setReviews(data)
      } else {
        console.error('Failed to fetch reviews')
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-100 text-green-800'
    if (rating >= 3) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getReviewTarget = (review: UserReview) => {
    if (review.hotel) {
      return {
        name: review.hotel.name,
        location: review.hotel.location,
        type: 'hotel',
        id: review.hotel.id,
        imageUrl: review.hotel.imageUrl
      }
    }
    if (review.destination) {
      return {
        name: review.destination.name,
        location: review.destination.location,
        type: 'destination',
        id: review.destination.id,
        imageUrl: review.destination.imageUrl
      }
    }
    return null
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Please sign in</h3>
          <Button asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
            <p className="text-gray-600">View and manage your reviews and ratings</p>
          </div>
          <Button asChild className="bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700">
            <Link href="/destinations">
              <MapPin className="w-4 h-4 mr-2" />
              Explore Destinations
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your reviews...</p>
            </div>
          </div>
        ) : reviews.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-600 mb-4">Start exploring destinations and hotels to leave your first review!</p>
                <div className="flex gap-3 justify-center">
                  <Button asChild variant="outline">
                    <Link href="/destinations">
                      <MapPin className="w-4 h-4 mr-2" />
                      Browse Destinations
                    </Link>
                  </Button>
                  <Button asChild className="bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700">
                    <Link href="/hotels">
                      <Building2 className="w-4 h-4 mr-2" />
                      Find Hotels
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reviews.map((review) => {
              const target = getReviewTarget(review)
              if (!target) return null

              return (
                <Card key={review.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                        <Badge variant="outline">
                          {target.type === 'hotel' ? 'Hotel Review' : 'Destination Review'}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Review Target Info */}
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          {target.type === 'hotel' ? (
                            <Building2 className="w-8 h-8 text-gray-600" />
                          ) : (
                            <MapPin className="w-8 h-8 text-gray-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{target.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                            <MapPin className="w-3 h-3" />
                            {target.location}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {target.type === 'hotel' ? 'Hotel' : 'Destination'}
                          </Badge>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-3 py-3 border-t border-gray-100">
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                        <Badge className={getRatingColor(review.rating)}>
                          {review.rating}/5 Stars
                        </Badge>
                      </div>

                      {/* Comment */}
                      {review.comment && (
                        <div className="pt-3 border-t border-gray-100">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-gray-700 mb-2">Your Review:</p>
                              <p className="text-gray-900 italic">&ldquo;{review.comment}&rdquo;</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-3 border-t border-gray-100">
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <Link href={target.type === 'hotel' ? `/hotels/${target.id}` : `/destinations/${target.id}`}>
                            {target.type === 'hotel' ? (
                              <>
                                <Building2 className="w-4 h-4 mr-2" />
                                View Hotel
                              </>
                            ) : (
                              <>
                                <MapPin className="w-4 h-4 mr-2" />
                                View Destination
                              </>
                            )}
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Review
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Review Statistics */}
        {reviews.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Review Statistics</CardTitle>
              <CardDescription>Summary of your review activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{reviews.length}</div>
                  <div className="text-sm text-gray-600">Total Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {reviews.filter(r => r.rating >= 4).length}
                  </div>
                  <div className="text-sm text-gray-600">Positive Reviews (4-5★)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {reviews.filter(r => r.rating === 3).length}
                  </div>
                  <div className="text-sm text-gray-600">Neutral Reviews (3★)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {reviews.filter(r => r.rating <= 2).length}
                  </div>
                  <div className="text-sm text-gray-600">Critical Reviews (1-2★)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
