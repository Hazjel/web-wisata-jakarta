import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet'
import { fetchVenueDetail } from '../api.js'
import { useSelection } from '../context/SelectionContext.jsx'
import { groupOf, PRICE_LABEL } from '../lib/categories.js'

export default function VenueDetail() {
  const { id } = useParams()
  const [venue, setVenue] = useState(null)
  const [error, setError] = useState('')
  const { selected, toggle } = useSelection()

  useEffect(() => {
    setVenue(null)
    fetchVenueDetail(id).then(setVenue).catch(() => setError('Venue tidak ditemukan'))
  }, [id])

  if (error) return <div className="detail-page"><p className="error">{error}</p></div>
  if (!venue) return <div className="detail-page"><p>Memuat…</p></div>

  const g = groupOf(venue.venue_category)
  const isSelected = selected.includes(String(venue.venue_id))

  return (
    <div className="detail-page">
      <Link to="/" className="back-link">← Kembali ke destinasi</Link>

      <header className="detail-hero" style={{ background: g.gradient }}>
        <span className="detail-icon">{g.icon}</span>
        <div>
          <span className="detail-group">{g.label} · {venue.venue_category}</span>
          <h1>{venue.name}</h1>
          <div className="detail-stats">
            {venue.google_rating && (
              <span>⭐ {venue.google_rating}
                {venue.google_rating_count &&
                  ` (${venue.google_rating_count.toLocaleString('id')} ulasan)`}
              </span>
            )}
            <span>💰 {PRICE_LABEL[venue.price_level]}</span>
            {venue.time_spent_minutes &&
              <span>⏱️ ±{Math.round(venue.time_spent_minutes / 60 * 10) / 10} jam kunjungan</span>}
          </div>
        </div>
        <button className={`detail-add ${isSelected ? 'added' : ''}`}
          onClick={() => toggle(venue.venue_id)}>
          {isSelected ? '✓ Dalam pilihan' : '+ Tambah ke rencana'}
        </button>
      </header>

      <div className="detail-grid">
        <div className="detail-info">
          {venue.description && (
            <section>
              <h2>Tentang</h2>
              <p>{venue.description}</p>
            </section>
          )}
          {venue.address && (
            <section>
              <h2>Alamat</h2>
              <p>{venue.address}</p>
            </section>
          )}
          <section>
            <h2>Jam Buka</h2>
            <table className="hours-table">
              <tbody>
                {venue.hours.map((h) => (
                  <tr key={h.day}>
                    <td>{h.day}</td>
                    <td>{h.open && h.close ? `${h.open} – ${h.close}` : 'Tutup'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        <div className="detail-map">
          <MapContainer center={[venue.latitude, venue.longitude]} zoom={15}
            className="map" style={{ height: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
            <Marker position={[venue.latitude, venue.longitude]}>
              <Tooltip permanent>{venue.name}</Tooltip>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  )
}
