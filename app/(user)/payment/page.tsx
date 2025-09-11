"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { CreditCard, Smartphone, Shield, Lock, CheckCircle, Phone, Mail, Globe, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PaymentMethod {
  id: string
  name: string
  type: "card" | "mobile" | "bank"
  icon: React.ReactNode
  description: string
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "card",
    name: "Credit/Debit Card",
    type: "card",
    icon: <CreditCard className="w-5 h-5" />,
    description: "Visa, Mastercard, American Express",
  },
  {
    id: "mtn",
    name: "MTN Mobile Money",
    type: "mobile",
    icon: <Smartphone className="w-5 h-5" />,
    description: "Pay with your MTN Mobile Money account",
  },
  {
    id: "vodafone",
    name: "Vodafone Cash",
    type: "mobile",
    icon: <Smartphone className="w-5 h-5" />,
    description: "Pay with your Vodafone Cash account",
  },
  {
    id: "airteltigo",
    name: "AirtelTigo Money",
    type: "mobile",
    icon: <Smartphone className="w-5 h-5" />,
    description: "Pay with your AirtelTigo Money account",
  },
]

export default function PaymentPage() {
  const [selectedMethod, setSelectedMethod] = useState("card")
  const [processing, setProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardName, setCardName] = useState("")
  const [mobileNumber, setMobileNumber] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)

  // Mock booking data - in real app this would come from booking context/state
  const bookingData = {
    hotel: "Oceanview Resort Accra",
    location: "Accra, Greater Accra",
    checkIn: "Dec 15, 2024",
    checkOut: "Dec 18, 2024",
    guests: 2,
    nights: 3,
    roomPrice: 180,
    serviceFee: 15,
    taxes: 59,
    total: 599,
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    if (formatted.length <= 19) {
      setCardNumber(formatted)
    }
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value)
    if (formatted.length <= 5) {
      setExpiryDate(formatted)
    }
  }

  const handlePayment = async () => {
    setProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setProcessing(false)
    setPaymentComplete(true)
  }

  const getCardType = (number: string) => {
    const num = number.replace(/\s/g, "")
    if (num.startsWith("4")) return "Visa"
    if (num.startsWith("5") || num.startsWith("2")) return "Mastercard"
    if (num.startsWith("3")) return "American Express"
    return "Card"
  }

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GH</span>
                </div>
                <h1 className="text-xl font-bold text-foreground">Ghana Tourism</h1>
              </div>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
                <Link href="/maps" className="text-muted-foreground hover:text-foreground transition-colors">
                  Interactive Map
                </Link>
                <Link href="/bookings" className="text-muted-foreground hover:text-foreground transition-colors">
                  Bookings
                </Link>
                <Link href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </nav>
              <Button className="bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700">
                Plan Your Trip
              </Button>
            </div>
          </div>
        </header>

        {/* Payment Success */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Payment Successful!</h2>
            <p className="text-muted-foreground mb-8">
              Your booking has been confirmed. We&apos;ve sent Link confirmation email with all the details.
            </p>

            <Card className="p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Booking Confirmation</h3>
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Booking ID:</span>
                  <span className="font-medium">GH-2024-001234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hotel:</span>
                  <span className="font-medium">{bookingData.hotel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-in:</span>
                  <span className="font-medium">{bookingData.checkIn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-out:</span>
                  <span className="font-medium">{bookingData.checkOut}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Paid:</span>
                  <span className="font-bold text-lg">${bookingData.total}</span>
                </div>
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700"
              >
                Download Receipt
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">GH</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">Ghana Tourism</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/maps" className="text-muted-foreground hover:text-foreground transition-colors">
                Interactive Map
              </Link>
              <Link href="/bookings" className="text-muted-foreground hover:text-foreground transition-colors">
                Bookings
              </Link>
              <Link href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </nav>
            <Button className="bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700">
              Plan Your Trip
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button variant="outline" asChild className="mb-4 bg-transparent">
              <Link href="/bookings">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Booking
              </Link>
            </Button>
            <h2 className="text-3xl font-bold text-foreground mb-2">Secure Payment</h2>
            <p className="text-muted-foreground">Complete your booking with our secure payment system</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Methods */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Choose Payment Method</h3>
                <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <RadioGroupItem value={method.id} id={method.id} />
                        <div className="flex items-center gap-3 flex-1">
                          <div className="text-yellow-600">{method.icon}</div>
                          <div>
                            <Label htmlFor={method.id} className="font-medium cursor-pointer">
                              {method.name}
                            </Label>
                            <p className="text-sm text-muted-foreground">{method.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </Card>

              {/* Payment Details */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Payment Details</h3>

                {selectedMethod === "card" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <div className="relative">
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          className="pr-16"
                        />
                        {cardNumber && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Badge variant="secondary" className="text-xs">
                              {getCardType(cardNumber)}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input id="expiryDate" placeholder="MM/YY" value={expiryDate} onChange={handleExpiryChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          type="password"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {selectedMethod !== "card" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mobileNumber">Mobile Number</Label>
                      <Input
                        id="mobileNumber"
                        placeholder="0XX XXX XXXX"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                      />
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        You will receive Link prompt on your phone to authorize this payment of ${bookingData.total}.
                      </p>
                    </div>
                  </div>
                )}
              </Card>

              {/* Terms and Conditions */}
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={agreeTerms}
                      onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="terms" className="text-sm cursor-pointer">
                        I agree to the Terms and Conditions and Privacy Policy
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        By proceeding, you agree to our booking terms and cancellation policy.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>Your payment information is encrypted and secure</span>
                  </div>
                </div>
              </Card>

              {/* Pay Button */}
              <Button
                className="w-full bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700 py-3 text-lg"
                onClick={handlePayment}
                disabled={!agreeTerms || processing}
              >
                {processing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing Payment...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Pay ${bookingData.total}
                  </div>
                )}
              </Button>
            </div>

            {/* Booking Summary */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">{bookingData.hotel}</h4>
                    <p className="text-sm text-muted-foreground">{bookingData.location}</p>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Check-in:</span>
                      <span>{bookingData.checkIn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Check-out:</span>
                      <span>{bookingData.checkOut}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Guests:</span>
                      <span>{bookingData.guests} guests</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Nights:</span>
                      <span>{bookingData.nights}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>
                        ${bookingData.roomPrice} × {bookingData.nights} nights
                      </span>
                      <span>${bookingData.roomPrice * bookingData.nights}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service fee</span>
                      <span>${bookingData.serviceFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes</span>
                      <span>${bookingData.taxes}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${bookingData.total}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-3">Secure Payment</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-green-600" />
                    <span>PCI DSS compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Fraud protection</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-3">Need Help?</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-yellow-600" />
                    <span>+233 20 123 4567</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-yellow-600" />
                    <span>payments@ghanatourism.com</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer id="contact" className="bg-foreground text-background py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GH</span>
                </div>
                <h4 className="text-lg font-bold">Ghana Tourism</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Your trusted partner for exploring the beauty and culture of Ghana.
              </p>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-muted-foreground hover:text-background transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/maps" className="text-muted-foreground hover:text-background transition-colors">
                    Interactive Map
                  </Link>
                </li>
                <li>
                  <Link href="/bookings" className="text-muted-foreground hover:text-background transition-colors">
                    Bookings
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-background transition-colors">
                    Travel Guide
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Services</h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-background transition-colors">
                    Hotel Booking
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-background transition-colors">
                    Tour Packages
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-background transition-colors">
                    Transportation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-background transition-colors">
                    Travel Insurance
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Contact Info</h5>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span className="text-muted-foreground">+233 20 123 4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-muted-foreground">info@ghanatourism.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span className="text-muted-foreground">www.ghanatourism.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-muted-foreground/20 mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Ghana Tourism System. All rights reserved. | Promoting Ghana&apos;s rich heritage and natural beauty.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
