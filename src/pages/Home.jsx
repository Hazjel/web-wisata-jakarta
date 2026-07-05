import { useEffect, useMemo, useState } from 'react'
import heroAncol from '../assets/hero-ancol.jpg'
import heroDufan from '../assets/hero-dufan.jpg'
import heroMonas from '../assets/hero-monas-museum.jpg'
import heroPancoran from '../assets/hero-pancoran.jpg'
import heroTmii from '../assets/hero-tmii.jpg'
import Icon from '../components/Icon.jsx'
import SelectionPanel from '../components/SelectionPanel.jsx'
import VenueCard from '../components/VenueCard.jsx'
import { CATEGORY_GROUPS, groupOf } from '../lib/categories.js'

const HERO_SLIDES = [
  { img: heroMonas, label: 'Museum Nasional Indonesia' },
  { img: heroDufan, label: 'Dunia Fantasi' },
  { img: heroTmii, label: 'Taman Mini Indonesia Indah' },
  { img: heroAncol, label: 'Taman Impian Jaya Ancol' },
  { img: heroPancoran, label: 'Patung Dirgantara Pancoran' },
]

const PAGE = 12

export default function Home({ venues }) {
  const [filter, setFilter] = useState('semua')
  const [search, setSearch] = useState('')
  const [shown, setShown] = useState(PAGE)
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    // 8s per slide: fade-out 1.8s tuntas sebelum ganti; pan 8.8s > 8s agar
    // gerakan tidak pernah berhenti mendadak
    const t = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 8000)
    return () => clearInterval(t)
  }, [])

  // Bayesian weighted rating (IMDB): rating dibobot kredibilitas jumlah ulasan,
  // supaya venue rating-5-dari-1-ulasan tidak mengungguli venue ikonik populer.
  // WR = (v/(v+m))·R + (m/(v+m))·C ; m = median count, C = rata-rata rating.
  const bayesian = useMemo(() => {
    const counts = venues.map((v) => v.google_rating_count || 0)
      .filter((c) => c > 0).sort((a, b) => a - b)
    const m = counts.length ? counts[Math.floor(counts.length / 2)] : 1
    const rated = venues.filter((v) => v.google_rating > 0)
    const C = rated.length
      ? rated.reduce((s, v) => s + v.google_rating, 0) / rated.length : 4
    return (v) => {
      const R = v.google_rating || 0
      const vc = v.google_rating_count || 0
      return (vc / (vc + m)) * R + (m / (vc + m)) * C
    }
  }, [venues])

  const filtered = useMemo(() => {
    let out = venues
    if (filter !== 'semua') out = out.filter((v) => groupOf(v.venue_category).id === filter)
    if (search) out = out.filter((v) =>
      v.name.toLowerCase().includes(search.toLowerCase()))
    return [...out].sort((a, b) => bayesian(b) - bayesian(a))
  }, [venues, filter, search, bayesian])

  return (
    <>
      <header className="hero">
        <div className="hero-slides">
          {HERO_SLIDES.map((s, i) => (
            <div key={s.label} className={`hero-bg ${i === slide ? 'active' : ''}`}>
              {/* eager: semua 5 foto di-preload supaya tidak 'muncul mendadak'
                  saat slide berganti (lazy dulu bikin transisi kaget) */}
              <img src={s.img} alt={s.label} loading="eager" />
            </div>
          ))}
        </div>
        <div className="hero-overlay" />
        <div className="hero-inner">
          <span className="hero-eyebrow">{venues.length || 161} destinasi terkurasi di Jakarta</span>
          <h1>Satu hari atau lima,<br />rutenya kami yang susun.</h1>
          <p>Pilih tempat yang kamu mau — sistem menyusun urutan kunjungan,
            pembagian hari, dan jam optimalnya. Tanpa bolak-balik, tanpa
            tabrakan jam buka.</p>
          <a href="#destinasi" className="hero-cta">Mulai pilih destinasi →</a>
        </div>
        <div className="hero-caption">
          <Icon name="pin" size={14} /> {HERO_SLIDES[slide].label}
        </div>
        <div className="hero-dots">
          {HERO_SLIDES.map((s, i) => (
            <button key={s.label} className={i === slide ? 'active' : ''}
              aria-label={s.label} onClick={() => setSlide(i)} />
          ))}
        </div>
      </header>

      <div className="home-layout" id="destinasi">
        <section className="home-main">
          <div className="section-head">
            <h2>Destinasi</h2>
            <p className="section-sub">
              {filtered.length} tempat cocok. Centang yang menarik, atau lewati ke
              <strong> Perancangan</strong> untuk biar sistem yang memilihkan.
            </p>
          </div>

          <div className="filter-row">
            <span className="filter-search-wrap">
              <Icon name="search" size={17} className="filter-search-icon" />
              <input className="filter-search" placeholder="Cari nama destinasi…"
                value={search} onChange={(e) => { setSearch(e.target.value); setShown(PAGE) }} />
            </span>
          </div>
          <div className="filter-pills">
            <button className={filter === 'semua' ? 'active' : ''}
              onClick={() => { setFilter('semua'); setShown(PAGE) }}>Semua</button>
            {CATEGORY_GROUPS.map((g) => (
              <button key={g.id} className={filter === g.id ? 'active' : ''}
                onClick={() => { setFilter(g.id); setShown(PAGE) }}>
                <Icon name={g.icon} size={15} /> {g.label}
              </button>
            ))}
          </div>

          <div className="venue-grid">
            {filtered.slice(0, shown).map((v) => (
              <VenueCard key={v.venue_id} venue={v} />
            ))}
          </div>
          {filtered.length === 0 && <p className="no-result">Tidak ada destinasi cocok.</p>}
          {shown < filtered.length && (
            <button className="load-more" onClick={() => setShown(shown + PAGE)}>
              Muat {Math.min(PAGE, filtered.length - shown)} lagi
              <Icon name="chevronDown" size={16} />
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
