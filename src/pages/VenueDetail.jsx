import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MapContainer, Marker, TileLayer, Tooltip } from 'react-leaflet'
import { fetchSimilar, fetchVenueDetail, venuePhotoUrl } from '../api.js'
import Icon from '../components/Icon.jsx'
import VenueCard from '../components/VenueCard.jsx'
import { useSelection } from '../context/SelectionContext.jsx'
import { groupOf, PRICE_LABEL } from '../lib/categories.js'

// Rentang jam buka ringkas: kelompokkan hari dgn jam sama jadi "Setiap hari"
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

const card = 'rounded-xl border border-border-subtle bg-white p-6 shadow-[0_1px_1px_rgba(0,0,0,0.05)]'
const cardTitle = 'mb-4 flex items-center gap-2 text-xl text-primary'

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

  if (error) return (
    <div className="mx-auto max-w-[1280px] p-10">
      <p className="rounded-lg bg-error-container px-3 py-2.5 text-sm text-on-error-container">{error}</p>
    </div>
  )
  if (!venue) return <div className="mx-auto max-w-[1280px] p-10"><p>Memuat…</p></div>

  const g = groupOf(venue.venue_category)
  const isSelected = selected.includes(String(venue.venue_id))
  const jamHari = summarizeHours(venue.hours)
  const durasiJam = venue.time_spent_minutes
    ? Math.round((venue.time_spent_minutes / 60) * 10) / 10 : null

  return (
    <article>
      {/* Hero foto besar + overlay */}
      <header className="relative flex h-[40vh] min-h-[300px] md:h-[56vh] md:max-h-[560px] md:min-h-[400px] items-end overflow-hidden text-white"
        style={{ background: g.tint }}>
        {venue.has_photo && (
          <img className="absolute inset-0 h-full w-full object-cover" alt={venue.name}
            src={venuePhotoUrl(venue.venue_id, 1600)} />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(16,24,32,0.9)_0%,rgba(16,24,32,0.4)_50%,rgba(16,24,32,0)_100%)]" />
        <div className="relative z-[1] mx-auto flex w-full max-w-[1280px] flex-wrap items-end justify-between gap-6 p-4 md:p-8 md:px-10">
          <div className="max-w-[672px]">
            <span className="inline-block rounded-full bg-primary-container px-3 py-0.5 text-xs font-medium uppercase tracking-wider text-white">
              {g.label}
            </span>
            <h1 className="my-2 text-[27px] md:text-5xl font-bold leading-tight tracking-tight text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.4)]">
              {venue.name}
            </h1>
            <p className="text-base md:text-lg text-surface-high/90">
              {venue.venue_category}
              {venue.address ? ` · ${venue.address.split(',')[0]}` : ''}
            </p>
          </div>
          <button onClick={() => toggle(venue.venue_id)}
            className={`inline-flex w-full md:w-auto cursor-pointer items-center justify-center gap-2 whitespace-nowrap
              rounded-full px-7 py-4 text-sm font-bold tracking-wide shadow-[0_10px_15px_-3px_rgba(0,0,0,0.2)]
              transition hover:brightness-105
              ${isSelected ? 'bg-white/95 text-primary' : 'bg-secondary-container text-white'}`}>
            <Icon name={isSelected ? 'check' : 'plus'} size={18} strokeWidth={2.25} />
            {isSelected ? 'Dalam Rute' : 'Tambah ke Rute'}
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 p-4 py-6 md:grid-cols-[2fr_1fr] md:p-10 md:pb-6">
        {/* Kolom utama */}
        <div className="flex min-w-0 flex-col gap-8">
          {venue.description && (
            <section>
              <h2 className="mb-4 text-2xl text-primary">
                Tentang {venue.name.split('(')[0].trim()}
              </h2>
              <p className="text-lg leading-relaxed text-on-surface-variant">{venue.description}</p>
            </section>
          )}

          <section>
            <h2 className="mb-4 text-2xl text-primary">Info & Ulasan</h2>
            <div className="flex items-start gap-4 rounded-xl border border-border-subtle bg-surface-gray p-6">
              <span className="shrink-0" style={{ color: g.tint }}>
                <Icon name={g.icon} size={26} />
              </span>
              <div className="[&_p]:text-base [&_p]:leading-relaxed [&_p]:text-on-surface-variant [&_p+p]:mt-2">
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
                    diperhitungkan otomatis saat sistem menyusun rencanamu.</p>
                )}
              </div>
            </div>
          </section>

          {venue.has_photo && (
            <section>
              <h2 className="mb-4 text-2xl text-primary">Galeri</h2>
              <div className="aspect-video overflow-hidden rounded-xl shadow-sm">
                <img className="h-full w-full object-cover" alt={venue.name}
                  src={venuePhotoUrl(venue.venue_id, 800)} />
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="flex min-w-0 flex-col gap-6">
          <div className={card}>
            <h3 className={cardTitle}><Icon name="info" size={19} /> Info Singkat</h3>
            <dl className="m-0 [&>div]:flex [&>div]:justify-between [&>div]:gap-4 [&>div]:border-b [&>div]:border-surface-high/50 [&>div]:py-2 [&>div:last-child]:border-b-0">
              <div><dt className="font-semibold text-on-surface-variant">Kategori</dt>
                <dd className="m-0 text-right text-night">{venue.venue_category}</dd></div>
              {venue.google_rating && (
                <div><dt className="font-semibold text-on-surface-variant">Rating</dt>
                  <dd className="m-0 text-right text-night">⭐ {venue.google_rating}</dd></div>
              )}
              <div><dt className="font-semibold text-on-surface-variant">Perkiraan biaya</dt>
                <dd className="m-0 text-right text-night">{PRICE_LABEL[venue.price_level]}</dd></div>
              {durasiJam && (
                <div><dt className="font-semibold text-on-surface-variant">Durasi kunjungan</dt>
                  <dd className="m-0 text-right text-night">±{durasiJam} jam</dd></div>
              )}
            </dl>
          </div>

          <div className="rounded-xl bg-primary p-6 text-white shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
            <h3 className="mb-4 flex items-center gap-2 text-xl text-white">
              <Icon name="clock" size={19} /> Kunjungan
            </h3>
            <div>
              <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-primary-fixed-dim">
                JAM OPERASIONAL
              </span>
              {jamHari.map((h) => (
                <div key={h.days} className="flex justify-between gap-4 text-[15px]">
                  <span>{h.days}</span><span>{h.time}</span>
                </div>
              ))}
            </div>
            {venue.address && (
              <div className="mt-4">
                <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-primary-fixed-dim">
                  LOKASI
                </span>
                <p className="text-[15px]">{venue.address}</p>
              </div>
            )}
          </div>

          <div className="overflow-hidden rounded-xl border border-border-subtle shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
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

          <button
            onClick={() => {
              if (!isSelected) toggle(venue.venue_id)
              navigate('/rencana?mode=manual')
            }}
            className="cursor-pointer rounded-lg bg-secondary-container p-3.5 text-sm font-bold text-white transition hover:brightness-105">
            Rencanakan Rute dengan Destinasi Ini →
          </button>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mx-auto w-full max-w-[1280px] px-4 pb-8 md:px-10">
          <h2 className="mb-4 text-[22px] md:text-[28px]">Kamu mungkin juga suka</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {similar.map((v) => <VenueCard key={v.venue_id} venue={v} />)}
          </div>
        </section>
      )}

      <Link to="/"
        className="mx-auto block w-full max-w-[1280px] px-4 pb-8 text-sm font-semibold text-primary no-underline md:px-10">
        ← Kembali ke semua destinasi
      </Link>
    </article>
  )
}
