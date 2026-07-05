import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MapContainer, Marker, TileLayer, Tooltip } from 'react-leaflet'
import { fetchSimilar, fetchVenueDetail, venuePhotoUrl } from '../api.js'
import VenueCard from '../components/VenueCard.jsx'
import { useSelection } from '../context/SelectionContext.jsx'
import { groupOf, PRICE_LABEL } from '../lib/categories.js'
import Icon from '../components/Icon.jsx'

const DAY_ORDER = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

// Rentang jam buka ringkas: kelompokkan hari dgn jam sama jadi "Senin–Jumat"
function summarizeHours(hours) {
  const open = hours.filter((h) => h.open && h.close)
  if (open.length === 0) return [{ days: 'Setiap hari', time: 'Jam tidak tersedia' }]
  if (open.length === 7 && open.every((h) => h.open === open[0].open && h.close === open[0].close))
    return [{ days: 'Setiap hari', time: `${open[0].open} – ${open[0].close}` }]
  return hours.map((h) => ({
    days: h.day,
    time: h.open && h.close ? `${h.open} – ${h.close}` : 'Tutup',
  }))
}

export default function VenueDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [venue, setVenue] = useState(null)
  const [similar, setSimilar] = useState([])
  const [error, setError] = useState('')
  const { selected, toggle } = useSelection()

  useEffect(() => {
    setVenue(null)
    setSimilar([])
    window.scrollTo(0, 0)
    fetchVenueDetail(id).then(setVenue).catch(() => setError('Venue tidak ditemukan'))
    fetchSimilar(id).then(setSimilar).catch(() => {})
  }, [id])

  if (error) return <div className="detail-page"><p className="error">{error}</p></div>
  if (!venue) return <div className="detail-page"><p>Memuat…</p></div>

  const g = groupOf(venue.venue_category)
  const isSelected = selected.includes(String(venue.venue_id))
  const jamHari = summarizeHours(venue.hours)
  const durasiJam = venue.time_spent_minutes
    ? Math.round((venue.time_spent_minutes / 60) * 10) / 10 : null

  return (
    <article className="vd">
      {/* Hero foto besar + overlay */}
      <header className="vd-hero" style={{ background: g.gradient }}>
        {venue.has_photo && (
          <img className="vd-hero-bg" alt={venue.name}
            src={venuePhotoUrl(venue.venue_id, 1600)} />
        )}
        <div className="vd-hero-overlay" />
        <div className="vd-hero-inner">
          <div className="vd-hero-text">
            <span className="vd-badge">{g.label}</span>
            <h1>{venue.name}</h1>
            <p className="vd-subtitle">{venue.venue_category}
              {venue.address ? ` · ${venue.address.split(',')[0]}` : ''}</p>
          </div>
          <button className={`vd-add ${isSelected ? 'added' : ''}`}
            onClick={() => toggle(venue.venue_id)}>
            <Icon name={isSelected ? 'check' : 'plus'} size={18} strokeWidth={2.25} />
            {isSelected ? 'Dalam Rute' : 'Tambah ke Rute'}
          </button>
        </div>
      </header>

      <div className="vd-grid">
        {/* Kolom utama (8) */}
        <div className="vd-main">
          {venue.description && (
            <section className="vd-section">
              <h2>Tentang {venue.name.split('(')[0].trim()}</h2>
              <p className="vd-lead">{venue.description}</p>
            </section>
          )}

          <section className="vd-section">
            <h2>Info & Ulasan</h2>
            <div className="vd-factcard">
              <span className="vd-factcard-icon" style={{ color: g.tint }}>
                <Icon name={g.icon} size={26} />
              </span>
              <div>
                <p>
                  <b>{venue.name}</b> termasuk kategori <b>{venue.venue_category}</b>
                  {venue.google_rating && (
                    <> dengan rating <b>{venue.google_rating}/5</b>
                      {venue.google_rating_count &&
                        ` dari ${venue.google_rating_count.toLocaleString('id')} ulasan Google`}</>
                  )}.
                </p>
                {durasiJam && (
                  <p>Estimasi waktu kunjungan sekitar <b>{durasiJam} jam</b> — sudah
                    diperhitungkan otomatis saat sistem menyusun itinerary multi-hari.</p>
                )}
              </div>
            </div>
          </section>

          {venue.has_photo && (
            <section className="vd-section">
              <h2>Galeri</h2>
              <div className="vd-gallery">
                <div className="vd-gallery-item">
                  <img alt={venue.name} src={venuePhotoUrl(venue.venue_id, 800)} />
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Sidebar (4) */}
        <aside className="vd-aside">
          <div className="vd-card">
            <h3><Icon name="info" size={19} /> Info Singkat</h3>
            <dl className="vd-facts">
              <div><dt>Kategori</dt><dd>{venue.venue_category}</dd></div>
              {venue.google_rating &&
                <div><dt>Rating</dt><dd>⭐ {venue.google_rating}</dd></div>}
              <div><dt>Perkiraan biaya</dt><dd>{PRICE_LABEL[venue.price_level]}</dd></div>
              {durasiJam &&
                <div><dt>Durasi kunjungan</dt><dd>±{durasiJam} jam</dd></div>}
            </dl>
          </div>

          <div className="vd-card vd-card-visit">
            <h3><Icon name="clock" size={19} /> Kunjungan</h3>
            <div className="vd-visit-block">
              <span className="vd-visit-label">JAM OPERASIONAL</span>
              {jamHari.map((h) => (
                <div key={h.days} className="vd-visit-row">
                  <span>{h.days}</span><span>{h.time}</span>
                </div>
              ))}
            </div>
            {venue.address && (
              <div className="vd-visit-block">
                <span className="vd-visit-label">LOKASI</span>
                <p className="vd-visit-value">{venue.address}</p>
              </div>
            )}
          </div>

          <div className="vd-card vd-card-map">
            <MapContainer center={[venue.latitude, venue.longitude]} zoom={15}
              className="map" style={{ height: 240 }}>
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
              <Marker position={[venue.latitude, venue.longitude]}>
                <Tooltip permanent>{venue.name}</Tooltip>
              </Marker>
            </MapContainer>
          </div>

          <button className="vd-plan-cta" onClick={() => {
            if (!isSelected) toggle(venue.venue_id)
            navigate('/rencana?mode=manual')
          }}>
            Rencanakan Rute dengan Destinasi Ini →
          </button>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="vd-similar">
          <h2>Kamu mungkin juga suka</h2>
          <div className="venue-grid vd-similar-grid">
            {similar.map((v) => <VenueCard key={v.venue_id} venue={v} />)}
          </div>
        </section>
      )}

      <Link to="/" className="vd-back">← Kembali ke semua destinasi</Link>
    </article>
  )
}
