"use client"

import { useState, useCallback } from "react"
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Users, Clock, Search, Zap, Building, Home, BookOpen, UtensilsCrossed, Dumbbell, GraduationCap } from "lucide-react"

interface CampusLocation {
  id: number
  lat: number
  lng: number
  name: string
  description?: string
  type: LocationType
  category: string
  amenities: string[]
  mentors: number
  tips: number
  address: string
}

type LocationType = 'library' | 'social' | 'academic' | 'dining' | 'recreation' | 'housing'

const campusLocations: CampusLocation[] = [
  { 
    id: 1, 
    name: "Main Library", 
    type: "library", 
    lat: 40.7589, 
    lng: -73.9851, 
    mentors: 3, 
    tips: 12,
    address: "5th Ave, New York, NY 10018",
    category: "Academic",
    amenities: ["WiFi", "Study Rooms", "Computer Lab"]
  },
  { 
    id: 2, 
    name: "Student Center", 
    type: "social", 
    lat: 40.7614, 
    lng: -73.9776, 
    mentors: 5, 
    tips: 8,
    address: "Park Ave, New York, NY 10016",
    category: "Social",
    amenities: ["Cafeteria", "Recreation Room", "Meeting Rooms"]
  },
  { 
    id: 3, 
    name: "Engineering Building", 
    type: "academic", 
    lat: 40.7505, 
    lng: -73.9934, 
    mentors: 4, 
    tips: 15,
    address: "Washington Sq S, New York, NY 10012",
    category: "Academic",
    amenities: ["Labs", "Workshops", "3D Printing"]
  },
  { 
    id: 4, 
    name: "Dining Hall", 
    type: "dining", 
    lat: 40.7580, 
    lng: -73.9855, 
    mentors: 2, 
    tips: 6,
    address: "W 42nd St, New York, NY 10018",
    category: "Dining",
    amenities: ["Multiple Cuisines", "Vegan Options", "Late Hours"]
  },
  { 
    id: 5, 
    name: "Gym & Recreation", 
    type: "recreation", 
    lat: 40.7829, 
    lng: -73.9654, 
    mentors: 3, 
    tips: 9,
    address: "Central Park West, New York, NY 10024",
    category: "Recreation",
    amenities: ["Gym", "Pool", "Courts", "Classes"]
  },
  { 
    id: 6, 
    name: "Dormitory A", 
    type: "housing", 
    lat: 40.7488, 
    lng: -73.9857, 
    mentors: 6, 
    tips: 18,
    address: "MacDougal St, New York, NY 10012",
    category: "Housing",
    amenities: ["Common Areas", "Laundry", "Study Lounges"]
  },
]

const locationTypes: Record<LocationType, { color: string; icon: string }> = {
  library: { color: "#3B82F6", icon: "📚" },
  social: { color: "#10B981", icon: "🏛️" },
  academic: { color: "#8B5CF6", icon: "🎓" },
  dining: { color: "#F97316", icon: "🍽️" },
  recreation: { color: "#EF4444", icon: "🏃" },
  housing: { color: "#EAB308", icon: "🏠" },
}

// Map container style
const mapContainerStyle = {
  width: '100%',
  height: '400px'
}

const center = {
  lat: 40.7589,
  lng: -73.9851
}

export default function CampusMap() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  })

  const [selectedLocation, setSelectedLocation] = useState<CampusLocation | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [map, setMap] = useState<google.maps.Map | null>(null)

  const filteredLocations = campusLocations.filter((location) =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.amenities.some(amenity => amenity.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  const handleMarkerClick = (location: CampusLocation) => {
    setSelectedLocation(location)
  }

  const handleLocationSelect = useCallback((location: CampusLocation | null) => {
    setSelectedLocation(location)
    if (location && map) {
      map.panTo({ lat: location.lat, lng: location.lng })
      map.setZoom(16)
    }
  }, [map])

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="space-y-6 animate-slide-in-up">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white">
                <MapPin className="w-6 h-6" />
              </div>
              Interactive Campus Map
            </CardTitle>
            <CardDescription className="mt-2 text-base text-red-600">
              Google Maps API key is missing. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="space-y-6 animate-slide-in-up">
        <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl text-red-600">
              <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl text-white">
                <MapPin className="w-6 h-6" />
              </div>
              Map Loading Error
            </CardTitle>
            <CardDescription className="mt-2 text-base text-red-600">
              Failed to load Google Maps. Please check your API key and internet connection.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-slide-in-up">
      {/* Header Section */}
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white">
                  <MapPin className="w-6 h-6" />
                </div>
                Interactive Campus Map
              </CardTitle>
              <CardDescription className="mt-2 text-base">
                Explore campus locations, find mentors, and discover helpful tips from fellow students
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-white/50 backdrop-blur-sm border-white/20 rounded-xl text-base"
              />
            </div>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 h-12 px-6 bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/70 rounded-xl"
            >
              <Navigation className="w-5 h-5" />
              Get Directions
            </Button>
          </div>

          {/* Interactive Map */}
          <div className="relative bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={14}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                  zoomControl: true,
                  streetViewControl: true,
                  mapTypeControl: true,
                  fullscreenControl: true,
                }}
              >
                {filteredLocations.map((location) => (
                  <Marker
                    key={location.id}
                    position={{ lat: location.lat, lng: location.lng }}
                    onClick={() => handleMarkerClick(location)}
                    icon={{
                      path: google.maps.SymbolPath.CIRCLE,
                      scale: 12,
                      fillColor: locationTypes[location.type].color,
                      fillOpacity: 1,
                      strokeColor: '#ffffff',
                      strokeWeight: 2,
                    }}
                  />
                ))}

                {selectedLocation && (
                  <InfoWindow
                    position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                    onCloseClick={() => setSelectedLocation(null)}
                  >
                    <div className="p-3 max-w-xs">
                      <h3 className="font-bold text-lg mb-1">{selectedLocation.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{selectedLocation.address}</p>
                      <div className="flex items-center gap-3 mb-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-blue-600" />
                          <span className="text-blue-700 font-medium">{selectedLocation.mentors} mentors</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-purple-600" />
                          <span className="text-purple-700 font-medium">{selectedLocation.tips} tips</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        <strong>Amenities:</strong> {selectedLocation.amenities.join(', ')}
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            ) : (
              <div className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading Campus Map...</p>
                </div>
              </div>
            )}
          </div>

          {/* Selected Location Details */}
          {selectedLocation && (
            <div className="mt-6 p-6 bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl animate-slide-in-up">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">{selectedLocation.name}</h3>
                  <p className="text-muted-foreground mb-2">{selectedLocation.address}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-700">{selectedLocation.mentors} mentors available</span>
                    </div>
                    <div className="flex items-center gap-2 bg-purple-100 px-3 py-1 rounded-full">
                      <Zap className="w-4 h-4 text-purple-600" />
                      <span className="font-medium text-purple-700">{selectedLocation.tips} helpful tips</span>
                    </div>
                  </div>
                </div>
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg"
                  style={{ backgroundColor: locationTypes[selectedLocation.type].color }}
                >
                  {locationTypes[selectedLocation.type].icon}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 text-white">
                  Connect with Mentors
                </Button>
                <Button variant="outline" className="bg-white/50 backdrop-blur-sm border-white/30 hover:bg-white/70">
                  View Tips
                </Button>
                <Button variant="outline" className="bg-white/50 backdrop-blur-sm border-white/30 hover:bg-white/70">
                  Get Directions
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="group bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">Find Mentors</h3>
                <p className="text-sm text-muted-foreground">Connect with upperclassmen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">Live Help</h3>
                <p className="text-sm text-muted-foreground">Get instant assistance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">Campus Hacks</h3>
                <p className="text-sm text-muted-foreground">Student tips & tricks</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
