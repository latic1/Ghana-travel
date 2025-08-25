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
import { MapPin, Star, Building2, Bed, DollarSign, ArrowLeft, Calendar, Phone, Mail, Users } from 'lucide-react'
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
  createdAt: string
  reviews?: any[]
}

export default function HotelDetailPage() {
  const params = useParams()
  const { data: session } = useSession()
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    numberOfGuests: 1,
    numberOfRooms: 1
  })


  // Calculate total price based on booking data
  const calculateTotalPrice = () => {
    if (!hotel || !bookingData.checkIn || !bookingData.checkOut) return 0
    
    const checkIn = new Date(bookingData.checkIn)
    const checkOut = new Date(bookingData.checkOut)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    
    return hotel.pricePerNight * nights * bookingData.numberOfRooms
  }

  const totalPrice = calculateTotalPrice()

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

  const handleBooking = async () => {
    if (!session) {
      toast.error('Please sign in to book this hotel')
      return
    }

    if (!hotel) return

    if (!bookingData.checkIn || !bookingData.checkOut) {
      toast.error('Please select check-in and check-out dates')
      return
    }

    const totalPrice = calculateTotalPrice()
    
    // Redirect to checkout with booking data
    const checkoutUrl = `/checkout?type=HOTEL&hotelId=${hotel.id}&checkIn=${bookingData.checkIn}&checkOut=${bookingData.checkOut}&numberOfGuests=${bookingData.numberOfGuests}&numberOfRooms=${bookingData.numberOfRooms}&totalPrice=${totalPrice}`
    window.location.href = checkoutUrl
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading hotel...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!hotel) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Hotel not found</h3>
          <Button asChild>
            <Link href="/hotels">Back to Hotels</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/hotels">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hotels
          </Link>
          </Button>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">{hotel.name}</h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">{hotel.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="font-medium">{hotel.rating}</span>
            </div>
            <Badge className="bg-blue-100 text-blue-800">{hotel.category}</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Image */}
          <Card className="overflow-hidden">
            <div className="h-96 bg-gray-200 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Building2 className="w-24 h-24 text-gray-400" />
              </div>
              <div className="absolute top-4 right-4">
                <Badge className="bg-white text-gray-900 shadow-lg">
                  ${hotel.pricePerNight}/night
                </Badge>
              </div>
            </div>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>About This Hotel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed text-lg">{hotel.description}</p>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Amenities & Features</CardTitle>
              <CardDescription>Everything you need for a comfortable stay</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {parseAmenities(hotel.amenities).map((amenity: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          {hotel.reviews && hotel.reviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Guest Reviews</CardTitle>
                <CardDescription>What our guests say about their stay</CardDescription>
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

          {/* Location & Nearby */}
          <Card>
            <CardHeader>
              <CardTitle>Location & Nearby</CardTitle>
              <CardDescription>Explore the surrounding area</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium">{hotel.location}</p>
                  </div>
                </div>
                <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                  <MapPin className="w-16 h-16 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Interactive map coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Booking Card */}
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Book Your Stay</CardTitle>
              <CardDescription>Reserve your room today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">
                  ${hotel.pricePerNight}
                </span>
                <span className="text-gray-600">per night</span>
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
                  <span className="text-gray-600">Available Rooms</span>
                  <span className="font-medium">{hotel.availableRooms}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{hotel.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Category</span>
                  <Badge variant="outline">{hotel.category}</Badge>
                </div>
              </div>

              {session ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="checkIn">Check-in</Label>
                      <Input
                        id="checkIn"
                        type="date"
                        value={bookingData.checkIn}
                        onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <Label htmlFor="checkOut">Check-out</Label>
                      <Input
                        id="checkOut"
                        type="date"
                        value={bookingData.checkOut}
                        onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                        min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="guests">Guests</Label>
                      <Select value={bookingData.numberOfGuests.toString()} onValueChange={(value) => setBookingData({ ...bookingData, numberOfGuests: parseInt(value) })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(6)].map((_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="rooms">Rooms</Label>
                      <Select value={bookingData.numberOfRooms.toString()} onValueChange={(value) => setBookingData({ ...bookingData, numberOfRooms: parseInt(value) })}>
                        <SelectTrigger>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(5)].map((_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700"
                    onClick={handleBooking}
                    disabled={!bookingData.checkIn || !bookingData.checkOut}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Proceed to Checkout
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
                  Free cancellation up to 24 hours before check-in
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

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">Phone</p>
                  <p className="text-sm text-gray-600">+233 XX XXX XXXX</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">Email</p>
                  <p className="text-sm text-gray-600">info@{hotel.name.toLowerCase().replace(/\s+/g, '')}.com</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
