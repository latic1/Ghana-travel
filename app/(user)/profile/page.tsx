'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { User, Mail, Shield, UserCheck, Calendar, Save, Loader2, Edit, Eye, EyeOff, MapPin, Building2 } from 'lucide-react'
import Link from 'next/link'

interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  updatedAt: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [user, setUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id || '',
        name: session.user.name || '',
        email: session.user.email || '',
        role: session.user.role || 'USER',
        createdAt: new Date().toISOString(), // This would come from the actual user data
        updatedAt: new Date().toISOString()
      })
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        password: '',
        confirmPassword: ''
      })
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/users/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password || undefined,
        }),
      })

      if (response.ok) {
        // Update local state
        setUser(prev => prev ? {
          ...prev,
          name: formData.name,
          email: formData.email,
          updatedAt: new Date().toISOString()
        } : null)
        
        setIsEditing(false)
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }))
        alert('Profile updated successfully!')
      } else {
        const error = await response.json()
        alert(`Failed to update profile: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="w-5 h-5" />
      case 'MODERATOR':
        return <UserCheck className="w-5 h-5" />
      default:
        return <User className="w-5 h-5" />
    }
  }

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      ADMIN: 'bg-red-100 text-red-800',
      USER: 'bg-blue-100 text-blue-800',
      MODERATOR: 'bg-purple-100 text-purple-800'
    }
    return colors[role] || 'bg-gray-100 text-gray-800'
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!session || !user) {
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
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600">Manage your account information and settings</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            disabled={isSubmitting}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Form */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Your full name"
                        required
                        disabled={!isEditing}
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your@email.com"
                        required
                        disabled={!isEditing}
                      />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          placeholder="Leave blank to keep current"
                          disabled={!isEditing}
                          minLength={6}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={!isEditing}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">Minimum 6 characters</p>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        placeholder="Confirm new password"
                        disabled={!isEditing}
                        minLength={6}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  {isEditing && (
                    <div className="flex gap-4">
                      <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Update Profile
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your account details and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">User ID</Label>
                    <p className="text-gray-900 font-mono text-sm">{user.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Account Created</Label>
                    <p className="text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Last Updated</Label>
                    <p className="text-gray-900">{new Date(user.updatedAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Account Status</Label>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{user.name}</h4>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {getRoleIcon(user.role)}
                  <Badge className={getRoleColor(user.role)}>
                    {user.role}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/attractions">
                    <MapPin className="w-4 h-4 mr-2" />
                    Browse Attractions
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/hotels">
                    <Building2 className="w-4 h-4 mr-2" />
                    Find Hotels
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/bookings">
                    <Calendar className="w-4 h-4 mr-2" />
                    My Bookings
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
