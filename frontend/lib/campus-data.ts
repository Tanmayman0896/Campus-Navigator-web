export interface PanoramicImage {
  url: string
  title: string
  description?: string
}

export interface Amenity {
  id: string
  name: string
  description: string
  coordinates?: {
    lat: number
    lng: number
  }
  panoramicImages?: PanoramicImage[]
}

export interface CampusBuilding {
  id: string
  name: string
  description: string
  coordinates: {
    lat: number
    lng: number
  }
  category: 'academic' | 'dining' | 'recreation' | 'housing' | 'library' | 'administrative' | 'medical'
  panoramicImages: PanoramicImage[]
  amenities: Amenity[]
  operatingHours?: string
  contactInfo?: {
    phone?: string
    email?: string
  }
}

// Sample campus buildings with panoramic views
export const campusBuildings: CampusBuilding[] = [
  {
    id: 'main-library',
    name: 'Central Library',
    description: 'Main campus library with extensive digital and physical collections',
    coordinates: {
      lat: 26.8435000,
      lng: 75.5650000
    },
    category: 'library',
    operatingHours: 'Mon-Sun: 6:00 AM - 12:00 AM',
    contactInfo: {
      phone: '+91-1234567890',
      email: 'library@campus.edu'
    },
    panoramicImages: [
      {
        url: '/images/library/entrance-360.jpg',
        title: 'Library Entrance',
        description: 'Main entrance with information desk'
      },
      {
        url: '/images/library/reading-hall-360.jpg',
        title: 'Reading Hall',
        description: 'Spacious reading area with natural lighting'
      },
      {
        url: '/images/library/digital-section-360.jpg',
        title: 'Digital Section',
        description: 'Computer lab and digital resources area'
      }
    ],
    amenities: [
      {
        id: 'study-rooms',
        name: 'Private Study Rooms',
        description: 'Bookable private study spaces for groups',
        coordinates: { lat: 26.8435200, lng: 75.5650200 },
        panoramicImages: [
          {
            url: '/images/library/study-room-360.jpg',
            title: 'Study Room Interior',
            description: 'Quiet private study space'
          }
        ]
      },
      {
        id: 'computer-lab',
        name: 'Computer Lab',
        description: 'High-speed internet and modern computers',
        coordinates: { lat: 26.8435100, lng: 75.5650100 },
        panoramicImages: [
          {
            url: '/images/library/computer-lab-360.jpg',
            title: 'Computer Lab',
            description: 'Modern computing facilities'
          }
        ]
      },
      {
        id: 'printing-station',
        name: 'Printing & Scanning',
        description: 'Document printing and scanning services',
        coordinates: { lat: 26.8435050, lng: 75.5650050 }
      }
    ]
  },
  {
    id: 'student-center',
    name: 'Student Activity Center',
    description: 'Hub for student activities, dining, and recreation',
    coordinates: {
      lat: 26.8425000,
      lng: 75.5640000
    },
    category: 'dining',
    operatingHours: 'Mon-Sun: 7:00 AM - 11:00 PM',
    panoramicImages: [
      {
        url: '/images/student-center/main-hall-360.jpg',
        title: 'Main Hall',
        description: 'Central gathering space for students'
      },
      {
        url: '/images/student-center/food-court-360.jpg',
        title: 'Food Court',
        description: 'Multiple dining options available'
      }
    ],
    amenities: [
      {
        id: 'food-court',
        name: 'Food Court',
        description: 'Multiple cuisine options and dining areas',
        coordinates: { lat: 26.8425100, lng: 75.5640100 },
        panoramicImages: [
          {
            url: '/images/student-center/cafeteria-360.jpg',
            title: 'Cafeteria View',
            description: 'Spacious dining area'
          }
        ]
      },
      {
        id: 'recreation-room',
        name: 'Recreation Room',
        description: 'Games, entertainment, and relaxation area',
        coordinates: { lat: 26.8425200, lng: 75.5640200 },
        panoramicImages: [
          {
            url: '/images/student-center/recreation-360.jpg',
            title: 'Recreation Area',
            description: 'Gaming and entertainment zone'
          }
        ]
      },
      {
        id: 'meeting-rooms',
        name: 'Meeting Rooms',
        description: 'Bookable spaces for student organizations',
        coordinates: { lat: 26.8425050, lng: 75.5640050 }
      }
    ]
  },
  {
    id: 'engineering-building',
    name: 'Engineering Complex',
    description: 'Main engineering departments with modern laboratories',
    coordinates: {
      lat: 26.8440000,
      lng: 75.5655000
    },
    category: 'academic',
    operatingHours: 'Mon-Fri: 6:00 AM - 10:00 PM, Sat-Sun: 8:00 AM - 6:00 PM',
    panoramicImages: [
      {
        url: '/images/engineering/lobby-360.jpg',
        title: 'Engineering Lobby',
        description: 'Modern entrance with student displays'
      },
      {
        url: '/images/engineering/lab-360.jpg',
        title: 'Main Laboratory',
        description: 'State-of-the-art engineering lab'
      }
    ],
    amenities: [
      {
        id: 'computer-labs',
        name: 'Computer Laboratories',
        description: 'Programming and software development labs',
        coordinates: { lat: 26.8440100, lng: 75.5655100 },
        panoramicImages: [
          {
            url: '/images/engineering/comp-lab-360.jpg',
            title: 'Computer Lab',
            description: 'Modern programming environment'
          }
        ]
      },
      {
        id: 'workshop',
        name: 'Workshop',
        description: 'Hands-on engineering workshop with tools',
        coordinates: { lat: 26.8440200, lng: 75.5655200 },
        panoramicImages: [
          {
            url: '/images/engineering/workshop-360.jpg',
            title: 'Workshop Area',
            description: 'Practical engineering workspace'
          }
        ]
      },
      {
        id: 'lecture-halls',
        name: 'Lecture Halls',
        description: 'Large capacity classrooms with AV equipment',
        coordinates: { lat: 26.8440050, lng: 75.5655050 }
      }
    ]
  },
  {
    id: 'sports-complex',
    name: 'Sports & Recreation Complex',
    description: 'Complete athletic facilities for students',
    coordinates: {
      lat: 26.8420000,
      lng: 75.5645000
    },
    category: 'recreation',
    operatingHours: 'Mon-Sun: 5:00 AM - 11:00 PM',
    panoramicImages: [
      {
        url: '/images/sports/entrance-360.jpg',
        title: 'Sports Complex Entrance',
        description: 'Main entrance to athletic facilities'
      },
      {
        url: '/images/sports/gym-360.jpg',
        title: 'Fitness Center',
        description: 'Modern gym with equipment'
      }
    ],
    amenities: [
      {
        id: 'gymnasium',
        name: 'Gymnasium',
        description: 'Full-size basketball and volleyball courts',
        coordinates: { lat: 26.8420100, lng: 75.5645100 },
        panoramicImages: [
          {
            url: '/images/sports/basketball-court-360.jpg',
            title: 'Basketball Court',
            description: 'Professional basketball court'
          }
        ]
      },
      {
        id: 'swimming-pool',
        name: 'Swimming Pool',
        description: 'Olympic-size swimming pool with lanes',
        coordinates: { lat: 26.8420200, lng: 75.5645200 },
        panoramicImages: [
          {
            url: '/images/sports/pool-360.jpg',
            title: 'Swimming Pool',
            description: 'Olympic-size swimming facility'
          }
        ]
      },
      {
        id: 'fitness-center',
        name: 'Fitness Center',
        description: 'Modern gym equipment and weight training',
        coordinates: { lat: 26.8420050, lng: 75.5645050 }
      }
    ]
  },
  {
    id: 'residence-hall-a',
    name: 'Residence Hall A',
    description: 'Modern student housing with all amenities',
    coordinates: {
      lat: 26.8445000,
      lng: 75.5660000
    },
    category: 'housing',
    operatingHours: '24/7 Access for Residents',
    panoramicImages: [
      {
        url: '/images/residence/lobby-360.jpg',
        title: 'Residence Lobby',
        description: 'Welcoming entrance area'
      },
      {
        url: '/images/residence/common-room-360.jpg',
        title: 'Common Room',
        description: 'Social space for residents'
      }
    ],
    amenities: [
      {
        id: 'common-areas',
        name: 'Common Areas',
        description: 'Shared living spaces for socializing',
        coordinates: { lat: 26.8445100, lng: 75.5660100 },
        panoramicImages: [
          {
            url: '/images/residence/lounge-360.jpg',
            title: 'Student Lounge',
            description: 'Comfortable seating and entertainment'
          }
        ]
      },
      {
        id: 'laundry-facilities',
        name: 'Laundry Facilities',
        description: 'Modern washers and dryers available 24/7',
        coordinates: { lat: 26.8445200, lng: 75.5660200 }
      },
      {
        id: 'study-lounges',
        name: 'Study Lounges',
        description: 'Quiet spaces for academic work',
        coordinates: { lat: 26.8445050, lng: 75.5660050 }
      }
    ]
  },
  {
    id: 'dome-building',
    name: 'Administrative Dome Building',
    description: 'Historic dome building housing central administration and ceremonial halls',
    coordinates: {
      lat: 26.8437000,
      lng: 75.5648000
    },
    category: 'administrative',
    operatingHours: 'Mon-Fri: 9:00 AM - 6:00 PM, Sat: 9:00 AM - 2:00 PM',
    contactInfo: {
      phone: '+91-1414-123456',
      email: 'admin@campus.edu'
    },
    panoramicImages: [
      {
        url: '/images/dome-building/exterior-360.jpg',
        title: 'Dome Building Exterior',
        description: 'Magnificent view of the historic dome building with classical architecture'
      },
      {
        url: '/images/dome-building/entrance-hall-360.jpg',
        title: 'Grand Entrance Hall',
        description: 'Impressive entrance hall with marble columns'
      },
      {
        url: '/images/dome-building/dome-interior-360.jpg',
        title: 'Dome Interior',
        description: 'Beautiful interior view of the dome with ornate ceiling'
      }
    ],
    amenities: [
      {
        id: 'registrar-office',
        name: 'Registrar Office',
        description: 'Student records and academic administration',
        coordinates: { lat: 26.8437100, lng: 75.5648100 },
        panoramicImages: [
          {
            url: '/images/dome-building/registrar-360.jpg',
            title: 'Registrar Office',
            description: 'Professional administrative office space'
          }
        ]
      },
      {
        id: 'ceremonial-hall',
        name: 'Ceremonial Hall',
        description: 'Grand hall for graduations and special events',
        coordinates: { lat: 26.8437200, lng: 75.5648200 },
        panoramicImages: [
          {
            url: '/images/dome-building/ceremonial-hall-360.jpg',
            title: 'Ceremonial Hall',
            description: 'Elegant hall for university ceremonies'
          }
        ]
      },
      {
        id: 'admin-offices',
        name: 'Administrative Offices',
        description: 'Various administrative departments',
        coordinates: { lat: 26.8437050, lng: 75.5648050 }
      },
      {
        id: 'reception-area',
        name: 'Reception & Information',
        description: 'Main reception desk and visitor information',
        coordinates: { lat: 26.8437000, lng: 75.5648000 }
      }
    ]
  },
  {
    id: 'main-campus',
    name: 'Main Campus Entrance',
    description: 'Primary entrance to the university campus',
    coordinates: {
      lat: 26.8429858,
      lng: 75.5643866
    },
    category: 'administrative',
    operatingHours: '24/7 Access',
    panoramicImages: [
      {
        url: '/images/main-campus/gate-360.jpg',
        title: 'Main Gate',
        description: 'Historic main entrance to campus'
      },
      {
        url: '/images/main-campus/plaza-360.jpg',
        title: 'Central Plaza',
        description: 'Beautiful campus centerpiece'
      }
    ],
    amenities: [
      {
        id: 'visitor-parking',
        name: 'Visitor Parking',
        description: 'Parking area for campus visitors',
        coordinates: { lat: 26.8429900, lng: 75.5643900 }
      },
      {
        id: 'information-desk',
        name: 'Information Desk',
        description: 'Campus information and assistance',
        coordinates: { lat: 26.8429800, lng: 75.5643800 }
      },
      {
        id: 'security-office',
        name: 'Security Office',
        description: '24/7 campus security services',
        coordinates: { lat: 26.8429950, lng: 75.5643950 }
      }
    ]
  }
]

// Helper functions
export const getBuildingById = (id: string): CampusBuilding | undefined => {
  return campusBuildings.find(building => building.id === id)
}

export const getBuildingsByCategory = (category: CampusBuilding['category']): CampusBuilding[] => {
  return campusBuildings.filter(building => building.category === category)
}

export const getAmenityById = (buildingId: string, amenityId: string): Amenity | undefined => {
  const building = getBuildingById(buildingId)
  return building?.amenities.find(amenity => amenity.id === amenityId)
}

export const searchBuildings = (query: string): CampusBuilding[] => {
  const lowercaseQuery = query.toLowerCase()
  return campusBuildings.filter(building =>
    building.name.toLowerCase().includes(lowercaseQuery) ||
    building.description.toLowerCase().includes(lowercaseQuery) ||
    building.amenities.some(amenity =>
      amenity.name.toLowerCase().includes(lowercaseQuery) ||
      amenity.description.toLowerCase().includes(lowercaseQuery)
    )
  )
}