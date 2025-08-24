'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, Building2, MapPin, DollarSign, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface UserBooking {
  id: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  status: string
  createdAt: string
  hotel: {
    id: string
    name: string
    location: string
    imageUrl: string
    destination: {
      id: string
      name: string
    }
  }
}

export default function UserBookingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState<UserBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchUserBookings()
    }
  }, [session])

  const fetchUserBookings = async () => {
    try {
      const response = await fetch('/api/user/bookings')
      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      } else {
        console.error('Failed to fetch bookings')
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      COMPLETED: 'bg-blue-100 text-blue-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />
      case 'CONFIRMED':
        return <Calendar className="w-4 h-4" />
      case 'CANCELLED':
        return <AlertCircle className="w-4 h-4" />
      case 'COMPLETED':
        return <Calendar className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const calculateNights = (checkIn: string, checkOut: string) => {
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bookings...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600">View and manage your hotel reservations</p>
          </div>
          <Button asChild className="bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700">
            <Link href="/hotels">
              <Building2 className="w-4 h-4 mr-2" />
              Book New Hotel
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your bookings...</p>
            </div>
          </div>
        ) : bookings.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-600 mb-4">Start exploring destinations and book your first hotel stay!</p>
                <Button asChild className="bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700">
                  <Link href="/hotels">
                    <Building2 className="w-4 h-4 mr-2" />
                    Browse Hotels
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(booking.status)}
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      Booked {formatDate(booking.createdAt)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Hotel Info */}
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-8 h-8 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{booking.hotel.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                          <MapPin className="w-3 h-3" />
                          {booking.hotel.location}
                        </div>
                        {booking.hotel.destination && (
                          <p className="text-sm text-gray-500">
                            {booking.hotel.destination.name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-100">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">Check-in:</span>
                          <span>{formatDate(booking.checkIn)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">Check-out:</span>
                          <span>{formatDate(booking.checkOut)}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">Guests:</span>
                          <span>{booking.guests}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">Total:</span>
                          <span className="font-semibold">${booking.totalPrice}</span>
                        </div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {calculateNights(booking.checkIn, booking.checkOut)} nights
                        </span>
                        <span className="text-gray-600">
                          ${(booking.totalPrice / calculateNights(booking.checkIn, booking.checkOut)).toFixed(2)}/night
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/hotels/${booking.hotel.id}`}>
                          <Building2 className="w-4 h-4 mr-2" />
                          View Hotel
                        </Link>
                      </Button>
                      {booking.status === 'PENDING' && (
                        <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700">
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
