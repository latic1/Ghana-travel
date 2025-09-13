'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Search, Filter, Edit, Trash2, Eye, User, MapPin } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface Booking {
  id: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  status: string
  createdAt: string
  user: {
    id: string
    name: string
    email: string
  }
  hotel: {
    id: string
    name: string
    location: string
    destination: {
      id: string
      name: string
    }
  }
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDeleteBooking = async (id: string) => {
    if (confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      setIsDeleting(id)
      try {
        const response = await fetch(`/api/bookings/${id}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          // Remove from local state
          setBookings(prev => prev.filter(booking => booking.id !== id))
          setFilteredBookings(prev => prev.filter(booking => booking.id !== id))
          toast.success('Booking deleted successfully')
        } else {
          const error = await response.json()
          toast.error(`Failed to delete booking: ${error.error}`)
        }
      } catch (error) {
        console.error('Error deleting booking:', error)
        toast.error('Error deleting booking')
      } finally {
        setIsDeleting(null)
      }
    }
  }

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/bookings')
        if (response.ok) {
          const data = await response.json()
          setBookings(data)
          setFilteredBookings(data)
        } else {
          console.error('Failed to fetch bookings')
        }
      } catch (error) {
        console.error('Error fetching bookings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [])

  useEffect(() => {
    let filtered = bookings

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter)
    }

    setFilteredBookings(filtered)
  }, [bookings, searchTerm, statusFilter])

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      COMPLETED: 'bg-blue-100 text-blue-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
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

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading bookings...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Bookings</h2>
          <p className="text-gray-600">Manage all hotel bookings and reservations</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by user, hotel, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-gray-600 flex items-center justify-center">
              {filteredBookings.length} of {bookings.length} bookings
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>Manage and monitor hotel reservations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Guest</th>
                  <th className="text-left p-3 font-medium">Hotel & Location</th>
                  <th className="text-left p-3 font-medium">Dates</th>
                  <th className="text-left p-3 font-medium">Guests</th>
                  <th className="text-left p-3 font-medium">Total</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium">{booking.user.name}</div>
                          <div className="text-sm text-gray-600">{booking.user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        <div className="font-medium">{booking.hotel.name}</div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          {booking.hotel.location}
                        </div>
                        {booking.hotel.destination && (
                          <div className="text-xs text-gray-500">
                            {booking.hotel.destination.name}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        <div className="text-sm">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {calculateNights(booking.checkIn, booking.checkOut)} nights
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-sm">{booking.guests}</td>
                    <td className="p-3 font-medium">₵{booking.totalPrice}</td>
                    <td className="p-3">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/bookings/${booking.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/bookings/${booking.id}/edit`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteBooking(booking.id)}
                          disabled={isDeleting === booking.id}
                        >
                          {isDeleting === booking.id ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
