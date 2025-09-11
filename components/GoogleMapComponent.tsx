'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

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

interface GoogleMapComponentProps {
  locations: Location[]
  onLocationSelect: (location: Location) => void
  apiKey: string
}

declare global {
  namespace google {
    namespace maps {
      class Map {
        constructor(element: HTMLElement, options: {
          center: { lat: number; lng: number }
          zoom: number
          styles?: any[]
        })
        setCenter(center: { lat: number; lng: number }): void
        setZoom(zoom: number): void
      }
      
      class Marker {
        constructor(options: {
          position: { lat: number; lng: number }
          map: Map
          title: string
          icon?: any
        })
        addListener(event: string, callback: () => void): void
      }
      
      class InfoWindow {
        constructor(options: {
          content: string
        })
        open(map: Map, marker: Marker): void
        setPosition(position: { lat: number; lng: number }): void
      }
      
      class Polyline {
        constructor(options: {
          path: { lat: number; lng: number }[]
          geodesic: boolean
          strokeColor: string
          strokeOpacity: number
          strokeWeight: number
          icons?: any[]
        })
        setMap(map: Map): void
        addListener(event: string, callback: () => void): void
      }
      
      namespace SymbolPath {
        const FORWARD_CLOSED_ARROW: any
      }
      
      class Size {
        constructor(width: number, height: number)
      }
      
      class Point {
        constructor(x: number, y: number)
      }
    }
  }
  
  interface Window {
    google: typeof google
  }
}

export default function GoogleMapComponent({ locations, onLocationSelect, apiKey }: GoogleMapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.google || mapInstanceRef.current) return

    // Initialize the map centered on Ghana
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 7.9465, lng: -1.0232 },
      zoom: 7,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    })

    // Create custom markers for different location types
    const attractionIcon = {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="#3b82f6" stroke="white" stroke-width="2"/>
          <path d="M8 6a2 2 0 00-2 2v8a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2H8zm16 12H8l4-8 3 6 2-4 3 6z" fill="white"/>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(32, 32),
      anchor: new window.google.maps.Point(16, 32)
    }

    const accommodationIcon = {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="#22c55e" stroke="white" stroke-width="2"/>
          <path d="M13.414 2.586a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L6 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" fill="white"/>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(32, 32),
      anchor: new window.google.maps.Point(16, 32)
    }

    // Add markers for each location
    const markers: google.maps.Marker[] = []
    locations.forEach((location) => {
      const icon = location.type === 'attraction' ? attractionIcon : accommodationIcon
      
      const marker = new window.google.maps.Marker({
        position: { lat: location.coordinates[0], lng: location.coordinates[1] },
        map: map,
        icon: icon,
        title: location.name
      })

      // Create info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-3 max-w-xs">
            <h3 class="font-bold text-lg mb-2">${location.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${location.description}</p>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-yellow-500">★</span>
              <span class="text-sm">${location.rating}</span>
              ${location.price ? `<span class="text-green-600 font-medium">${location.price}</span>` : ''}
            </div>
            <p class="text-xs text-gray-500">${location.location}</p>
          </div>
        `
      })

      // Add click event to marker
      marker.addListener('click', () => {
        infoWindow.open(map, marker)
        onLocationSelect(location)
      })

      markers.push(marker)
    })

    // Add travel routes
    const routes = [
      {
        name: 'Golden Triangle Route',
        coordinates: [
          { lat: 5.5600, lng: -0.1869 }, // Accra
          { lat: 5.1053, lng: -1.2468 }, // Cape Coast
          { lat: 6.7000, lng: -1.6167 }  // Kumasi
        ],
        color: '#f59e0b'
      },
      {
        name: 'Coastal Route',
        coordinates: [
          { lat: 5.5600, lng: -0.1869 }, // Accra
          { lat: 5.0833, lng: -1.3500 }, // Elmina
          { lat: 5.1053, lng: -1.2468 }  // Cape Coast
        ],
        color: '#3b82f6'
      }
    ]

    routes.forEach(route => {
      const polyline = new window.google.maps.Polyline({
        path: route.coordinates,
        geodesic: true,
        strokeColor: route.color,
        strokeOpacity: 0.7,
        strokeWeight: 3,
        icons: [{
          icon: {
            path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW
          },
          offset: '50%'
        }]
      })

      polyline.setMap(map)

      // Add click event to route
      polyline.addListener('click', () => {
        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div class="p-2"><strong>${route.name}</strong></div>`
        })
        infoWindow.setPosition(route.coordinates[1])
        infoWindow.open(map, null as any)
      })
    })

    // Store references
    mapInstanceRef.current = map
    markersRef.current = markers
  }, [locations, onLocationSelect])

  useEffect(() => {
    // Load Google Maps script
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true
    
    script.onload = () => {
      setIsLoaded(true)
      initializeMap()
    }
    
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [apiKey, initializeMap])

  if (!isLoaded) {
    return (
      <div className="w-full h-96 md:h-[600px] bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Google Maps...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="w-full h-96 md:h-[600px] rounded-lg"
        style={{ zIndex: 1 }}
      />
    </div>
  )
}
