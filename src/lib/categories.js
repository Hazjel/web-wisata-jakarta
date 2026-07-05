// Pemetaan venue_category dataset -> grup kategori tampilan + visual placeholder
// (tidak ada foto venue di dataset — kartu pakai gradien + ikon per grup)

// icon = nama ikon SVG (lihat components/Icon.jsx). tint = warna aksen kategori
// (untuk chip & fallback monokrom, bukan gradien warna-warni ala AI).
const GROUPS = [
  {
    id: 'budaya', label: 'Budaya & Sejarah', icon: 'landmark', tint: '#003b72',
    match: ['Museum', 'History Museum', 'Art Museum', 'Art Gallery',
      'Science Museum', 'Monument / Landmark', 'Historic Site'],
  },
  {
    id: 'religi', label: 'Religi', icon: 'temple', tint: '#005a6d',
    match: ['Temple', 'Buddhist Temple', 'Mosque', 'Church', 'Spiritual Center'],
  },
  {
    id: 'alam', label: 'Alam & Taman', icon: 'tree', tint: '#15803d',
    match: ['Park', 'Garden', 'Lake', 'Nature / Park', 'Scenic Lookout',
      'Sculpture Garden', 'Beach'],
  },
  {
    id: 'hiburan', label: 'Hiburan & Keluarga', icon: 'ferris', tint: '#994700',
    match: ['Zoo', 'Aquarium', 'Theme Park', 'Water Park', 'Amusement Park',
      'Theme Park Ride / Attraction', 'Playground', 'Skating Rink',
      'General Entertainment'],
  },
  {
    id: 'seni', label: 'Seni & Pertunjukan', icon: 'masks', tint: '#7e22ce',
    match: ['Theater', 'Performing Arts Venue', 'Concert Hall', 'Movie Theater'],
  },
]

const FALLBACK = { id: 'lainnya', label: 'Lainnya', icon: 'pin', tint: '#424751' }

export const CATEGORY_GROUPS = [...GROUPS, FALLBACK]

export function groupOf(venueCategory) {
  return GROUPS.find((g) => g.match.includes(venueCategory)) || FALLBACK
}

export const PRICE_LABEL = ['Gratis', 'Murah', 'Sedang', 'Mahal']
