// Client tipis ke backend FastAPI.
// Dev: proxy /api -> localhost:8000 (vite.config.js).
// Produksi: set VITE_API_URL ke URL backend (mis. https://xxx.onrender.com),
// tanpa trailing slash. Kalau kosong, pakai /api (proxy dev).
const API_BASE = import.meta.env.VITE_API_URL || '/api'

async function get(path) {
  const r = await fetch(`${API_BASE}${path}`)
  if (!r.ok) throw new Error(`GET ${path} -> ${r.status}`)
  return r.json()
}

export const fetchVenues = () => get('/venues')
export const fetchVenueDetail = (id) => get(`/venues/${id}`)
export const fetchSimilar = (id) => get(`/venues/${id}/similar`)
export const fetchHotels = () => get('/hotels')

// URL foto venue (proxy backend; key server-side). w = lebar px.
export const venuePhotoUrl = (id, w = 800) => `${API_BASE}/venues/${id}/photo?w=${w}`

export async function requestItinerary(body) {
  const r = await fetch(`${API_BASE}/itinerary`, {
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

// Geometri rute jalan asli dari OSRM public.
// vehicle 'motor' -> profil bike (routing.openstreetmap.de) yang MENGHINDARI
// tol/motorway (motor dilarang tol); moda lain -> profil driving.
// null kalau gagal -> caller fallback garis lurus.
export async function osrmGeometry(lat1, lon1, lat2, lon2, vehicle = 'mobil') {
  const url = vehicle === 'motor'
    ? `https://routing.openstreetmap.de/routed-bike/route/v1/driving/` +
      `${lon1},${lat1};${lon2},${lat2}?overview=full&geometries=geojson`
    : `https://router.project-osrm.org/route/v1/driving/` +
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

// Instruksi belok-per-belok (turn-by-turn) satu leg dari OSRM.
// Return: { distance_km, duration_min, steps: [{ instruction, road, distance_m }] }
// null kalau gagal. Bahasa Indonesia sederhana.
const _MANEUVER_ID = {
  depart: 'Mulai', arrive: 'Tiba di tujuan', turn: 'Belok',
  'new name': 'Lanjut', continue: 'Lanjut', merge: 'Bergabung',
  'on ramp': 'Masuk jalan', 'off ramp': 'Keluar jalan', fork: 'Ambil cabang',
  'end of road': 'Di ujung jalan', roundabout: 'Bundaran', rotary: 'Bundaran',
}
const _MODIFIER_ID = {
  left: 'kiri', right: 'kanan', straight: 'lurus',
  'slight left': 'agak kiri', 'slight right': 'agak kanan',
  'sharp left': 'tajam kiri', 'sharp right': 'tajam kanan', uturn: 'putar balik',
}

export async function osrmSteps(lat1, lon1, lat2, lon2, vehicle = 'mobil') {
  const base = vehicle === 'motor'
    ? 'https://routing.openstreetmap.de/routed-bike'
    : 'https://router.project-osrm.org'
  const url = `${base}/route/v1/driving/${lon1},${lat1};${lon2},${lat2}` +
    `?overview=false&steps=true`
  try {
    const r = await fetch(url)
    const data = await r.json()
    if (data.code !== 'Ok') return null
    const route = data.routes[0]
    const steps = route.legs.flatMap((leg) =>
      leg.steps.map((s) => {
        const m = s.maneuver || {}
        const verb = _MANEUVER_ID[m.type] || 'Lanjut'
        const dir = _MODIFIER_ID[m.modifier]
        const road = s.name || ''
        let instruction = verb
        if (m.type === 'turn' && dir) instruction = `Belok ${dir}`
        else if (dir && verb === 'Lanjut') instruction = 'Lanjut lurus'
        if (road) instruction += ` ke ${road}`
        return { instruction, road, distance_m: Math.round(s.distance) }
      }).filter((s) => s.distance_m > 0 || s.instruction !== 'Lanjut'))
    return {
      distance_km: +(route.distance / 1000).toFixed(1),
      duration_min: Math.round(route.duration / 60),
      steps,
    }
  } catch {
    return null
  }
}
