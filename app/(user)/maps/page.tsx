"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MapPin, Star, Search, Navigation, Hotel, Camera, Phone, Mail, Globe } from "lucide-react"

interface Location {
  id: string
  name: string
  type: "attraction" | "accommodation" | "route"
  coordinates: { x: number; y: number }
  rating: number
  description: string
  price?: string
  image: string
  region: string
}

const locations: Location[] = [
  {
    id: "1",
    name: "Cape Coast Castle",
    type: "attraction",
    coordinates: { x: 45, y: 65 },
    rating: 4.8,
    description: "UNESCO World Heritage site with profound historical significance",
    image: "/cape-coast-castle-ghana.png",
    region: "Central",
  },
  {
    id: "2",
    name: "Kakum National Park",
    type: "attraction",
    coordinates: { x: 42, y: 62 },
    rating: 4.7,
    description: "Famous canopy walkway and diverse wildlife",
    image: "/placeholder-s2dgm.png",
    region: "Central",
  },
  {
    id: "3",
    name: "Mole National Park",
    type: "attraction",
    coordinates: { x: 35, y: 25 },
    rating: 4.6,
    description: "Ghana's largest wildlife refuge with elephants",
    image: "/mole-national-park-elephants.png",
    region: "Northern",
  },
  {
    id: "4",
    name: "Oceanview Resort Accra",
    type: "accommodation",
    coordinates: { x: 52, y: 70 },
    rating: 4.9,
    description: "5-star beachfront luxury resort",
    price: "$180/night",
    image: "/luxury-beach-resort-accra.png",
    region: "Greater Accra",
  },
  {
    id: "5",
    name: "Rainforest Eco Lodge",
    type: "accommodation",
    coordinates: { x: 40, y: 60 },
    rating: 4.7,
    description: "Sustainable accommodation in natural setting",
    price: "$95/night",
    image: "/eco-lodge-ghana.png",
    region: "Central",
  },
  {
    id: "6",
    name: "Heritage Boutique Hotel",
    type: "accommodation",
    coordinates: { x: 38, y: 45 },
    rating: 4.8,
    description: "Authentic Ghanaian culture meets modern comfort",
    price: "$120/night",
    image: "/kumasi-boutique-hotel.png",
    region: "Ashanti",
  },
]

export default function MapsPage() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [filterType, setFilterType] = useState<"all" | "attraction" | "accommodation">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredLocations = locations.filter((location) => {
    const matchesFilter = filterType === "all" || location.type === filterType
    const matchesSearch =
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.region.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case "attraction":
        return <Camera className="w-4 h-4" />
      case "accommodation":
        return <Hotel className="w-4 h-4" />
      default:
        return <MapPin className="w-4 h-4" />
    }
  }

  const getMarkerColor = (type: string) => {
    switch (type) {
      case "attraction":
        return "bg-blue-500 hover:bg-blue-600"
      case "accommodation":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-yellow-500 hover:bg-yellow-600"
    }
  }

  return (
    <div className="min-h-screen bg-background">
     

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">Interactive Ghana Tourism Map</h2>
          <p className="text-muted-foreground max-w-2xl">
            Explore Ghana's attractions, accommodations, and travel routes on our interactive map. Click on markers to
            learn more about each destination.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search locations or regions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              onClick={() => setFilterType("all")}
              size="sm"
            >
              All Locations
            </Button>
            <Button
              variant={filterType === "attraction" ? "default" : "outline"}
              onClick={() => setFilterType("attraction")}
              size="sm"
            >
              <Camera className="w-4 h-4 mr-2" />
              Attractions
            </Button>
            <Button
              variant={filterType === "accommodation" ? "default" : "outline"}
              onClick={() => setFilterType("accommodation")}
              size="sm"
            >
              <Hotel className="w-4 h-4 mr-2" />
              Hotels
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-yellow-600" />
                  Ghana Tourism Map
                </CardTitle>
                <CardDescription>Click on markers to explore destinations across Ghana</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative w-full h-[600px] bg-gradient-to-br from-green-100 to-blue-100 overflow-hidden">
                  {/* Ghana Map Outline */}
                  <svg
                    viewBox="0 0 100 100"
                    className="absolute inset-0 w-full h-full"
                    style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
                  >
                    {/* Simplified Ghana outline */}
                    <path
                      d="M20 20 L80 20 L85 30 L80 40 L85 50 L80 60 L75 70 L70 80 L60 85 L50 80 L40 85 L30 80 L25 70 L20 60 L15 50 L20 40 L15 30 Z"
                      fill="rgba(34, 197, 94, 0.2)"
                      stroke="rgba(34, 197, 94, 0.5)"
                      strokeWidth="0.5"
                    />

                    {/* Regional boundaries */}
                    <path d="M20 35 L80 35" stroke="rgba(156, 163, 175, 0.3)" strokeWidth="0.3" strokeDasharray="1,1" />
                    <path d="M20 55 L80 55" stroke="rgba(156, 163, 175, 0.3)" strokeWidth="0.3" strokeDasharray="1,1" />
                  </svg>

                  {/* Location Markers */}
                  {filteredLocations.map((location) => (
                    <button
                      key={location.id}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full ${getMarkerColor(location.type)} text-white flex items-center justify-center shadow-lg transition-all hover:scale-110 z-10`}
                      style={{
                        left: `${location.coordinates.x}%`,
                        top: `${location.coordinates.y}%`,
                      }}
                      onClick={() => setSelectedLocation(location)}
                    >
                      {getMarkerIcon(location.type)}
                    </button>
                  ))}

                  {/* Route Lines */}
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none">
                    {/* Golden Triangle Route */}
                    <path
                      d="M52 70 Q47 67 45 65 Q42 62 42 62 Q40 50 38 45"
                      stroke="rgba(234, 179, 8, 0.6)"
                      strokeWidth="0.8"
                      fill="none"
                      strokeDasharray="2,2"
                    />

                    {/* Northern Safari Route */}
                    <path
                      d="M35 25 Q37 35 40 45"
                      stroke="rgba(34, 197, 94, 0.6)"
                      strokeWidth="0.8"
                      fill="none"
                      strokeDasharray="2,2"
                    />
                  </svg>

                  {/* Region Labels */}
                  <div className="absolute top-4 left-4 text-xs font-medium text-muted-foreground bg-white/80 px-2 py-1 rounded">
                    Northern Region
                  </div>
                  <div className="absolute top-1/2 left-4 text-xs font-medium text-muted-foreground bg-white/80 px-2 py-1 rounded">
                    Central Region
                  </div>
                  <div className="absolute bottom-4 right-4 text-xs font-medium text-muted-foreground bg-white/80 px-2 py-1 rounded">
                    Greater Accra
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Location Details */}
          <div className="space-y-6">
            {selectedLocation ? (
              <Card>
                <div className="h-48 overflow-hidden">
                  <img
                    src={selectedLocation.image || "/placeholder.svg"}
                    alt={selectedLocation.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getMarkerIcon(selectedLocation.type)}
                        {selectedLocation.name}
                      </CardTitle>
                      <CardDescription className="mt-2">{selectedLocation.description}</CardDescription>
                    </div>
                    <Badge variant="secondary">{selectedLocation.region}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{selectedLocation.rating}</span>
                    </div>
                    {selectedLocation.price && (
                      <span className="text-lg font-bold text-foreground">{selectedLocation.price}</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Button className="w-full bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700">
                      {selectedLocation.type === "accommodation" ? "Book Now" : "Learn More"}
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Select a Location</CardTitle>
                  <CardDescription>
                    Click on any marker on the map to view detailed information about attractions and accommodations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Camera className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm">Tourist Attractions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Hotel className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm">Accommodations</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                        <MapPin className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm">Travel Routes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {locations.filter((l) => l.type === "attraction").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Attractions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {locations.filter((l) => l.type === "accommodation").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Hotels</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">10</div>
                    <div className="text-sm text-muted-foreground">Regions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">2</div>
                    <div className="text-sm text-muted-foreground">Routes</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

    
    </div>
  )
}
