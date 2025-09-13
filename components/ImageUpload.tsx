'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface UploadedImage {
  url: string
  publicId: string
  width: number
  height: number
}

interface ImageUploadProps {
  value?: string | string[]
  onChange: (value: string | string[]) => void
  multiple?: boolean
  maxImages?: number
  folder?: string
  className?: string
  label?: string
  description?: string
}

export default function ImageUpload({
  value,
  onChange,
  multiple = false,
  maxImages = 5,
  folder = 'travel-app',
  className = '',
  label = 'Images',
  description = 'Upload images (JPG, PNG, WebP)'
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentImages = Array.isArray(value) ? value : (value ? [value] : [])

  const handleFileSelect = useCallback(async (files: FileList) => {
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    
    // Validate file types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const invalidFiles = fileArray.filter(file => !allowedTypes.includes(file.type))
    
    if (invalidFiles.length > 0) {
      toast.error('Please upload only JPG, PNG, or WebP images')
      return
    }

    // Check file sizes (max 10MB per file)
    const oversizedFiles = fileArray.filter(file => file.size > 10 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      toast.error('File size must be less than 10MB')
      return
    }

    // Check total number of images
    const totalImages = currentImages.length + fileArray.length
    if (totalImages > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`)
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      fileArray.forEach(file => {
        formData.append('images', file)
      })

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const result = await response.json()
      const newImageUrls = result.images.map((img: UploadedImage) => img.url)


      if (multiple) {
        onChange([...currentImages, ...newImageUrls])
      } else {
        onChange(newImageUrls[0])
      }

      toast.success(`${fileArray.length} image(s) uploaded successfully`)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }, [currentImages, maxImages, multiple, onChange])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files)
    }
  }, [handleFileSelect])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files)
    }
  }, [handleFileSelect])

  const removeImage = useCallback((index: number) => {
    if (multiple) {
      const newImages = currentImages.filter((_, i) => i !== index)
      onChange(newImages)
    } else {
      onChange('')
    }
  }, [currentImages, multiple, onChange])

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>

      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isUploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-sm text-gray-600">Uploading images...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {dragActive ? 'Drop images here' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-gray-500">
                {multiple ? `Up to ${maxImages} images` : 'Single image'} • JPG, PNG, WebP • Max 10MB each
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Image Preview */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentImages.map((imageUrl, index) => (
            <Card key={index} className="relative group">
              <CardContent className="p-2">
                <div className="relative aspect-square rounded-md overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeImage(index)
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Manual URL Input */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Or enter image URL manually</Label>
        <div className="flex gap-2">
          <Input
            placeholder="https://example.com/image.jpg"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const url = e.currentTarget.value.trim()
                if (url) {
                  if (multiple) {
                    onChange([...currentImages, url])
                  } else {
                    onChange(url)
                  }
                  e.currentTarget.value = ''
                }
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={(e) => {
              const input = e.currentTarget.previousElementSibling as HTMLInputElement
              const url = input.value.trim()
              if (url) {
                if (multiple) {
                  onChange([...currentImages, url])
                } else {
                  onChange(url)
                }
                input.value = ''
              }
            }}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  )
}
