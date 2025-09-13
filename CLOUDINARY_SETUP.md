# Cloudinary Setup Guide

This guide will help you set up Cloudinary for image uploads in the travel app.

## 1. Create a Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Verify your email address

## 2. Get Your Cloudinary Credentials

1. Log into your Cloudinary dashboard
2. Go to the "Dashboard" section
3. Copy the following values:
   - **Cloud Name** (e.g., `dxyz123456`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz`)

## 3. Environment Variables

Add these environment variables to your `.env.local` file:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## 4. Features Included

### Image Upload Component
- **Drag & Drop**: Users can drag and drop images directly
- **File Selection**: Click to browse and select files
- **Multiple Upload**: Support for single or multiple image uploads
- **Image Preview**: Real-time preview of uploaded images
- **Validation**: File type and size validation
- **Manual URL**: Option to add images via URL

### Image Optimization
- **Auto Resize**: Images are automatically resized to 800x600px
- **Quality Optimization**: Automatic quality adjustment
- **Format Support**: JPG, PNG, WebP formats supported
- **Folder Organization**: Images organized by type (hotels, attractions)

### Admin Integration
- **Hotel Forms**: Image upload for hotel listings
- **Attraction Forms**: Multiple image upload for attractions
- **Edit Forms**: Update existing images
- **Error Handling**: Comprehensive error messages

## 5. Usage Examples

### Single Image Upload (Hotels)
```tsx
<ImageUpload
  value={hotel.imageUrl}
  onChange={(value) => setHotel({...hotel, imageUrl: value})}
  multiple={false}
  folder="hotels"
  label="Hotel Image"
  description="Upload a main image for this hotel"
/>
```

### Multiple Image Upload (Attractions)
```tsx
<ImageUpload
  value={attraction.images}
  onChange={(value) => setAttraction({...attraction, images: value})}
  multiple={true}
  maxImages={5}
  folder="attractions"
  label="Attraction Images"
  description="Upload multiple images for this attraction"
/>
```

## 6. File Limits

- **File Size**: Maximum 10MB per file
- **File Types**: JPG, PNG, WebP only
- **Multiple Uploads**: Up to 5 images per attraction
- **Single Uploads**: 1 image per hotel

## 7. Security

- **Admin Only**: Image uploads are restricted to admin users
- **Authentication**: Requires valid admin session
- **Validation**: Server-side file validation
- **Error Handling**: Secure error messages

## 8. Troubleshooting

### Common Issues

1. **"Unauthorized" Error**
   - Ensure you're logged in as an admin user
   - Check your session is valid

2. **"Upload Failed" Error**
   - Verify your Cloudinary credentials
   - Check your internet connection
   - Ensure file size is under 10MB

3. **"Invalid File Type" Error**
   - Only JPG, PNG, and WebP files are supported
   - Check file extension and MIME type

### Debug Steps

1. Check browser console for errors
2. Verify environment variables are set
3. Test with smaller image files
4. Check Cloudinary dashboard for uploads

## 9. Production Considerations

- **CDN**: Cloudinary provides global CDN for fast image delivery
- **Transformations**: Images are automatically optimized
- **Backup**: Images are stored securely in Cloudinary
- **Analytics**: Monitor usage in Cloudinary dashboard

## 10. Cost

- **Free Tier**: 25GB storage, 25GB bandwidth per month
- **Paid Plans**: Available for higher usage
- **Pay-as-you-go**: Only pay for what you use

For more information, visit the [Cloudinary Documentation](https://cloudinary.com/documentation).
