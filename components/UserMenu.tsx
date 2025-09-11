'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { User, LogOut, Calendar, Star } from 'lucide-react'
import Link from 'next/link'

export default function UserMenu() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <Button variant="outline" disabled>
        Loading...
      </Button>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" asChild>
          <Link href="/auth/signin">Sign In</Link>
        </Button>
        <Button className="bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700" asChild>
          <Link href="/auth/signup">Sign Up</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" asChild>
        <Link href="/bookings">
          <Calendar className="w-4 h-4 mr-2" />
          Bookings
        </Link>
      </Button>
      <Button variant="outline" asChild>
        <Link href="/reviews">
          <Star className="w-4 h-4 mr-2" />
          Reviews
        </Link>
      </Button>
      <Button variant="outline" asChild>
        <Link href="/profile">
          <User className="w-4 h-4 mr-2" />
          {session?.user?.name || session?.user?.email}
        </Link>
      </Button>
      <Button variant="outline" size="sm" onClick={() => signOut()}>
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  )
}
