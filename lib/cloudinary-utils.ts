import cloudinary from './cloudinary'

export interface ImageTransformOptions {
  width?: number
  height?: number
  crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb'
  quality?: 'auto' | number
  format?: 'auto' | 'webp' | 'jpg' | 'png'
  gravity?: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west'
  radius?: number
  effect?: string
  overlay?: string
  opacity?: number
}

export interface OptimizedImageUrl {
  url: string
  width: number
  height: number
  format: string
  size: string
}

/**
 * Generate optimized image URL with transformations
 */
export function getOptimizedImageUrl(
  publicId: string,
  options: ImageTransformOptions = {}
): string {
  const {
    width = 800,
    height = 600,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
    gravity = 'auto',
    radius,
    effect,
    overlay,
    opacity
  } = options

  const transformations: any[] = [
    { width, height, crop },
    { quality },
    { format },
    { gravity }
  ]

  if (radius) transformations.push({ radius })
  if (effect) transformations.push({ effect })
  if (overlay) transformations.push({ overlay })
  if (opacity) transformations.push({ opacity })

  return cloudinary.url(publicId, {
    transformation: transformations,
    secure: true
  })
}

/**
 * Generate responsive image URLs for different screen sizes
 */
export function getResponsiveImageUrls(publicId: string) {
  return {
    thumbnail: getOptimizedImageUrl(publicId, {
      width: 150,
      height: 150,
      crop: 'fill'
    }),
    small: getOptimizedImageUrl(publicId, {
      width: 400,
      height: 300,
      crop: 'fill'
    }),
    medium: getOptimizedImageUrl(publicId, {
      width: 800,
      height: 600,
      crop: 'fill'
    }),
    large: getOptimizedImageUrl(publicId, {
      width: 1200,
      height: 800,
      crop: 'fill'
    }),
    original: cloudinary.url(publicId, { secure: true })
  }
}

/**
 * Generate image URLs for different use cases
 */
export function getImageVariants(publicId: string) {
  return {
    // Hotel/Attraction cards
    card: getOptimizedImageUrl(publicId, {
      width: 300,
      height: 200,
      crop: 'fill',
      quality: 'auto',
      format: 'webp'
    }),
    
    // Hero images
    hero: getOptimizedImageUrl(publicId, {
      width: 1200,
      height: 600,
      crop: 'fill',
      quality: 'auto',
      format: 'webp'
    }),
    
    // Gallery thumbnails
    thumbnail: getOptimizedImageUrl(publicId, {
      width: 150,
      height: 150,
      crop: 'fill',
      quality: 'auto',
      format: 'webp'
    }),
    
    // Gallery full size
    gallery: getOptimizedImageUrl(publicId, {
      width: 800,
      height: 600,
      crop: 'fit',
      quality: 'auto',
      format: 'webp'
    }),
    
    // Profile images
    avatar: getOptimizedImageUrl(publicId, {
      width: 100,
      height: 100,
      crop: 'fill',
      gravity: 'face',
      quality: 'auto',
      format: 'webp'
    })
  }
}

/**
 * Upload image with automatic optimization
 */
export async function uploadOptimizedImage(
  file: File,
  folder: string = 'travel-app',
  options: ImageTransformOptions = {}
): Promise<OptimizedImageUrl> {
  try {
    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64String = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64String}`

    // Upload with transformations
    const result = await cloudinary.uploader.upload(dataURI, {
      folder,
      resource_type: 'auto',
      transformation: [
        { width: options.width || 800, height: options.height || 600, crop: options.crop || 'fill' },
        { quality: options.quality || 'auto' },
        { format: options.format || 'auto' }
      ]
    })

    return {
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      size: `${Math.round(result.bytes / 1024)}KB`
    }
  } catch (error) {
    console.error('Upload error:', error)
    throw new Error('Failed to upload image')
  }
}

/**
 * Delete image from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result.result === 'ok'
  } catch (error) {
    console.error('Delete error:', error)
    return false
  }
}

/**
 * Get image information
 */
export async function getImageInfo(publicId: string) {
  try {
    const result = await cloudinary.api.resource(publicId)
    return {
      publicId: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes,
      createdAt: result.created_at
    }
  } catch (error) {
    console.error('Get info error:', error)
    return null
  }
}

/**
 * Generate blur placeholder for lazy loading
 */
export function getBlurPlaceholder(publicId: string): string {
  return getOptimizedImageUrl(publicId, {
    width: 20,
    height: 20,
    crop: 'fill',
    quality: 1,
    effect: 'blur:1000'
  })
}

/**
 * Generate low-quality placeholder
 */
export function getLQIPlaceholder(publicId: string): string {
  return getOptimizedImageUrl(publicId, {
    width: 50,
    height: 50,
    crop: 'fill',
    quality: 1,
    format: 'webp'
  })
}

/**
 * Check if URL is a Cloudinary URL
 */
export function isCloudinaryUrl(url: string): boolean {
  return url.includes('cloudinary.com')
}

/**
 * Extract public ID from Cloudinary URL
 */
export function extractPublicId(url: string): string | null {
  if (!isCloudinaryUrl(url)) return null
  
  const match = url.match(/\/v\d+\/(.+)\.(jpg|jpeg|png|webp|gif)$/i)
  return match ? match[1] : null
}
