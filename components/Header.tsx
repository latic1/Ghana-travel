'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { MapPin, User, LogOut, Settings, BookOpen, MessageSquare } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Header() {
  const { data: session } = useSession()
  
  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }
  
  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GH</span>
            </div>
            <Link href="/" className="text-xl font-bold text-foreground hover:text-yellow-600 transition-colors">
              Ghana Tourism
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/attractions" className="text-muted-foreground hover:text-foreground transition-colors">
              Browse Attractions
            </Link>
            <Link href="/hotels" className="text-muted-foreground hover:text-foreground transition-colors">
              Hotels
            </Link>
            <Link href="/maps" className="text-muted-foreground hover:text-foreground transition-colors">
              Interactive Map
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </nav>
          
          <div className="flex items-center gap-4">
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={session.user.image || ''} alt={session.user.name || 'User'} />
                      <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-red-500 text-white">
                        {session.user.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/bookings" className="cursor-pointer">
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>My Bookings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/reviews" className="cursor-pointer">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      <span>My Reviews</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Admin Panel</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
