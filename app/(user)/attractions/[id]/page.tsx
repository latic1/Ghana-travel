'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MapPin, Star, Calendar, ArrowLeft, Building2, Phone, Mail, Users, BookOpen } from 'lucide-react'
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
  price: number
  maxVisitors: number
  availableSlots: number
  createdAt: string
  hotels?: any[]
  reviews?: any[]
}

export default function DestinationDetailPage() {
  const params = useParams()
  const { data: session } = useSession()
  const [destination, setDestination] = useState<Destination | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [bookingData, setBookingData] = useState({
    visitDate: '',
    numberOfPeople: 1
  })

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await fetch(`/api/attractions/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setDestination(data)
        } else {
          console.error('Failed to fetch attraction')
        }
      } catch (error) {
        console.error('Error fetching attraction:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchDestination()
    }
  }, [params.id])

  const parseHighlights = (highlights: string) => {
    try {
      return JSON.parse(highlights)
    } catch {
      return []
    }
  }

  const calculateTotalPrice = () => {
    if (!destination) return 0
    return destination.price * bookingData.numberOfPeople
  }

  const handleBooking = () => {
    if (!session) {
      toast.error('Please sign in to book this attraction')
      return
    }

    if (!bookingData.visitDate) {
      toast.error('Please select a visit date')
      return
    }

    const totalPrice = calculateTotalPrice()
    
    // Redirect to checkout with booking data
    const checkoutUrl = `/checkout?type=ATTRACTION&attractionId=${destination?.id}&visitDate=${bookingData.visitDate}&numberOfPeople=${bookingData.numberOfPeople}&totalPrice=${totalPrice}`
    window.location.href = checkoutUrl
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading attraction...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!destination) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Attraction not found</h1>
          <Button asChild>
            <Link href="/attractions">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Attractions
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const totalPrice = calculateTotalPrice()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/attractions">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Attractions
          </Link>
        </Button>
      </div>

      {/* Attraction Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{destination.name}</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{destination.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="font-medium">{destination.rating}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-blue-100 text-blue-800">
              {destination.category}
            </Badge>
            <Badge className="bg-green-100 text-green-800">
              {destination.priceRange}
            </Badge>
          </div>
        </div>

        {/* Image Placeholder */}
        <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center mb-6">
          <MapPin className="w-32 h-32 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>About {destination.name}</CardTitle>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {parseHighlights(destination.highlights).map((highlight: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Hotels */}
          {destination.hotels && destination.hotels.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Nearby Accommodations</CardTitle>
                <CardDescription>Hotels and lodges in this area</CardDescription>
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
                      <Button size="sm" variant="outline">
                        View Details
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
          {/* Booking Card */}
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Book Your Visit</CardTitle>
              <CardDescription>Reserve your spot today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">
                  ${destination.price}
                </span>
                <span className="text-gray-600">per person</span>
              </div>
              
              {totalPrice > 0 && (
                <div className="flex items-center justify-between text-lg font-semibold border-t pt-3">
                  <span className="text-gray-700">Total Price:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${totalPrice}
                  </span>
                </div>
              )}
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Available Slots</span>
                  <span className="font-medium">{destination.availableSlots}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Max Visitors</span>
                  <span className="font-medium">{destination.maxVisitors}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{destination.rating}</span>
                  </div>
                </div>
              </div>

              {session ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="visitDate">Visit Date</Label>
                    <Input
                      id="visitDate"
                      type="date"
                      value={bookingData.visitDate}
                      onChange={(e) => setBookingData({ ...bookingData, visitDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numberOfPeople">Number of People</Label>
                    <Select value={bookingData.numberOfPeople.toString()} onValueChange={(value) => setBookingData({ ...bookingData, numberOfPeople: parseInt(value) })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(destination.maxVisitors)].map((_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700"
                    onClick={handleBooking}
                    disabled={!bookingData.visitDate}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Book Now
                  </Button>
                </div>
              ) : (
                <Button className="w-full" asChild>
                  <Link href="/auth/signin">
                    Sign In to Book
                  </Link>
                </Button>
              )}
              
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Free cancellation up to 24 hours before visit
                </p>
              </div>
            </CardContent>
          </Card>

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

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" size="lg">
                <Phone className="w-4 h-4 mr-2" />
                Contact Us
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
