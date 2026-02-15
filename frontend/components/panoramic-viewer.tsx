"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Maximize2, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Mouse,
  MapPin,
  Clock,
  Phone,
  Mail,
  Info
} from "lucide-react"
import { CampusBuilding, Amenity, PanoramicImage } from "@/lib/campus-data"

interface PanoramicViewerProps {
  building: CampusBuilding
  selectedImage?: PanoramicImage | null
  selectedAmenity?: Amenity | null
  onBack: () => void
  onAmenitySelect: (amenity: Amenity) => void
  onImageSelect: (image: PanoramicImage) => void
}

export default function PanoramicViewer({
  building,
  selectedImage,
  selectedAmenity,
  onBack,
  onAmenitySelect,
  onImageSelect
}: PanoramicViewerProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const viewerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // Get the current image to display
  const getCurrentImage = (): PanoramicImage => {
    if (selectedImage) return selectedImage
    if (selectedAmenity && selectedAmenity.panoramicImages && selectedAmenity.panoramicImages.length > 0) {
      return selectedAmenity.panoramicImages[currentImageIndex] || selectedAmenity.panoramicImages[0]
    }
    return building.panoramicImages[currentImageIndex] || building.panoramicImages[0]
  }

  const getCurrentImages = (): PanoramicImage[] => {
    if (selectedAmenity && selectedAmenity.panoramicImages) {
      return selectedAmenity.panoramicImages
    }
    return building.panoramicImages
  }

  const currentImage = getCurrentImage()
  const currentImages = getCurrentImages()

  // Handle mouse drag for 360 navigation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const deltaX = e.clientX - mousePosition.x
    const deltaY = e.clientY - mousePosition.y

    setRotation(prev => ({
      x: Math.max(-45, Math.min(45, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5
    }))

    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)))
  }

  const resetView = () => {
    setRotation({ x: 0, y: 0 })
    setZoom(1)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && viewerRef.current) {
      viewerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else if (document.fullscreenElement) {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % currentImages.length)
    resetView()
  }

  const previousImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + currentImages.length) % currentImages.length)
    resetView()
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Reset image index when switching between building/amenity
  useEffect(() => {
    setCurrentImageIndex(0)
    resetView()
  }, [selectedAmenity, building.id])

  return (
    <div className="space-y-6">
      {/* Header with navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Map
        </Button>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            {selectedAmenity ? selectedAmenity.name : building.name}
          </h1>
          <p className="text-muted-foreground">
            {selectedAmenity ? selectedAmenity.description : building.description}
          </p>
        </div>

        <div className="flex gap-2">
          <Badge variant="secondary">{building.category}</Badge>
          {selectedAmenity && <Badge variant="outline">Amenity</Badge>}
        </div>
      </div>

      {/* Main panoramic viewer */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div
            ref={viewerRef}
            className={`relative bg-black ${isFullscreen ? 'h-screen' : 'h-96'} overflow-hidden cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            {/* Panoramic Image */}
            <img
              ref={imageRef}
              src={currentImage?.url || '/api/placeholder/800/400'}
              alt={currentImage?.title || 'Panoramic View'}
              className="w-full h-full object-cover transition-transform duration-100"
              style={{
                transform: `scale(${zoom}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                transformOrigin: 'center center'
              }}
              draggable={false}
            />

            {/* Overlay Controls */}
            <div className="absolute top-4 left-4 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={resetView}
                className="bg-black/50 text-white hover:bg-black/70"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setZoom(prev => Math.min(3, prev + 0.2))}
                className="bg-black/50 text-white hover:bg-black/70"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setZoom(prev => Math.max(0.5, prev - 0.2))}
                className="bg-black/50 text-white hover:bg-black/70"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
            </div>

            <div className="absolute top-4 right-4">
              <Button
                size="sm"
                variant="secondary"
                onClick={toggleFullscreen}
                className="bg-black/50 text-white hover:bg-black/70"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Navigation arrows for multiple images */}
            {currentImages.length > 1 && (
              <>
                <Button
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                  onClick={previousImage}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                  onClick={nextImage}
                >
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Button>
              </>
            )}

            {/* Image info overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-4 rounded-lg">
              <h3 className="font-semibold text-lg">{currentImage?.title}</h3>
              {currentImage?.description && (
                <p className="text-sm opacity-90">{currentImage.description}</p>
              )}
              {currentImages.length > 1 && (
                <p className="text-xs opacity-75 mt-1">
                  Image {currentImageIndex + 1} of {currentImages.length}
                </p>
              )}
            </div>

            {/* Navigation help */}
            <div className="absolute bottom-4 right-4 bg-black/70 text-white p-2 rounded-lg text-xs opacity-75">
              <div className="flex items-center gap-1">
                <Mouse className="w-3 h-3" />
                <span>Drag to look around • Scroll to zoom</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image thumbnails */}
      {currentImages.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Available Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentImages.map((image, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setCurrentImageIndex(index)
                    onImageSelect(image)
                  }}
                >
                  <img
                    src={image.url || '/api/placeholder/200/100'}
                    alt={image.title}
                    className="w-full h-20 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2">
                    <p className="text-xs font-medium truncate">{image.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Building/Amenity Information */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>
                {selectedAmenity 
                  ? `${selectedAmenity.coordinates?.lat.toFixed(6)}, ${selectedAmenity.coordinates?.lng.toFixed(6)}`
                  : `${building.coordinates.lat.toFixed(6)}, ${building.coordinates.lng.toFixed(6)}`
                }
              </span>
            </div>
            
            {building.operatingHours && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>{building.operatingHours}</span>
              </div>
            )}
            
            {building.contactInfo?.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>{building.contactInfo.phone}</span>
              </div>
            )}
            
            {building.contactInfo?.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-500" />
                <span>{building.contactInfo.email}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Amenities Card */}
        {!selectedAmenity && building.amenities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Available Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {building.amenities.map((amenity) => (
                  <div
                    key={amenity.id}
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => onAmenitySelect(amenity)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{amenity.name}</h4>
                        <p className="text-sm text-gray-600">{amenity.description}</p>
                      </div>
                      {amenity.panoramicImages && amenity.panoramicImages.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          360° View
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}