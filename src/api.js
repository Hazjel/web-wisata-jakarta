// Client tipis ke backend FastAPI (via proxy /api di vite.config.js)

async function get(path) {
  const r = await fetch(`/api${path}`)
  if (!r.ok) throw new Error(`GET ${path} -> ${r.status}`)
  return r.json()
}

export const fetchVenues = () => get('/venues')
export const fetchVenueDetail = (id) => get(`/venues/${id}`)
export const fetchSimilar = (id) => get(`/venues/${id}/similar`)
export const fetchHotels = () => get('/hotels')

// URL foto venue (proxy backend; key server-side). w = lebar px.
export const venuePhotoUrl = (id, w = 800) => `/api/venues/${id}/photo?w=${w}`

export async function requestItinerary(body) {
  const r = await fetch('/api/itinerary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!r.ok) {
    const err = await r.json().catch(() => ({}))
    throw new Error(err.detail || `POST /itinerary -> ${r.status}`)
  }
  return r.json()
}

// Geometri rute jalan asli dari OSRM public (pola sama dgn peta notebook 06).
// null kalau gagal -> caller fallback garis lurus.
export async function osrmGeometry(lat1, lon1, lat2, lon2) {
  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${lon1},${lat1};${lon2},${lat2}?overview=full&geometries=geojson`
  try {
    const r = await fetch(url)
    const data = await r.json()
    if (data.code !== 'Ok') return null
    return data.routes[0].geometry.coordinates.map(([lon, lat]) => [lat, lon])
  } catch {
    return null
  }
}
