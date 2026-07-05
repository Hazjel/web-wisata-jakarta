import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
import Icon from '../components/Icon.jsx'
import VenueCard from '../components/VenueCard.jsx'
import { CATEGORY_GROUPS, groupOf } from '../lib/categories.js'
import { venuePhotoUrl } from '../api.js'

const JAKARTA_CENTER = [-6.21, 106.845]

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
    <div className="dest-page">
      <div className="dest-head">
        <h2>Peta Destinasi</h2>
        <p className="section-sub">
          {filtered.length} tempat di Jakarta — klik titik di peta untuk melihat detailnya.
        </p>
        <div className="filter-row">
          <span className="filter-search-wrap">
            <Icon name="search" size={17} className="filter-search-icon" />
            <input className="filter-search" placeholder="Cari nama destinasi…"
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </span>
        </div>
        <div className="filter-pills">
          <button className={filter === 'semua' ? 'active' : ''}
            onClick={() => setFilter('semua')}>Semua</button>
          {CATEGORY_GROUPS.map((g) => (
            <button key={g.id} className={filter === g.id ? 'active' : ''}
              onClick={() => setFilter(g.id)}>
              <Icon name={g.icon} size={15} /> {g.label}
            </button>
          ))}
        </div>
        <div className="dest-tabs">
          <button className={tab === 'peta' ? 'active' : ''}
            onClick={() => setTab('peta')}><Icon name="map" size={16} /> Peta</button>
          <button className={tab === 'daftar' ? 'active' : ''}
            onClick={() => setTab('daftar')}><Icon name="list" size={16} /> Daftar</button>
        </div>
      </div>

      <div className={`dest-body tab-${tab}`}>
        <div className="dest-map">
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
                    <div className="map-pop">
                      {v.has_photo && (
                        <img src={venuePhotoUrl(v.venue_id, 400)} alt={v.name} />
                      )}
                      <b>{v.name}</b>
                      <small>{g.label} · ⭐ {v.google_rating || '–'}</small>
                      <Link to={`/venue/${v.venue_id}`}>Lihat detail →</Link>
                    </div>
                  </Popup>
                </CircleMarker>
              )
            })}
          </MapContainer>
        </div>

        <div className="dest-list">
          {filtered.map((v) => <VenueCard key={v.venue_id} venue={v} />)}
          {filtered.length === 0 && <p className="no-result">Tidak ada destinasi cocok.</p>}
        </div>
      </div>
    </div>
  )
}
