import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { osrmGeometry } from '../api.js'

// fix icon default leaflet di bundler
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
const DefaultIcon = L.icon({ iconUrl, shadowUrl: iconShadow,
  iconAnchor: [12, 41], popupAnchor: [0, -34] })
L.Marker.prototype.options.icon = DefaultIcon

const DAY_COLORS = ['#1d4ed8', '#15803d', '#7e22ce', '#c2410c', '#991b1b']
const hotelIcon = L.divIcon({
  className: 'hotel-marker', html: '🏨',
  iconSize: [28, 28], iconAnchor: [14, 14],
})

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export default function ItineraryMap({ data }) {
  const [legs, setLegs] = useState([])

  useEffect(() => {
    let cancelled = false
    async function buildLegs() {
      setLegs([])
      const out = []
      const vehicle = data.params?.vehicle || 'mobil'
      const hotel = [data.hotel.latitude, data.hotel.longitude]
      // gambar hari TERAKHIR dulu -> hari 1 di layer atas (paling tebal)
      for (const day of [...data.days].reverse()) {
        const di = day.day_index - 1
        const stops = [hotel,
          ...day.visits.filter((v) => v.type === 'visit')
            .map((v) => [v.latitude, v.longitude]),
          hotel]
        for (let i = 0; i < stops.length - 1; i++) {
          const [a, b] = [stops[i], stops[i + 1]]
          const pts = await osrmGeometry(a[0], a[1], b[0], b[1], vehicle)
          if (cancelled) return
          if (pts) {
            // rute jalan solid + segmen akses dashed (snap-point -> pin venue)
            out.push({ di, pts, dashed: false })
            out.push({ di, pts: [a, pts[0]], dashed: true })
            out.push({ di, pts: [pts[pts.length - 1], b], dashed: true })
          } else {
            out.push({ di, pts: [a, b], dashed: false })
          }
          setLegs([...out])
          await sleep(250) // jeda sopan ke OSRM public
        }
      }
    }
    buildLegs()
    return () => { cancelled = true }
  }, [data])

  const hotel = [data.hotel.latitude, data.hotel.longitude]

  return (
    <MapContainer center={hotel} zoom={12} className="map">
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

      <Marker position={hotel} icon={hotelIcon}>
        <Tooltip>HOTEL: {data.hotel.name}</Tooltip>
      </Marker>

      {data.days.map((day) =>
        day.visits.filter((v) => v.type === 'visit').map((v, i) => (
          <Marker key={`${day.day_index}-${v.venue_id}`}
            position={[v.latitude, v.longitude]}>
            <Tooltip>H{day.day_index}-{i + 1}: {v.name}</Tooltip>
          </Marker>
        )),
      )}

      {legs.map((leg, i) => (
        <Polyline key={i} positions={leg.pts}
          pathOptions={{
            color: DAY_COLORS[leg.di % DAY_COLORS.length],
            weight: leg.dashed ? 2 : 5 - leg.di,
            opacity: leg.dashed ? 0.6 : 0.9,
            dashArray: leg.dashed ? '4 8' : null,
          }}>
          <Tooltip sticky>
            Hari {leg.di + 1}{leg.dashed ? ' — akses masuk (jalan kaki)' : ''}
          </Tooltip>
        </Polyline>
      ))}
    </MapContainer>
  )
}
