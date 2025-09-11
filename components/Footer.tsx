import { Phone, Mail, Globe } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer id="contact" className="bg-foreground text-background py-12">
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
                <a href="#attractions" className="text-muted-foreground hover:text-background transition-colors">
                  Attractions
                </a>
              </li>
              <li>
                <a href="#accommodations" className="text-muted-foreground hover:text-background transition-colors">
                  Accommodations
                </a>
              </li>
              <li>
                <a href="#routes" className="text-muted-foreground hover:text-background transition-colors">
                  Travel Routes
                </a>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-background transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Services</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/attractions" className="text-muted-foreground hover:text-background transition-colors">
                  Attraction Tours
                </Link>
              </li>
              <li>
                <Link href="/hotels" className="text-muted-foreground hover:text-background transition-colors">
                  Hotel Booking
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-background transition-colors">
                  Tour Packages
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-background transition-colors">
                  Transportation
                </a>
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
  )
}