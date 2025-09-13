"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Wrapper, Status } from "@googlemaps/react-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Navigation, Users, Clock, Search, Zap } from "lucide-react"

type LocationType = "library" | "social" | "academic" | "dining" | "recreation" | "housing"

interface CampusLocation {
  id: number
  name: string
  type: LocationType
  lat: number
  lng: number
  mentors: number
  tips: number
  address: string
}

const campusLocations: CampusLocation[] = [
  { 
    id: 1, 
    name: "Main Library", 
    type: "library", 
    lat: 40.7589, 
    lng: -73.9851, 
    mentors: 3, 
    tips: 12,
    address: "5th Ave, New York, NY 10018"
  },
  { 
    id: 2, 
    name: "Student Center", 
    type: "social", 
    lat: 40.7614, 
    lng: -73.9776, 
    mentors: 5, 
    tips: 8,
    address: "Park Ave, New York, NY 10016"
  },
  { 
    id: 3, 
    name: "Engineering Building", 
    type: "academic", 
    lat: 40.7505, 
    lng: -73.9934, 
    mentors: 4, 
    tips: 15,
    address: "Washington Sq S, New York, NY 10012"
  },
  { 
    id: 4, 
    name: "Dining Hall", 
    type: "dining", 
    lat: 40.7580, 
    lng: -73.9855, 
    mentors: 2, 
    tips: 6,
    address: "W 42nd St, New York, NY 10018"
  },
  { 
    id: 5, 
    name: "Gym & Recreation", 
    type: "recreation", 
    lat: 40.7829, 
    lng: -73.9654, 
    mentors: 3, 
    tips: 9,
    address: "Central Park West, New York, NY 10024"
  },
  { 
    id: 6, 
    name: "Dormitory A", 
    type: "housing", 
    lat: 40.7488, 
    lng: -73.9857, 
    mentors: 6, 
    tips: 18,
    address: "MacDougal St, New York, NY 10012"
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

// Google Maps component
function GoogleMap({ 
  center, 
  zoom, 
  locations, 
  onLocationSelect 
}: {
  center: { lat: number; lng: number }
  zoom: number
  locations: CampusLocation[]
  onLocationSelect: (location: CampusLocation | null) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map>()
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow>()

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      })
      setMap(newMap)
      
      const newInfoWindow = new window.google.maps.InfoWindow()
      setInfoWindow(newInfoWindow)
    }
  }, [ref, map, center, zoom])

  useEffect(() => {
    if (map && locations) {
      // Clear existing markers
      markers.forEach((marker: google.maps.Marker) => marker.setMap(null))
      
      // Create new markers
      const newMarkers = locations.map(location => {
        const marker = new window.google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map,
          title: location.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: locationTypes[location.type].color,
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          }
        })

        marker.addListener('click', () => {
          const content = `
            <div style="padding: 8px; max-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold;">${location.name}</h3>
              <p style="margin: 0 0 8px 0; color: #666; font-size: 12px;">${location.address}</p>
              <div style="display: flex; gap: 16px; margin-bottom: 8px; font-size: 12px;">
                <span>👥 ${location.mentors} mentors</span>
                <span>⚡ ${location.tips} tips</span>
              </div>
              <button 
                onclick="window.selectLocation(${location.id})" 
                style="background: #3B82F6; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;"
              >
                View Details
              </button>
            </div>
          `
          
          if (infoWindow) {
            infoWindow.setContent(content)
            infoWindow.open(map, marker)
          }
          
          onLocationSelect(location)
        })

        return marker
      })
      
      setMarkers(newMarkers)
    }
  }, [map, locations, infoWindow, onLocationSelect])

  // Global function for info window button
  useEffect(() => {
    (window as any).selectLocation = (locationId: number) => {
      const location = locations.find(loc => loc.id === locationId)
      if (location) {
        onLocationSelect(location)
      }
    }
  }, [locations, onLocationSelect])

  return <div ref={ref} style={{ width: "100%", height: "400px" }} />
}

// Status component for Google Maps loading
const MapStatus = ({ status }: { status: Status }) => {
  if (status === Status.LOADING) return <div className="h-96 flex items-center justify-center">Loading Maps...</div>
  if (status === Status.FAILURE) return <div className="h-96 flex items-center justify-center text-red-500">Error loading maps</div>
  return null
}

export default function CampusMap() {
  const [selectedLocation, setSelectedLocation] = useState<CampusLocation | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredLocations = campusLocations.filter((location) =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const campusCenter = { lat: 40.7589, lng: -73.9851 } // New York area for demo

  const handleLocationSelect = useCallback((location: CampusLocation | null) => {
    setSelectedLocation(location)
  }, [])

  const render = (status: Status) => {
    if (status === Status.SUCCESS) {
      return (
        <GoogleMap
          center={campusCenter}
          zoom={14}
          locations={filteredLocations}
          onLocationSelect={handleLocationSelect}
        />
      )
    }
    return <MapStatus status={status} />
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
            {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY !== 'your_google_maps_api_key_here' ? (
              <Wrapper 
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} 
                render={render}
              />
            ) : (
              <div className="relative h-96 bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20">
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23164e63' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                >
                  {/* Campus Locations */}
                  {filteredLocations.map((location) => {
                    // Convert lat/lng to percentage for display
                    const x = ((location.lng + 74) * 100) % 100; // Rough conversion for demo
                    const y = ((40.8 - location.lat) * 100) % 100; // Rough conversion for demo
                    
                    return (
                      <div
                        key={location.id}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 ${
                          selectedLocation?.id === location.id ? "scale-125 z-20" : "z-10"
                        }`}
                        style={{ left: `${x}%`, top: `${y}%` }}
                        onClick={() => setSelectedLocation(location)}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-xl ring-4 ring-white/50 backdrop-blur-sm transition-all duration-300 ${
                            selectedLocation?.id === location.id ? 'animate-pulse scale-110' : 'hover:scale-105'
                          }`}
                          style={{ backgroundColor: locationTypes[location.type].color }}
                        >
                          <span className="text-lg">{locationTypes[location.type].icon}</span>
                        </div>
                        
                        {selectedLocation?.id === location.id && (
                          <div className="absolute top-14 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl min-w-56 z-30 animate-bounce-in">
                            <h4 className="font-bold text-lg text-foreground mb-1">{location.name}</h4>
                            <p className="text-sm text-muted-foreground mb-3">{location.address}</p>
                            <div className="flex items-center gap-4 text-sm mb-3">
                              <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg">
                                <Users className="w-3 h-3 text-blue-600" />
                                <span className="text-blue-700 font-medium">{location.mentors} mentors</span>
                              </div>
                              <div className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-lg">
                                <Zap className="w-3 h-3 text-purple-600" />
                                <span className="text-purple-700 font-medium">{location.tips} tips</span>
                              </div>
                            </div>
                            <Button size="sm" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 text-white">
                              View Details
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Modern Map Legend */}
                <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-xl">
                  <h4 className="text-sm font-bold mb-3 text-foreground">Campus Locations</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {Object.entries(locationTypes).map(([type, config]) => (
                      <div key={type} className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full flex items-center justify-center shadow-sm"
                          style={{ backgroundColor: config.color }}
                        >
                          <span className="text-[10px]">{config.icon}</span>
                        </div>
                        <span className="capitalize font-medium text-foreground">{type}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <p className="text-xs text-muted-foreground font-medium">
                      💡 Add your Google Maps API key for real maps
                    </p>
                  </div>
                </div>

                {/* Floating Stats */}
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-3 shadow-xl">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{filteredLocations.length}</div>
                    <div className="text-xs text-muted-foreground font-medium">Locations</div>
                  </div>
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
