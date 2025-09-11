'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Location {
  id: string
  name: string
  description: string
  location: string
  region: string
  type: 'attraction' | 'accommodation'
  rating: number
  price?: string
  coordinates: [number, number] // [latitude, longitude]
}

interface MapComponentProps {
  locations: Location[]
  onLocationSelect: (location: Location) => void
}

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as unknown)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

export default function MapComponent({ locations, onLocationSelect }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize the map centered on Ghana
    const map = L.map(mapRef.current).setView([7.9465, -1.0232], 7)

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map)


    // Create custom icons for different location types
    const attractionIcon = L.divIcon({
      className: 'custom-marker attraction',
      html: `
        <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
          </svg>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })

    const accommodationIcon = L.divIcon({
      className: 'custom-marker accommodation',
      html: `
        <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })

    // Add markers for each location
    locations.forEach((location) => {
      const icon = location.type === 'attraction' ? attractionIcon : accommodationIcon
      
      const marker = L.marker(location.coordinates, { icon })
        .addTo(map)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-bold text-lg mb-1">${location.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${location.description}</p>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-yellow-500">★</span>
              <span class="text-sm">${location.rating}</span>
              ${location.price ? `<span class="text-green-600 font-medium">${location.price}</span>` : ''}
            </div>
            <p class="text-xs text-gray-500">${location.location}</p>
          </div>
        `)

      // Add click event to select location
      marker.on('click', () => {
        onLocationSelect(location)
      })
    })

    // Add some travel routes
    const routes = [
      {
        name: 'Golden Triangle Route',
        coordinates: [
          [5.5600, -0.1869], // Accra
          [5.1053, -1.2468], // Cape Coast
          [6.7000, -1.6167]  // Kumasi
        ],
        color: '#f59e0b'
      },
      {
        name: 'Coastal Route',
        coordinates: [
          [5.5600, -0.1869], // Accra
          [5.0833, -1.3500], // Elmina
          [5.1053, -1.2468]  // Cape Coast
        ],
        color: '#3b82f6'
      }
    ]

    routes.forEach(route => {
      L.polyline(route.coordinates, {
        color: route.color,
        weight: 3,
        opacity: 0.7,
        dashArray: '10, 5'
      }).addTo(map).bindPopup(route.name)
    })

    // Store map instance
    mapInstanceRef.current = map

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [locations, onLocationSelect])

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="w-full h-96 md:h-[600px] rounded-lg"
        style={{ zIndex: 1 }}
      />
      
      {/* Custom CSS for markers */}
      <style jsx global>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        
        .custom-marker.attraction div {
          transition: all 0.2s ease;
        }
        
        .custom-marker.accommodation div {
          transition: all 0.2s ease;
        }
        
        .custom-marker:hover div {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .leaflet-popup-tip {
          background: white;
        }
      `}</style>
    </div>
  )
}
