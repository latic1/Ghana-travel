# Maps Integration Setup Guide

## Overview

Your travel app now supports **two mapping solutions**:

1. **Leaflet Maps** (Default - Free)
2. **Google Maps** (Premium - Requires API Key)

## Option 1: Leaflet Maps (Recommended - Free)

### ✅ **Already Implemented & Working**

Leaflet is automatically configured and working out of the box. It provides:

- **Interactive map** centered on Ghana
- **Real coordinates** for all locations
- **Custom markers** for attractions (blue) and hotels (green)
- **Travel routes** between major destinations
- **Country boundary** overlay
- **Responsive design** for all devices
- **No API key required**

### Features
- 🗺️ **Real Map Data**: Uses OpenStreetMap tiles
- 📍 **Interactive Markers**: Click to view location details
- 🛣️ **Travel Routes**: Golden Triangle and Coastal routes
- 🎯 **Ghana Boundary**: Visual country outline
- 📱 **Mobile Friendly**: Works perfectly on all devices

---

## Option 2: Google Maps (Premium)

### 🔑 **Setup Required**

To enable Google Maps, you need to:

#### 1. Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Maps JavaScript API**
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

#### 2. Add Environment Variable
Create or update your `.env.local` file:

```env
# Google Maps Configuration
GOOGLE_MAPS_API_KEY=your_actual_api_key_here

# Existing Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

#### 3. Restart Your Development Server
```bash
npm run dev
```

### Google Maps Features
- 🛰️ **High-Quality Imagery**: Satellite and street view options
- 🧭 **Advanced Routing**: Turn-by-turn directions
- 🏢 **Business Data**: Rich POI information
- 🌍 **Global Coverage**: Consistent worldwide mapping
- 📊 **Analytics**: Usage tracking and insights

---

## Map Features Comparison

| Feature | Leaflet | Google Maps |
|---------|---------|-------------|
| **Cost** | Free | Pay-per-use |
| **API Key** | Not required | Required |
| **Data Source** | OpenStreetMap | Google Maps |
| **Satellite Imagery** | Limited | High quality |
| **Street View** | No | Yes |
| **Routing** | Basic | Advanced |
| **Business Data** | Community-driven | Google-curated |
| **Performance** | Lightweight | Feature-rich |
| **Offline Support** | Possible | Limited |

---

## Current Implementation

### 🗺️ **Map Locations**
Your map currently shows **10 key locations** across Ghana:

#### Attractions (Blue Markers)
1. **Cape Coast Castle** - Historic castle with ocean views
2. **Kakum National Park** - Rainforest with canopy walkway
3. **Mole National Park** - Wildlife park with elephants
4. **Lake Volta** - World's largest man-made lake
5. **Kumasi Cultural Centre** - Traditional Ashanti culture
6. **Labadi Beach** - Popular beach destination

#### Hotels (Green Markers)
1. **Kempinski Hotel Gold Coast City** - Luxury 5-star in Accra
2. **Movenpick Ambassador Hotel** - Elegant ocean-view hotel
3. **Elmina Beach Resort** - Beachfront resort
4. **Kumasi Golden Tulip Hotel** - Modern hotel in Kumasi

### 🛣️ **Travel Routes**
- **Golden Triangle Route**: Accra → Cape Coast → Kumasi
- **Coastal Route**: Accra → Elmina → Cape Coast

---

## User Experience

### 🎯 **Interactive Features**
- **Click Markers**: View detailed location information
- **Route Lines**: Click to see route names
- **Responsive Sidebar**: Location details update in real-time
- **Map Switching**: Toggle between Leaflet and Google Maps

### 📱 **Mobile Optimization**
- **Touch-friendly** markers and controls
- **Responsive layout** for all screen sizes
- **Fast loading** on mobile networks
- **Optimized** for mobile browsers

---

## Technical Implementation

### 🏗️ **Architecture**
```
MapSelector (Main Component)
├── LeafletMap (OpenStreetMap)
└── GoogleMap (Google Maps API)
```

### 🔧 **Key Components**
- **`MapSelector.tsx`**: Main map container with switching logic
- **`MapComponent.tsx`**: Leaflet implementation
- **`GoogleMapComponent.tsx`**: Google Maps implementation
- **`maps/page.tsx`**: Main maps page with location data

### 📊 **Data Structure**
```typescript
interface Location {
  id: string
  name: string
  description: string
  location: string
  region: string
  type: 'attraction' | 'accommodation'
  rating: number
  price?: string
  coordinates: [number, number] // [lat, lng]
}
```

---

## Customization Options

### 🎨 **Styling**
- **Custom markers** for different location types
- **Color-coded routes** with dashed lines
- **Responsive popups** with location details
- **Hover effects** and animations

### 📍 **Adding New Locations**
Simply add new locations to the `locations` array in `maps/page.tsx`:

```typescript
{
  id: '11',
  name: 'New Location',
  description: 'Description here',
  location: 'City, Region',
  region: 'Region Name',
  type: 'attraction', // or 'accommodation'
  rating: 4.5,
  coordinates: [latitude, longitude]
}
```

---

## Performance & Optimization

### ⚡ **Leaflet (Recommended)**
- **Lightweight**: ~39KB gzipped
- **Fast loading**: No external API calls
- **Offline capable**: Can work without internet
- **No rate limits**: Unlimited usage

### 🚀 **Google Maps**
- **CDN hosted**: Fast global delivery
- **Cached tiles**: Efficient data loading
- **Progressive loading**: Smooth user experience
- **API quotas**: Monitor usage limits

---

## Troubleshooting

### 🐛 **Common Issues**

#### Leaflet Map Not Loading
- Check browser console for errors
- Ensure Leaflet CSS is loaded
- Verify coordinates are valid numbers

#### Google Maps Not Loading
- Verify API key is correct
- Check API key restrictions
- Ensure Maps JavaScript API is enabled
- Monitor API usage quotas

#### Markers Not Showing
- Verify location coordinates
- Check marker icon creation
- Ensure map is properly initialized

### 🔍 **Debug Steps**
1. **Check Console**: Look for JavaScript errors
2. **Verify API Keys**: Ensure environment variables are set
3. **Test Coordinates**: Validate latitude/longitude values
4. **Check Network**: Monitor API requests and responses

---

## Best Practices

### 🎯 **For Production**
- **Use Leaflet by default** (free, reliable)
- **Offer Google Maps** as premium option
- **Implement caching** for map tiles
- **Monitor performance** metrics

### 🔒 **Security**
- **Restrict API keys** to your domain
- **Monitor usage** to prevent abuse
- **Implement rate limiting** if needed
- **Use HTTPS** for all map requests

---

## Support & Resources

### 📚 **Documentation**
- [Leaflet Documentation](https://leafletjs.com/reference.html)
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [OpenStreetMap](https://www.openstreetmap.org/)

### 🛠️ **Community**
- [Leaflet GitHub](https://github.com/Leaflet/Leaflet)
- [Google Maps Platform](https://developers.google.com/maps)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/leaflet)

---

## Conclusion

Your travel app now has **professional-grade mapping** with:

✅ **Leaflet Maps** - Free, reliable, and feature-rich  
✅ **Google Maps** - Premium option for enhanced features  
✅ **Interactive Markers** - Click to explore locations  
✅ **Travel Routes** - Visual journey planning  
✅ **Responsive Design** - Works on all devices  
✅ **Easy Switching** - Users can choose their preferred map  

**Recommendation**: Start with Leaflet (it's already working perfectly), and add Google Maps later if you need premium features or want to offer users a choice.
