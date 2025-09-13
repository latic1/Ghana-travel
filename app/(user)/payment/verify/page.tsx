'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function PaymentVerificationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'failed'>('loading')
  const [verificationData, setVerificationData] = useState<{
    reference: string
    amount: number
    status: string
    customer: {
      email: string
      name: string
    }
  } | null>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const reference = searchParams.get('reference')
    const trxref = searchParams.get('trxref')

    if (!reference && !trxref) {
      setError('No payment reference found')
      setVerificationStatus('failed')
      return
    }

    // Use trxref if available (Paystack callback), otherwise use reference
    const paymentRef = trxref || reference

    // Verify payment immediately, even without session
    // The API will handle authentication
    if (paymentRef) {
      verifyPayment(paymentRef)
    }
  }, [searchParams])

  // Check session after payment verification
  useEffect(() => {
    if (verificationStatus === 'success' && !session) {
      // If payment was successful but no session, redirect to sign in
      // This handles cases where session was lost during redirect
      router.push('/auth/signin?callbackUrl=/bookings')
    }
  }, [verificationStatus, session, router])

  const verifyPayment = async (reference: string) => {
    try {
      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reference }),
      })

      if (response.ok) {
        const result = await response.json()
        setVerificationData(result.data)
        setVerificationStatus('success')
        toast.success('Payment verified successfully! Your booking has been confirmed.')
      } else {
        const error = await response.json()
        
        // Handle session expiration case
        if (error.requiresAuth) {
          setError('Your session has expired. Please sign in to complete your booking.')
          setVerificationStatus('failed')
          // Redirect to sign in with callback URL
          setTimeout(() => {
            router.push('/auth/signin?callbackUrl=/bookings')
          }, 2000)
          return
        }
        
        setError(error.error || 'Payment verification failed')
        setVerificationStatus('failed')
        toast.error(`Payment verification failed: ${error.error}`)
      }
    } catch (error) {
      console.error('Error verifying payment:', error)
      setError('Failed to verify payment. Please try again.')
      setVerificationStatus('failed')
      toast.error('Payment verification failed. Please try again.')
    }
  }

  if (verificationStatus === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Loader2 className="w-16 h-16 text-yellow-600 animate-spin" />
              </div>
              <CardTitle className="text-2xl">Verifying Payment</CardTitle>
              <CardDescription>
                Please wait while we verify your payment with Paystack...
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">
                This may take a few moments. Please do not close this page.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (verificationStatus === 'failed') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <XCircle className="w-16 h-16 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-red-600">Payment Verification Failed</CardTitle>
              <CardDescription>
                We couldn&apos;t verify your payment. Please contact support if you believe this is an error.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">{error}</p>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link href="/">
                    Return to Home
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/contact">
                    Contact Support
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
            <CardDescription>
              Your payment has been verified and your booking is confirmed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Payment Details */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Payment Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">₵{verificationData?.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reference:</span>
                  <span className="font-medium font-mono">{verificationData?.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">Card</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600">Confirmed</span>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Booking Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600">Confirmed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer:</span>
                  <span className="font-medium">{verificationData?.customer?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{verificationData?.customer?.email}</span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">What&apos;s Next?</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• You&apos;ll receive a confirmation email shortly</li>
                <li>• Your booking details are available in your profile</li>
                <li>• Contact us if you need to make any changes</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button asChild className="bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700">
                <Link href="/bookings">
                  View My Bookings
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">
                  Return to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
