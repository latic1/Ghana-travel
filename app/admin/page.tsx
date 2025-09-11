'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Building2, Users, Calendar, TrendingUp } from 'lucide-react'

interface DashboardStats {
  totalAttractions: number
  totalHotels: number
  totalUsers: number
  totalBookings: number
  attractionsGrowth: number
  hotelsGrowth: number
  usersGrowth: number
  bookingsGrowth: number
}


export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAttractions: 0,
    totalHotels: 0,
    totalUsers: 0,
    totalBookings: 0,
    attractionsGrowth: 0,
    hotelsGrowth: 0,
    usersGrowth: 0,
    bookingsGrowth: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [attractionsRes, hotelsRes, usersRes, bookingsRes] = await Promise.all([
        fetch('/api/attractions'),
        fetch('/api/hotels'),
        fetch('/api/users'),
        fetch('/api/bookings')
      ])

      const attractions = attractionsRes.ok ? await attractionsRes.json() : []
      const hotels = hotelsRes.ok ? await hotelsRes.json() : []
      const users = usersRes.ok ? await usersRes.json() : []
      const bookings = bookingsRes.ok ? await bookingsRes.json() : []

      // Calculate growth (simplified - comparing current count to previous month)
      // In a real app, you'd fetch historical data for accurate growth calculation
      const attractionsGrowth = Math.floor(Math.random() * 20) + 1 // Random growth for demo
      const hotelsGrowth = Math.floor(Math.random() * 15) + 1
      const usersGrowth = Math.floor(Math.random() * 25) + 5
      const bookingsGrowth = Math.floor(Math.random() * 30) + 10

      setStats({
        totalAttractions: attractions.length,
        totalHotels: hotels.length,
        totalUsers: users.length,
        totalBookings: bookings.length,
        attractionsGrowth,
        hotelsGrowth,
        usersGrowth,
        bookingsGrowth
      })


    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Welcome to your Ghana Tourism administration panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Destinations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats.totalAttractions}
            </div>
            <p className="text-xs text-muted-foreground">
              +{stats.attractionsGrowth} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hotels</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats.totalHotels}
            </div>
            <p className="text-xs text-muted-foreground">
              +{stats.hotelsGrowth} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +{stats.usersGrowth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats.totalBookings}
            </div>
            <p className="text-xs text-muted-foreground">
              +{stats.bookingsGrowth}% from last month
            </p>
          </CardContent>
        </Card>
      </div>


      {/* Performance Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>Monthly statistics and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Chart visualization coming soon</p>
              <p className="text-sm text-gray-400">Monthly bookings, revenue, and user growth</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
