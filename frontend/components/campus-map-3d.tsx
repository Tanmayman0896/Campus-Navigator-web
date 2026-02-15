"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Users, Clock, Search, Zap, Building, Home, BookOpen, UtensilsCrossed, Dumbbell, GraduationCap, Library, Coffee } from "lucide-react"

interface CampusLocation {
  id: number
  lat: number
  lng: number
  name: string
  description: string
  type: string
  category: string
  amenities: string[]
}

// Campus locations using the provided coordinates
const campusLocations: CampusLocation[] = [
  {
    id: 1,
    lat: 26.8429858,
    lng: 75.5643866,
    name: 'Main Campus',
    description: 'Main entrance of the campus',
    type: 'entrance',
    category: 'Academic',
    amenities: ['Parking', 'Information Desk', 'WiFi']
  },
  {
    id: 2,
    lat: 26.8435000,
    lng: 75.5650000,
    name: 'Central Library',
    description: 'Main library with extensive digital and physical collections',
    type: 'library',
    category: 'Academic',
    amenities: ['Study Rooms', 'Computer Lab', 'WiFi', 'Printing']
  },
  {
    id: 3,
    lat: 26.8425000,
    lng: 75.5640000,
    name: 'Student Center',
    description: 'Hub for student activities and dining',
    type: 'student_center',
    category: 'Social',
    amenities: ['Cafeteria', 'Recreation Room', 'Study Areas', 'WiFi']
  },
  {
    id: 4,
    lat: 26.8440000,
    lng: 75.5655000,
    name: 'Engineering Building',
    description: 'Main engineering departments and labs',
    type: 'academic_building',
    category: 'Academic',
    amenities: ['Computer Labs', 'Workshop', 'Classrooms', 'WiFi']
  },
  {
    id: 5,
    lat: 26.8420000,
    lng: 75.5645000,
    name: 'Sports Complex',
    description: 'Athletic facilities and gymnasium',
    type: 'recreation',
    category: 'Recreation',
    amenities: ['Gym', 'Swimming Pool', 'Courts', 'Locker Rooms']
  },
  {
    id: 6,
    lat: 26.8445000,
    lng: 75.5660000,
    name: 'Residence Hall A',
    description: 'Student dormitory with modern amenities',
    type: 'housing',
    category: 'Housing',
    amenities: ['Common Room', 'Laundry', 'WiFi', 'Study Areas']
  }
]

// Map container style
const mapContainerStyle = {
  width: '100%',
  height: '500px'
}

// Center of the campus
const center = {
  lat: 26.8430000,
  lng: 75.5647000
}

// Custom marker icons for different location types
const getMarkerIcon = (category: string) => {
  const iconMap: Record<string, string> = {
    'Academic': '#3B82F6', // Blue
    'Social': '#10B981', // Green
    'Recreation': '#F59E0B', // Orange
    'Housing': '#8B5CF6', // Purple
  }
  
  return {
    fillColor: iconMap[category] || '#6B7280',
    fillOpacity: 1,
    strokeWeight: 2,
    strokeColor: '#FFFFFF',
    scale: 8,
    path: google.maps.SymbolPath.CIRCLE
  }
}

// Get category icon
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Academic': return <GraduationCap className="w-4 h-4" />
    case 'Social': return <Users className="w-4 h-4" />
    case 'Recreation': return <Dumbbell className="w-4 h-4" />
    case 'Housing': return <Home className="w-4 h-4" />
    default: return <Building className="w-4 h-4" />
  }
}

export default function CampusMap() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['places']
  })

  const [selectedLocation, setSelectedLocation] = useState<CampusLocation | null>(null)
  const [filteredLocations, setFilteredLocations] = useState<CampusLocation[]>(campusLocations)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null)

  // Filter locations based on search and category
  useEffect(() => {
    let filtered = campusLocations

    if (searchQuery) {
      filtered = filtered.filter(location =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.amenities.some(amenity => 
          amenity.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter(location => location.category === selectedCategory)
    }

    setFilteredLocations(filtered)
  }, [searchQuery, selectedCategory])

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMapRef(map)
    
    // Enable 3D view and buildings
    map.setMapTypeId('satellite')
    map.setTilt(45) // Enable 3D view
    
    // Set map options for better 3D experience
    map.setOptions({
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_CENTER,
        mapTypeIds: [
          google.maps.MapTypeId.ROADMAP,
          google.maps.MapTypeId.SATELLITE,
          google.maps.MapTypeId.HYBRID,
          google.maps.MapTypeId.TERRAIN
        ]
      },
      rotateControl: true,
      scaleControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      gestureHandling: 'cooperative',
      zoomControl: true,
      styles: [] // You can add custom styling here if needed
    })
  }, [])

  const handleMarkerClick = (location: CampusLocation) => {
    setSelectedLocation(location)
  }

  const handleLocationSelect = (location: CampusLocation) => {
    if (mapRef) {
      mapRef.panTo({ lat: location.lat, lng: location.lng })
      mapRef.setZoom(18)
      setSelectedLocation(location)
    }
  }

  const categories = ["All", ...Array.from(new Set(campusLocations.map(loc => loc.category)))]

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <Card className="backdrop-blur-sm bg-white/80 border-white/20">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Google Maps API key is required. Please check your environment configuration.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Interactive Campus Map
        </h2>
        <p className="text-gray-600">Explore campus locations in stunning 3D view</p>
      </div>

      {/* Search and Filter Controls */}
      <Card className="backdrop-blur-sm bg-white/80 border-white/20">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search locations, amenities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/50 border-white/20"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600" 
                    : "bg-white/50 border-white/20 hover:bg-white/70"
                  }
                >
                  {category !== "All" && getCategoryIcon(category)}
                  <span className={category !== "All" ? "ml-1" : ""}>{category}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card className="backdrop-blur-sm bg-white/80 border-white/20 overflow-hidden">
            <CardContent className="p-0">
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  zoom={16}
                  onLoad={onMapLoad}
                  options={{
                    disableDefaultUI: false,
                    mapTypeId: 'satellite',
                    tilt: 45,
                    heading: 0,
                    mapTypeControl: true,
                    rotateControl: true,
                    scaleControl: true,
                    streetViewControl: true,
                    fullscreenControl: true,
                    gestureHandling: 'cooperative'
                  }}
                >
                  {filteredLocations.map((location) => (
                    <Marker
                      key={location.id}
                      position={{ lat: location.lat, lng: location.lng }}
                      icon={getMarkerIcon(location.category)}
                      onClick={() => handleMarkerClick(location)}
                      title={location.name}
                    />
                  ))}

                  {selectedLocation && (
                    <InfoWindow
                      position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                      onCloseClick={() => setSelectedLocation(null)}
                    >
                      <div className="p-2 max-w-xs">
                        <h3 className="font-bold text-lg mb-1">{selectedLocation.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{selectedLocation.description}</p>
                        <div className="flex items-center gap-2 mb-2">
                          {getCategoryIcon(selectedLocation.category)}
                          <Badge variant="secondary" className="text-xs">
                            {selectedLocation.category}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500">
                          <strong>Amenities:</strong> {selectedLocation.amenities.join(', ')}
                        </div>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              ) : (
                <div className="h-96 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading 3D Campus Map...</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Location List */}
        <div className="space-y-4">
          <Card className="backdrop-blur-sm bg-white/80 border-white/20">
            <CardHeader>
              <CardTitle className="text-lg">Campus Locations</CardTitle>
              <CardDescription>
                {filteredLocations.length} location{filteredLocations.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {filteredLocations.map((location) => (
                  <div
                    key={location.id}
                    className="p-4 border-b border-gray-100 hover:bg-gray-50/50 cursor-pointer transition-colors"
                    onClick={() => handleLocationSelect(location)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getCategoryIcon(location.category)}
                          <h3 className="font-semibold text-sm">{location.name}</h3>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{location.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {location.amenities.slice(0, 3).map((amenity) => (
                            <Badge key={amenity} variant="outline" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {location.amenities.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{location.amenities.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Map Controls Info */}
          <Card className="backdrop-blur-sm bg-white/80 border-white/20">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                3D Navigation Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <p>• <strong>Rotate:</strong> Hold Shift + click and drag</p>
              <p>• <strong>Tilt:</strong> Hold Ctrl + click and drag</p>
              <p>• <strong>Zoom:</strong> Mouse wheel or +/- buttons</p>
              <p>• <strong>Switch view:</strong> Use map type controls</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
