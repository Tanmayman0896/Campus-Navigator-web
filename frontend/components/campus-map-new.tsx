"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Navigation, 
  Search, 
  Building, 
  Home, 
  BookOpen, 
  UtensilsCrossed, 
  Dumbbell, 
  GraduationCap,
  Library,
  Camera,
  Eye,
  Clock,
  Phone,
  Map,
  Locate,
  Navigation2
} from "lucide-react"
import { CampusBuilding, Amenity, PanoramicImage, campusBuildings, searchBuildings } from "@/lib/campus-data"
import PanoramicViewer from "./panoramic-viewer"

interface InteractiveCampusMapProps {
  onLocationSelect?: (building: CampusBuilding) => void
}

// Geoapify API configuration
const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || "23df9c54a7d5478eb066b5c617624512"
const GEOAPIFY_BASE_URL = "https://maps.geoapify.com/v1/staticmap"

// Category colors and icons
const categoryConfig = {
  academic: { color: 'bg-blue-500', icon: GraduationCap, label: 'Academic' },
  dining: { color: 'bg-orange-500', icon: UtensilsCrossed, label: 'Dining' },
  recreation: { color: 'bg-green-500', icon: Dumbbell, label: 'Recreation' },
  housing: { color: 'bg-purple-500', icon: Home, label: 'Housing' },
  library: { color: 'bg-indigo-500', icon: Library, label: 'Library' },
  administrative: { color: 'bg-gray-500', icon: Building, label: 'Administrative' },
  medical: { color: 'bg-red-500', icon: Building, label: 'Medical' }
}

interface UserLocation {
  lat: number
  lng: number
  accuracy?: number
}

export default function InteractiveCampusMap({ onLocationSelect }: InteractiveCampusMapProps) {
  const [selectedBuilding, setSelectedBuilding] = useState<CampusBuilding | null>(null)
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null)
  const [selectedImage, setSelectedImage] = useState<PanoramicImage | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [viewMode, setViewMode] = useState<'map' | 'panoramic'>('map')
  const [filteredBuildings, setFilteredBuildings] = useState<CampusBuilding[]>(campusBuildings)
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [mapImageUrl, setMapImageUrl] = useState<string>("")
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)

  // Filter buildings based on search and category
  useEffect(() => {
    let filtered = campusBuildings

    if (searchQuery.trim()) {
      filtered = searchBuildings(searchQuery)
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter(building => building.category === selectedCategory)
    }

    setFilteredBuildings(filtered)
  }, [searchQuery, selectedCategory])

  // Get user's current location
  const getCurrentLocation = () => {
    setIsLoadingLocation(true)
    
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.")
      setIsLoadingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        }
        setUserLocation(location)
        setIsLoadingLocation(false)
        generateMapImage(location)
      },
      (error) => {
        console.error("Error getting location:", error)
        setIsLoadingLocation(false)
        // Fallback to campus center if location access denied
        generateMapImage()
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }

  // Generate Geoapify static map URL
  const generateMapImage = (currentLocation?: UserLocation) => {
    const campusCenter = { lat: 26.8430000, lng: 75.5647000 }
    const centerLocation = currentLocation || campusCenter
    
    let markers: string[] = []
    
    // Add user location marker if available
    if (currentLocation) {
      markers.push(`lonlat:${currentLocation.lng},${currentLocation.lat};type:awesome;color:%23ff6b6b;size:large;icon:user`)
    }
    
    // Add campus building markers
    filteredBuildings.forEach((building, index) => {
      const config = categoryConfig[building.category]
      const colorMap: Record<string, string> = {
        'academic': '%2374b9ff',
        'dining': '%23ff9500', 
        'recreation': '%2300c851',
        'housing': '%239c88ff',
        'library': '%236366f1',
        'administrative': '%236b7280',
        'medical': '%23ef4444'
      }
      
      const markerColor = colorMap[building.category] || '%236b7280'
      markers.push(`lonlat:${building.coordinates.lng},${building.coordinates.lat};type:material;color:${markerColor};size:medium;icon:place`)
    })
    
    // Construct the URL properly
    const baseUrl = 'https://maps.geoapify.com/v1/staticmap'
    const params = new URLSearchParams({
      style: 'osm-bright-smooth',
      width: '800',
      height: '500',
      center: `lonlat:${centerLocation.lng},${centerLocation.lat}`,
      zoom: '16',
      apiKey: GEOAPIFY_API_KEY
    })
    
    // Add markers if any exist
    if (markers.length > 0) {
      params.append('marker', markers.join('|'))
    }
    
    const url = `${baseUrl}?${params.toString()}`
    console.log('Generated map URL:', url) // Debug log
    setMapImageUrl(url)
  }

  // Initialize map on component mount
  useEffect(() => {
    // Test the API first with a simple URL
    const testUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=800&height=500&center=lonlat:75.5647000,26.8430000&zoom=16&apiKey=${GEOAPIFY_API_KEY}`
    console.log('Testing API with URL:', testUrl)
    
    // Test if the API key works
    fetch(testUrl)
      .then(response => {
        if (response.ok) {
          console.log('API key is working!')
          generateMapImage()
        } else {
          console.error('API key test failed:', response.status, response.statusText)
          setMapImageUrl(testUrl) // Use test URL anyway
        }
      })
      .catch(error => {
        console.error('API test error:', error)
        generateMapImage() // Try anyway
      })
  }, [filteredBuildings])

  const handleBuildingSelect = (building: CampusBuilding) => {
    setSelectedBuilding(building)
    setSelectedAmenity(null)
    setSelectedImage(null)
    setViewMode('panoramic')
    onLocationSelect?.(building)
  }

  const handleAmenitySelect = (amenity: Amenity) => {
    setSelectedAmenity(amenity)
    setSelectedImage(null)
  }

  const handleImageSelect = (image: PanoramicImage) => {
    setSelectedImage(image)
  }

  const handleBackToMap = () => {
    setViewMode('map')
    setSelectedBuilding(null)
    setSelectedAmenity(null)
    setSelectedImage(null)
  }

  const categories = ["All", ...Array.from(new Set(campusBuildings.map(building => building.category)))]

  if (viewMode === 'panoramic' && selectedBuilding) {
    return (
      <PanoramicViewer
        building={selectedBuilding}
        selectedImage={selectedImage}
        selectedAmenity={selectedAmenity}
        onBack={handleBackToMap}
        onAmenitySelect={handleAmenitySelect}
        onImageSelect={handleImageSelect}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Interactive Campus Map
        </h2>
        <p className="text-gray-600">Explore campus buildings with immersive 360° views</p>
      </div>

      {/* Search and Filter Controls */}
      <Card className="backdrop-blur-sm bg-white/80 border-white/20">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search buildings, amenities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/50 border-white/20"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => {
                const config = categoryConfig[category as keyof typeof categoryConfig]
                const IconComponent = config?.icon || Building
                return (
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
                    {category !== "All" && <IconComponent className="w-4 h-4 mr-1" />}
                    {config?.label || category}
                  </Button>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Interactive Map */}
        <div className="lg:col-span-2">
          <Card className="backdrop-blur-sm bg-white/80 border-white/20 overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="w-5 h-5" />
                    Campus Overview
                  </CardTitle>
                  <CardDescription>Click on any building to explore in 360°</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={getCurrentLocation}
                    disabled={isLoadingLocation}
                    className="flex items-center gap-2"
                  >
                    {isLoadingLocation ? (
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Locate className="w-4 h-4" />
                    )}
                    {isLoadingLocation ? "Locating..." : "My Location"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateMapImage(userLocation || undefined)}
                    className="flex items-center gap-2"
                  >
                    <Navigation2 className="w-4 h-4" />
                    Refresh Map
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full h-96 bg-gradient-to-br from-green-100 to-blue-100 overflow-hidden">
                {mapImageUrl ? (
                  <div className="relative w-full h-full">
                    <img
                      src={mapImageUrl}
                      alt="Campus Map with Current Location"
                      className="w-full h-full object-cover"
                      onLoad={() => console.log('Map image loaded successfully')}
                      onError={(e) => {
                        console.error("Failed to load map image:", mapImageUrl)
                        console.error("Error details:", e)
                        // Try a simpler URL as fallback
                        const fallbackUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=800&height=500&center=lonlat:75.5647000,26.8430000&zoom=16&apiKey=${GEOAPIFY_API_KEY}`
                        setMapImageUrl(fallbackUrl)
                      }}
                    />
                    
                    {/* Interactive building overlays */}
                    <div className="absolute inset-0">
                      {filteredBuildings.map((building) => {
                        // Calculate approximate pixel position based on map bounds
                        const mapCenterLat = userLocation?.lat || 26.8430000
                        const mapCenterLng = userLocation?.lng || 75.5647000
                        
                        // Simple approximation for positioning - in a real app you'd use proper map projection
                        const relativeX = ((building.coordinates.lng - mapCenterLng) * 10000) + 50
                        const relativeY = ((mapCenterLat - building.coordinates.lat) * 10000) + 50
                        
                        // Clamp to visible area
                        const x = Math.max(5, Math.min(95, relativeX))
                        const y = Math.max(5, Math.min(95, relativeY))
                        
                        return (
                          <div
                            key={building.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                            style={{
                              left: `${x}%`,
                              top: `${y}%`
                            }}
                            onClick={() => handleBuildingSelect(building)}
                          >
                            {/* Building info tooltip */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                              <div className="font-semibold">{building.name}</div>
                              <div className="text-gray-300">{building.category}</div>
                              {building.panoramicImages.length > 0 && (
                                <div className="text-yellow-300 flex items-center gap-1 mt-1">
                                  <Camera className="w-3 h-3" />
                                  360° Available
                                </div>
                              )}
                              {/* Arrow pointing down */}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/90"></div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    
                    {/* Current location indicator */}
                    {userLocation && (
                      <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2 shadow-lg">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span>Your Location</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <div className="text-center">
                      <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading Campus Map...</p>
                    </div>
                  </div>
                )}

                {/* Map Debug Info (remove in production) */}
                <div className="absolute top-4 left-4 bg-black/80 text-white p-2 rounded text-xs max-w-xs overflow-hidden">
                  <div className="mb-1">
                    <strong>API Status:</strong> {mapImageUrl ? 'URL Generated' : 'Loading...'}
                  </div>
                  {mapImageUrl && (
                    <div className="break-all">
                      <strong>URL:</strong> {mapImageUrl.substring(0, 100)}...
                    </div>
                  )}
                  <div>
                    <strong>Buildings:</strong> {filteredBuildings.length}
                  </div>
                </div>

                {/* Map Legend */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-xs">
                  <h4 className="font-semibold text-sm mb-2">Map Legend</h4>
                  <div className="space-y-1">
                    {userLocation && (
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>Your Current Location</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <span>Campus Buildings</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Camera className="w-3 h-3 text-yellow-500" />
                      <span>360° View Available</span>
                    </div>
                  </div>
                  
                  {userLocation && (
                    <div className="mt-2 pt-2 border-t text-xs text-gray-600">
                      <div>Lat: {userLocation.lat.toFixed(6)}</div>
                      <div>Lng: {userLocation.lng.toFixed(6)}</div>
                      {userLocation.accuracy && (
                        <div>Accuracy: ±{Math.round(userLocation.accuracy)}m</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Building List */}
        <div className="space-y-4">
          <Card className="backdrop-blur-sm bg-white/80 border-white/20">
            <CardHeader>
              <CardTitle className="text-lg">Campus Buildings</CardTitle>
              <CardDescription>
                {filteredBuildings.length} building{filteredBuildings.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {filteredBuildings.map((building) => {
                  const config = categoryConfig[building.category]
                  const IconComponent = config.icon

                  return (
                    <div
                      key={building.id}
                      className="p-4 border-b border-gray-100 hover:bg-gray-50/50 cursor-pointer transition-colors group"
                      onClick={() => handleBuildingSelect(building)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-4 h-4 ${config.color} rounded-full flex items-center justify-center`}>
                              <IconComponent className="w-2.5 h-2.5 text-white" />
                            </div>
                            <h3 className="font-semibold text-sm">{building.name}</h3>
                            {building.panoramicImages.length > 0 && (
                              <Badge variant="outline" className="text-xs">
                                <Eye className="w-3 h-3 mr-1" />
                                360°
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{building.description}</p>
                          
                          {building.operatingHours && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                              <Clock className="w-3 h-3" />
                              <span>{building.operatingHours}</span>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-1">
                            <Badge variant="secondary" className="text-xs">
                              {config.label}
                            </Badge>
                            {building.amenities.slice(0, 2).map((amenity) => (
                              <Badge key={amenity.id} variant="outline" className="text-xs">
                                {amenity.name}
                              </Badge>
                            ))}
                            {building.amenities.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{building.amenities.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MapPin className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="backdrop-blur-sm bg-white/80 border-white/20">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Building className="w-4 h-4" />
                Campus Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div className="flex justify-between">
                <span>Total Buildings:</span>
                <span className="font-semibold">{campusBuildings.length}</span>
              </div>
              <div className="flex justify-between">
                <span>360° Views:</span>
                <span className="font-semibold">
                  {campusBuildings.filter(b => b.panoramicImages.length > 0).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Amenities:</span>
                <span className="font-semibold">
                  {campusBuildings.reduce((acc, b) => acc + b.amenities.length, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Location Status:</span>
                <span className={`font-semibold ${userLocation ? 'text-green-600' : 'text-gray-500'}`}>
                  {userLocation ? 'Located' : 'Unknown'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Location Services Info */}
          {!userLocation && (
            <Card className="backdrop-blur-sm bg-blue-50/80 border-blue-200/50">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2 text-blue-700">
                  <Locate className="w-4 h-4" />
                  Enable Location
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2">
                <p className="text-blue-600">
                  Click "My Location" to see your position on the campus map and get better navigation assistance.
                </p>
                <Button
                  size="sm"
                  onClick={getCurrentLocation}
                  disabled={isLoadingLocation}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  {isLoadingLocation ? "Getting Location..." : "Enable Location"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}