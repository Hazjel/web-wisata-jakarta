import { useMemo, useState } from 'react'
import SelectionPanel from '../components/SelectionPanel.jsx'
import VenueCard from '../components/VenueCard.jsx'
import { CATEGORY_GROUPS, groupOf } from '../lib/categories.js'

const PAGE = 12

export default function Home({ venues }) {
  const [filter, setFilter] = useState('semua')
  const [search, setSearch] = useState('')
  const [shown, setShown] = useState(PAGE)

  const filtered = useMemo(() => {
    let out = venues
    if (filter !== 'semua') out = out.filter((v) => groupOf(v.venue_category).id === filter)
    if (search) out = out.filter((v) =>
      v.name.toLowerCase().includes(search.toLowerCase()))
    return [...out].sort((a, b) => b.google_rating - a.google_rating)
  }, [venues, filter, search])

  return (
    <>
      <header className="hero">
        <div className="hero-inner">
          <h1>Jelajahi Jakarta dengan Rekomendasi Terbaik</h1>
          <p>Temukan rute perjalanan unikmu di jantung Indonesia — {venues.length} destinasi
            terkurasi, itinerary multi-hari disusun otomatis.</p>
          <a href="#destinasi" className="hero-cta">Mulai Perjalanan Anda</a>
        </div>
      </header>

      <div className="home-layout" id="destinasi">
        <section className="home-main">
          <h2>Pilih Destinasi Anda</h2>
          <p className="section-sub">
            Pilih lokasi yang ingin dikunjungi untuk rute kustom, atau langsung ke
            halaman Perancangan untuk rekomendasi otomatis dari preferensimu.
          </p>

          <div className="filter-row">
            <input className="filter-search" placeholder="cari destinasi..."
              value={search} onChange={(e) => { setSearch(e.target.value); setShown(PAGE) }} />
          </div>
          <div className="filter-pills">
            <button className={filter === 'semua' ? 'active' : ''}
              onClick={() => { setFilter('semua'); setShown(PAGE) }}>Semua</button>
            {CATEGORY_GROUPS.map((g) => (
              <button key={g.id} className={filter === g.id ? 'active' : ''}
                onClick={() => { setFilter(g.id); setShown(PAGE) }}>
                {g.icon} {g.label}
              </button>
            ))}
          </div>

          <div className="venue-grid">
            {filtered.slice(0, shown).map((v) => (
              <VenueCard key={v.venue_id} venue={v} />
            ))}
          </div>
          {filtered.length === 0 && <p>Tidak ada destinasi cocok.</p>}
          {shown < filtered.length && (
            <button className="load-more" onClick={() => setShown(shown + PAGE)}>
              Muat Lebih Banyak ({filtered.length - shown} lagi) ⌄
            </button>
          )}
        </section>

        <aside className="home-side">
          <SelectionPanel venues={venues} />
        </aside>
      </div>
    </>
  )
}
