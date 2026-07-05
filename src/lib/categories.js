// Pemetaan venue_category dataset -> grup kategori tampilan + visual placeholder
// (tidak ada foto venue di dataset — kartu pakai gradien + ikon per grup)

const GROUPS = [
  {
    id: 'budaya', label: 'Budaya & Sejarah', icon: '🏛️',
    gradient: 'linear-gradient(135deg, #003b72, #1d5fa8)',
    match: ['Museum', 'History Museum', 'Art Museum', 'Art Gallery',
      'Science Museum', 'Monument / Landmark', 'Historic Site'],
  },
  {
    id: 'religi', label: 'Religi', icon: '🕌',
    gradient: 'linear-gradient(135deg, #004150, #005a6d)',
    match: ['Temple', 'Buddhist Temple', 'Mosque', 'Church', 'Spiritual Center'],
  },
  {
    id: 'alam', label: 'Alam & Taman', icon: '🌳',
    gradient: 'linear-gradient(135deg, #14532d, #16a34a)',
    match: ['Park', 'Garden', 'Lake', 'Nature / Park', 'Scenic Lookout',
      'Sculpture Garden', 'Beach'],
  },
  {
    id: 'hiburan', label: 'Hiburan & Keluarga', icon: '🎡',
    gradient: 'linear-gradient(135deg, #994700, #fb7800)',
    match: ['Zoo', 'Aquarium', 'Theme Park', 'Water Park', 'Amusement Park',
      'Theme Park Ride / Attraction', 'Playground', 'Skating Rink',
      'General Entertainment'],
  },
  {
    id: 'seni', label: 'Seni & Pertunjukan', icon: '🎭',
    gradient: 'linear-gradient(135deg, #581c87, #9333ea)',
    match: ['Theater', 'Performing Arts Venue', 'Concert Hall', 'Movie Theater'],
  },
]

const FALLBACK = {
  id: 'lainnya', label: 'Lainnya', icon: '📍',
  gradient: 'linear-gradient(135deg, #424751, #727782)',
}

export const CATEGORY_GROUPS = [...GROUPS, FALLBACK]

export function groupOf(venueCategory) {
  return GROUPS.find((g) => g.match.includes(venueCategory)) || FALLBACK
}

export const PRICE_LABEL = ['Gratis', 'Murah', 'Sedang', 'Mahal']
