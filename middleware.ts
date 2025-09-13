import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
    
    // You can add custom logic here
    if (req.nextUrl.pathname.startsWith('/checkout')) {
      console.log("🛒 Middleware: Checkout page access", {
        hasToken: !!req.nextauth.token,
        userId: req.nextauth.token?.sub,
        userRole: req.nextauth.token?.role
      })
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to checkout page only if user is authenticated
        if (req.nextUrl.pathname.startsWith('/checkout')) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/checkout/:path*',
    '/admin/:path*',
    '/api/protected/:path*'
  ]
}
