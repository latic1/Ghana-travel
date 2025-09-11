# Cloudinary Setup Guide

## 1. Create a Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com) and sign up for a free account
2. Verify your email address

## 2. Get Your Credentials

1. Log in to your Cloudinary dashboard
2. Go to the "Dashboard" section
3. Copy your:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

## 3. Set Environment Variables

Create a `.env.local` file in your project root with:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## 4. Update Database Schema

Run the following commands to update your database:

```bash
npm run db:generate
npm run db:push
```

## 5. Features Implemented

### Image Upload
- **Multiple Images**: Up to 5 images per hotel/attraction
- **Automatic Optimization**: Images are automatically resized and optimized
- **Secure Uploads**: Only admin users can upload images
- **Cloud Storage**: Images are stored securely in Cloudinary

### Booking System
- **Hotel Bookings**: Select dates, guests, and rooms
- **Attraction Bookings**: Select visit date and number of people
- **Real-time Pricing**: Automatic calculation of total costs
- **Checkout Flow**: Secure payment processing page

### User Experience
- **Responsive Design**: Works on all devices
- **Real-time Updates**: Instant feedback and validation
- **Secure Authentication**: Role-based access control
- **Payment Processing**: Simulated payment flow with real booking creation

## 6. API Endpoints

### Image Upload
- `POST /api/upload` - Upload images to Cloudinary (Admin only)

### Bookings
- `POST /api/bookings` - Create new bookings
- `GET /api/bookings/[id]` - Get booking details
- `PUT /api/bookings/[id]` - Update booking (Admin only)
- `DELETE /api/bookings/[id]` - Delete booking (Admin only)

## 7. Usage Examples

### Upload Images (Admin)
```javascript
const formData = new FormData()
formData.append('images', file1)
formData.append('images', file2)

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData
})
```

### Book Hotel
1. Select dates and room preferences
2. Click "Proceed to Checkout"
3. Complete payment form
4. Booking is automatically created

### Book Attraction
1. Select visit date and number of people
2. Click "Book Now"
3. Complete payment form
4. Booking is automatically created

## 8. Security Features

- **Admin-only Uploads**: Only authenticated admin users can upload images
- **Input Validation**: All form inputs are validated server-side
- **Rate Limiting**: Built-in protection against abuse
- **Secure Storage**: Images stored in Cloudinary with access controls

## 9. Troubleshooting

### Common Issues

1. **Images not uploading**: Check Cloudinary credentials in `.env.local`
2. **Booking errors**: Ensure all required fields are filled
3. **Authentication issues**: Verify NextAuth configuration

### Support

For Cloudinary-specific issues, refer to their [documentation](https://cloudinary.com/documentation).
For app-specific issues, check the console logs and API responses.
