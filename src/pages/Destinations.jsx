import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
import Icon from '../components/Icon.jsx'
import VenueCard from '../components/VenueCard.jsx'
import { CATEGORY_GROUPS, groupOf } from '../lib/categories.js'
import { venuePhotoUrl } from '../api.js'

const JAKARTA_CENTER = [-6.21, 106.845]

const pill = (active) =>
  `inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2.5 md:py-[7px]
   text-xs font-semibold transition ${active
    ? 'border-primary bg-primary-fixed text-primary'
    : 'border-outline-variant bg-white text-on-surface-variant hover:bg-surface-gray'}`

const tabBtn = (active) =>
  `flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-3 py-3
   text-sm font-semibold transition ${active
    ? 'border-primary bg-primary text-white'
    : 'border-outline-variant bg-white text-on-surface-variant'}`

export default function Destinations({ venues }) {
  const [filter, setFilter] = useState('semua')
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('peta') // mobile: peta | daftar

  const filtered = useMemo(() => {
    let out = venues
    if (filter !== 'semua') out = out.filter((v) => groupOf(v.venue_category).id === filter)
    if (search) out = out.filter((v) =>
      v.name.toLowerCase().includes(search.toLowerCase()))
    return out
  }, [venues, filter, search])

  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-4 p-4 md:px-10 md:pb-10 md:pt-6">
      <div>
        <h2 className="mb-1 text-[26px] md:text-[40px]">Peta Destinasi</h2>
        <p className="mb-4 text-on-surface-variant">
          {filtered.length} tempat di Jakarta — klik titik di peta untuk melihat detailnya.
        </p>
        <div className="relative mb-4 block">
          <Icon name="search" size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
          <input
            className="w-full rounded-lg border border-outline-variant py-2.5 pl-10 pr-3.5 text-[15px]
                       outline-none focus:border-tertiary-container focus:ring-[3px] focus:ring-tertiary-fixed"
            placeholder="Cari nama destinasi…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="filter-pills flex gap-2 overflow-x-auto pb-1.5 md:flex-wrap md:overflow-visible">
          <button className={pill(filter === 'semua')}
            onClick={() => setFilter('semua')}>Semua</button>
          {CATEGORY_GROUPS.map((g) => (
            <button key={g.id} className={pill(filter === g.id)}
              onClick={() => setFilter(g.id)}>
              <Icon name={g.icon} size={15} /> {g.label}
            </button>
          ))}
        </div>
        <div className="mt-3 flex gap-2 md:hidden">
          <button className={tabBtn(tab === 'peta')} onClick={() => setTab('peta')}>
            <Icon name="map" size={16} /> Peta
          </button>
          <button className={tabBtn(tab === 'daftar')} onClick={() => setTab('daftar')}>
            <Icon name="list" size={16} /> Daftar
          </button>
        </div>
      </div>

      <div className="grid min-h-0 grid-cols-1 gap-6 md:min-h-[60vh] md:grid-cols-2 lg:grid-cols-[3fr_2fr]">
        <div className={`overflow-hidden rounded-2xl border border-border-subtle
            h-[60vh] md:sticky md:top-20 md:h-[calc(100vh-120px)]
            ${tab === 'daftar' ? 'hidden md:block' : ''}`}>
          <MapContainer center={JAKARTA_CENTER} zoom={11} className="map"
            style={{ height: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
            {filtered.map((v) => {
              const g = groupOf(v.venue_category)
              return (
                <CircleMarker key={v.venue_id}
                  center={[v.latitude, v.longitude]}
                  radius={7}
                  pathOptions={{ color: '#fff', weight: 1.5,
                    fillColor: g.tint, fillOpacity: 0.9 }}>
                  <Popup>
                    <div className="flex min-w-[180px] flex-col gap-1">
                      {v.has_photo && (
                        <img className="h-[90px] w-full rounded object-cover"
                          src={venuePhotoUrl(v.venue_id, 400)} alt={v.name} />
                      )}
                      <b className="text-sm">{v.name}</b>
                      <small className="text-outline">{g.label} · ⭐ {v.google_rating || '–'}</small>
                      <Link className="text-[13px] font-semibold text-primary"
                        to={`/venue/${v.venue_id}`}>Lihat detail →</Link>
                    </div>
                  </Popup>
                </CircleMarker>
              )
            })}
          </MapContainer>
        </div>

        <div className={`grid content-start grid-cols-1 gap-4
            ${tab === 'peta' ? 'hidden md:grid' : 'grid'}`}>
          {filtered.map((v) => <VenueCard key={v.venue_id} venue={v} />)}
          {filtered.length === 0 &&
            <p className="py-6 text-on-surface-variant">Tidak ada destinasi cocok.</p>}
        </div>
      </div>
    </div>
  )
}
