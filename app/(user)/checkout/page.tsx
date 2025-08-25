'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, CreditCard, Lock, CheckCircle, Building2, MapPin, Calendar, Users, Bed } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface BookingData {
  type: 'HOTEL' | 'ATTRACTION'
  hotelId?: string
  attractionId?: string
  checkIn?: string
  checkOut?: string
  visitDate?: string
  numberOfGuests?: number
  numberOfRooms?: number
  numberOfPeople?: number
  totalPrice: number
  hotel?: {
    name: string
    location: string
    pricePerNight: number
  }
  attraction?: {
    name: string
    location: string
    price: number
  }
}

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [isProcessing, setIsProcessing] = useState(false)
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [paymentData, setPaymentData] = useState({
    cardholderName: '',
    email: '',
    phone: ''
  })

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    // Get booking data from URL params
    const type = searchParams.get('type') as 'HOTEL' | 'ATTRACTION'
    const hotelId = searchParams.get('hotelId')
    const attractionId = searchParams.get('attractionId')
    const checkIn = searchParams.get('checkIn')
    const checkOut = searchParams.get('checkOut')
    const visitDate = searchParams.get('visitDate')
    const numberOfGuests = searchParams.get('numberOfGuests')
    const numberOfRooms = searchParams.get('numberOfRooms')
    const numberOfPeople = searchParams.get('numberOfPeople')
    const totalPrice = searchParams.get('totalPrice')

    if (!type || !totalPrice) {
      toast.error('Invalid booking data')
      router.push('/')
      return
    }

    setBookingData({
      type,
      hotelId: hotelId || undefined,
      attractionId: attractionId || undefined,
      checkIn: checkIn || undefined,
      checkOut: checkOut || undefined,
      visitDate: visitDate || undefined,
      numberOfGuests: numberOfGuests ? parseInt(numberOfGuests) : undefined,
      numberOfRooms: numberOfRooms ? parseInt(numberOfRooms) : undefined,
      numberOfPeople: numberOfPeople ? parseInt(numberOfPeople) : undefined,
      totalPrice: parseFloat(totalPrice)
    })
  }, [searchParams, session, router])

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!bookingData) return

    setIsProcessing(true)

    try {
      // Initialize Paystack payment
      const response = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: bookingData.type,
          hotelId: bookingData.hotelId,
          attractionId: bookingData.attractionId,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          visitDate: bookingData.visitDate,
          numberOfGuests: bookingData.numberOfGuests,
          numberOfRooms: bookingData.numberOfRooms,
          numberOfPeople: bookingData.numberOfPeople,
          totalPrice: bookingData.totalPrice,
          customerName: paymentData.cardholderName,
          customerPhone: paymentData.phone,
          customerEmail: paymentData.email
        }),
      })

      if (response.ok) {
        const result = await response.json()
        
        // Redirect to Paystack payment page
        if (result.data.authorization_url) {
          window.location.href = result.data.authorization_url
        } else {
          toast.error('Payment initialization failed')
        }
      } else {
        const error = await response.json()
        toast.error(`Payment failed: ${error.error}`)
      }
    } catch (error) {
      console.error('Error processing payment:', error)
      toast.error('Payment processing failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!session || !bookingData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading checkout...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600">Complete your booking and payment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Information
              </CardTitle>
              <CardDescription>
                Enter your payment details to complete the booking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardholderName">Full Name</Label>
                    <Input
                      id="cardholderName"
                      value={paymentData.cardholderName}
                      onChange={(e) => setPaymentData({ ...paymentData, cardholderName: e.target.value })}
                      placeholder="John Doe"
                      required
                      disabled={isProcessing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={paymentData.email}
                      onChange={(e) => setPaymentData({ ...paymentData, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                      disabled={isProcessing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={paymentData.phone}
                    onChange={(e) => setPaymentData({ ...paymentData, phone: e.target.value })}
                    placeholder="+233 XX XXX XXXX"
                    required
                    disabled={isProcessing}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Pay ${bookingData.totalPrice}
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Lock className="w-4 h-4" />
                  Your payment information is secure and encrypted
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Booking Summary */}
        <div className="space-y-6">
          {/* Booking Summary */}
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
              <CardDescription>Review your booking details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {bookingData.type === 'HOTEL' ? (
                  <Building2 className="w-8 h-8 text-blue-600" />
                ) : (
                  <MapPin className="w-8 h-8 text-green-600" />
                )}
                <div>
                  <h4 className="font-medium">
                    {bookingData.type === 'HOTEL' ? 'Hotel Booking' : 'Attraction Visit'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {bookingData.type === 'HOTEL' 
                      ? `${bookingData.numberOfRooms} room(s) for ${bookingData.numberOfGuests} guest(s)`
                      : `${bookingData.numberOfPeople} person(s)`
                    }
                  </p>
                </div>
              </div>

              {bookingData.type === 'HOTEL' && (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>Check-in: {new Date(bookingData.checkIn!).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>Check-out: {new Date(bookingData.checkOut!).toLocaleDateString()}</span>
                  </div>
                </>
              )}

              {bookingData.type === 'ATTRACTION' && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>Visit Date: {new Date(bookingData.visitDate!).toLocaleDateString()}</span>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total Amount</span>
                  <span className="text-2xl text-green-600">${bookingData.totalPrice}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Free cancellation up to 24 hours before</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Instant confirmation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Secure payment processing</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
