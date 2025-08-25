'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Globe, Layers } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import map components to avoid SSR issues
const LeafletMap = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Leaflet map...</p>
      </div>
    </div>
  )
})

const GoogleMap = dynamic(() => import('./GoogleMapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Google Maps...</p>
      </div>
    </div>
  )
})

interface Location {
  id: string
  name: string
  description: string
  location: string
  region: string
  type: 'attraction' | 'accommodation'
  rating: number
  price?: string
  coordinates: [number, number]
}

interface MapSelectorProps {
  locations: Location[]
  onLocationSelect: (location: Location) => void
  googleMapsApiKey?: string
}

export default function MapSelector({ locations, onLocationSelect, googleMapsApiKey }: MapSelectorProps) {
  const [selectedMap, setSelectedMap] = useState<'leaflet' | 'google'>('leaflet')

  return (
    <div className="space-y-4">
      {/* Map Type Selector */}
      <div className="flex gap-2 p-2 bg-gray-100 rounded-lg">
        <Button
          variant={selectedMap === 'leaflet' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setSelectedMap('leaflet')}
          className="flex-1"
        >
          <Globe className="w-4 h-4 mr-2" />
          Leaflet (Free)
        </Button>
        <Button
          variant={selectedMap === 'google' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setSelectedMap('google')}
          className="flex-1"
          disabled={!googleMapsApiKey}
        >
          <MapPin className="w-4 h-4 mr-2" />
          Google Maps
        </Button>
      </div>

      {/* Map Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card className={`cursor-pointer transition-all ${selectedMap === 'leaflet' ? 'ring-2 ring-blue-500' : ''}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              Leaflet Maps
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-gray-600 mb-2">
              Free, open-source mapping solution with OpenStreetMap data
            </p>
            <div className="text-xs text-gray-500 space-y-1">
              <div>✓ Completely free</div>
              <div>✓ No API key required</div>
              <div>✓ OpenStreetMap data</div>
              <div>✓ Lightweight & fast</div>
            </div>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer transition-all ${selectedMap === 'google' ? 'ring-2 ring-blue-500' : ''}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-600" />
              Google Maps
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-gray-600 mb-2">
              Premium mapping with Google's extensive data and features
            </p>
            <div className="text-xs text-gray-500 space-y-1">
              <div>✓ High-quality satellite imagery</div>
              <div>✓ Street view integration</div>
              <div>✓ Advanced routing</div>
              <div>⚠ Requires API key</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Map */}
      <div className="border rounded-lg overflow-hidden">
        {selectedMap === 'leaflet' ? (
          <LeafletMap 
            locations={locations}
            onLocationSelect={onLocationSelect}
          />
        ) : (
          googleMapsApiKey ? (
            <GoogleMap 
              locations={locations}
              onLocationSelect={onLocationSelect}
              apiKey={googleMapsApiKey}
            />
          ) : (
            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Google Maps API Key Required</h3>
                <p className="text-gray-600 mb-4">
                  To use Google Maps, you need to add your API key to the environment variables.
                </p>
                <div className="text-sm text-gray-500 bg-gray-200 p-3 rounded font-mono">
                  GOOGLE_MAPS_API_KEY=your_api_key_here
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Map Features */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
          <Layers className="w-4 h-4" />
          Map Features
        </h4>
        <div className="text-sm text-blue-800 space-y-1">
          <div>• Interactive markers for attractions and hotels</div>
          <div>• Click markers to view location details</div>
          <div>• Travel routes between major destinations</div>
          <div>• Ghana country boundary overlay</div>
          <div>• Responsive design for all devices</div>
        </div>
      </div>
    </div>
  )
}
