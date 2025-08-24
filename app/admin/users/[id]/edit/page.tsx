'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, Loader2, User, Shield, UserCheck } from 'lucide-react'
import Link from 'next/link'

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  updatedAt: string
}

export default function EditUserPage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setUser(data)
          setFormData({
            name: data.name,
            email: data.email,
            password: '', // Don't pre-fill password
            role: data.role
          })
        } else {
          alert('Failed to fetch user')
          router.push('/admin/users')
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        alert('Error fetching user')
        router.push('/admin/users')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchUser()
    }
  }, [params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/users/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/admin/users')
      } else {
        const error = await response.json()
        alert(`Failed to update user: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Error updating user')
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
        return <Shield className="w-4 h-4" />
      case 'MODERATOR':
        return <UserCheck className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">User not found</h3>
        <Button asChild>
          <Link href="/admin/users">Back to Users</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/users">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Edit User</h2>
          <p className="text-gray-600">Update user information</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Edit User: {user.name}</CardTitle>
          <CardDescription>Update the user details</CardDescription>
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
                  placeholder="e.g., John Doe"
                  required
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
                  placeholder="e.g., john@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Leave blank to keep current password"
                  minLength={6}
                />
                <p className="text-sm text-gray-500">Leave blank to keep current password</p>
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        User
                      </div>
                    </SelectItem>
                    <SelectItem value="MODERATOR">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4" />
                        Moderator
                      </div>
                    </SelectItem>
                    <SelectItem value="ADMIN">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Admin
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {getRoleIcon(formData.role)}
                  <span>
                    {formData.role === 'ADMIN' && 'Full system access and user management'}
                    {formData.role === 'MODERATOR' && 'Content moderation and limited admin access'}
                    {formData.role === 'USER' && 'Standard user access'}
                  </span>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <Label className="text-sm font-medium text-gray-500">User ID</Label>
                <p className="text-sm text-gray-900">{user.id}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Created</Label>
                <p className="text-sm text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Last Updated</Label>
                <p className="text-sm text-gray-900">{new Date(user.updatedAt).toLocaleDateString()}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Current Role</Label>
                <div className="flex items-center gap-2">
                  {getRoleIcon(user.role)}
                  <span className="text-sm text-gray-900">{user.role}</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
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
                    Update User
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/users">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
