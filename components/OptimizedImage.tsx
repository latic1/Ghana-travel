'use client'

import Image from 'next/image'
import { useState } from 'react'
import { getOptimizedImageUrl, getBlurPlaceholder, isCloudinaryUrl } from '@/lib/cloudinary-utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  quality?: number
  variant?: 'card' | 'hero' | 'thumbnail' | 'gallery' | 'avatar'
  placeholder?: 'blur' | 'empty'
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  sizes,
  quality = 75,
  variant = 'card',
  placeholder = 'blur'
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Generate optimized URL if it's a Cloudinary image
  const optimizedSrc = isCloudinaryUrl(src) 
    ? getOptimizedImageUrl(src, {
        width: width || 800,
        height: height || 600,
        quality: 'auto',
        format: 'webp'
      })
    : src

  // Generate blur placeholder for Cloudinary images
  const blurDataURL = placeholder === 'blur' && isCloudinaryUrl(src)
    ? getBlurPlaceholder(src)
    : undefined

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
  }

  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">Failed to load image</span>
      </div>
    )
  }

  const imageProps = {
    src: optimizedSrc,
    alt,
    className: `${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
    priority,
    onLoad: handleLoad,
    onError: handleError,
    quality,
    ...(blurDataURL && { placeholder: 'blur' as const, blurDataURL }),
    ...(sizes && { sizes })
  }

  if (fill) {
    return (
      <Image
        {...imageProps}
        fill
        style={{ objectFit: 'cover' }}
      />
    )
  }

  return (
    <Image
      {...imageProps}
      width={width || 800}
      height={height || 600}
    />
  )
}

// Preset variants for common use cases
export function CardImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={300}
      height={200}
      variant="card"
      className={`rounded-lg ${className}`}
    />
  )
}

export function HeroImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={1200}
      height={600}
      variant="hero"
      className={`w-full h-64 md:h-96 object-cover ${className}`}
    />
  )
}

export function ThumbnailImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={150}
      height={150}
      variant="thumbnail"
      className={`rounded-md ${className}`}
    />
  )
}

export function GalleryImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={800}
      height={600}
      variant="gallery"
      className={`rounded-lg ${className}`}
    />
  )
}

export function AvatarImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={100}
      height={100}
      variant="avatar"
      className={`rounded-full ${className}`}
    />
  )
}
