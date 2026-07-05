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

const pill = (active) =>
  `inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2.5 md:py-[7px]
   text-xs font-semibold transition ${active
    ? 'border-primary bg-primary-fixed text-primary'
    : 'border-outline-variant bg-white text-on-surface-variant hover:bg-surface-gray'}`

export default function Home({ venues }) {
  const [filter, setFilter] = useState('semua')
  const [search, setSearch] = useState('')
  const [shown, setShown] = useState(PAGE)
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    // 8s per slide: fade-out 1.8s tuntas sebelum ganti; pan 9s > 8s agar
    // gerakan tidak pernah berhenti mendadak
    const t = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 8000)
    return () => clearInterval(t)
  }, [])

  // Bayesian weighted rating (IMDB): rating dibobot kredibilitas jumlah ulasan.
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
      {/* hero — carousel Ken Burns (animasi di App.css) */}
      <header className="relative flex h-[60vh] min-h-[440px] md:h-[78vh] md:max-h-[819px] md:min-h-[600px] items-center overflow-hidden bg-night text-[#f9f9ff]">
        <div className="hero-slides absolute inset-0 bg-night">
          {HERO_SLIDES.map((s, i) => (
            <div key={s.label} className={`hero-bg ${i === slide ? 'active' : ''}`}>
              <img src={s.img} alt={s.label} loading="eager" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 z-[2] bg-[linear-gradient(to_top,#101820_0%,rgba(16,24,32,0.15)_50%,rgba(16,24,32,0.55)_100%),linear-gradient(rgba(16,24,32,0.32),rgba(16,24,32,0.32))]" />
        <div className="relative z-[3] mx-auto w-full max-w-[1280px] px-4 md:px-10 text-left">
          <span className="mb-4 inline-block border-l-[3px] border-secondary-container pl-3 text-[13px] font-semibold uppercase tracking-widest text-secondary-fixed-dim">
            {venues.length || 161} destinasi terkurasi di Jakarta
          </span>
          <h1 className="max-w-[720px] text-3xl md:text-5xl font-bold leading-tight tracking-tight text-[#f9f9ff] [text-shadow:0_2px_12px_rgba(0,0,0,0.4)]">
            Satu hari atau lima,<br />rutenya kami yang susun.
          </h1>
          <p className="mb-8 mt-6 max-w-[560px] text-[15px] md:text-lg leading-relaxed opacity-90">
            Pilih tempat yang kamu mau — sistem menyusun urutan kunjungan,
            pembagian hari, dan jam optimalnya. Tanpa bolak-balik, tanpa
            tabrakan jam buka.
          </p>
          <a href="#destinasi"
            className="inline-block rounded-lg bg-secondary-container px-6 py-3.5 md:px-8 md:py-4 text-[15px] md:text-base font-bold text-white no-underline shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.3)]">
            Mulai pilih destinasi →
          </a>
        </div>
        <div className="absolute bottom-6 right-10 z-[3] hidden md:inline-flex items-center gap-1.5 rounded-full bg-night/40 px-3.5 py-1 text-[13px] font-medium text-[#f9f9ff]/85 backdrop-blur-sm">
          <Icon name="pin" size={14} /> {HERO_SLIDES[slide].label}
        </div>
        <div className="absolute bottom-6 left-1/2 z-[3] flex -translate-x-1/2 gap-2">
          {HERO_SLIDES.map((s, i) => (
            <button key={s.label} aria-label={s.label} onClick={() => setSlide(i)}
              className={`h-3 cursor-pointer rounded-full border-none p-0 transition-all ${
                i === slide ? 'w-7 bg-secondary-container' : 'w-3 bg-[#f9f9ff]/40'}`} />
          ))}
        </div>
      </header>

      {/* cara kerja — motif garis-rute (garis dashed di App.css) */}
      <section className="mx-auto max-w-[1280px] px-4 py-6 md:px-10 md:py-10">
        <h2 className="mb-8 text-[26px] md:text-[40px]">Cara kerjanya</h2>
        <ol className="howit-steps relative m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-3 md:gap-8">
          {[
            ['Pilih tempatmu', 'Centang destinasi yang menarik, atau cukup tulis seleramu — "museum sejarah", "taman keluarga", apa saja.', 'bg-primary'],
            ['Kami susun rutenya', 'Urutan kunjungan, pembagian hari, jam datang, sampai jeda makan siang — dihitung supaya perjalananmu searah dan tidak ada tempat yang kena jam tutup.', 'bg-primary'],
            ['Berangkat', 'Dapatkan jadwal lengkap per hari plus peta rute jalannya — tinggal ikuti.', 'bg-secondary-container'],
          ].map(([title, desc, nodeBg], i) => (
            <li key={title} className="relative pl-[60px] md:pl-0 md:pt-[60px]">
              <span className={`absolute left-0 top-0 flex h-11 w-11 items-center justify-center rounded-full font-head text-lg font-bold text-white ring-[6px] ring-white ${nodeBg}`}>
                {i + 1}
              </span>
              <b className="font-head text-[19px]">{title}</b>
              <p className="mt-1.5 text-[15px] text-on-surface-variant">{desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* grid destinasi + panel */}
      <div id="destinasi"
        className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 px-4 pb-24 md:grid-cols-[1fr_320px] lg:grid-cols-[1fr_360px] md:px-10 md:pb-10">
        <section className="min-w-0">
          <div className="mb-6">
            <h2 className="text-[26px] md:text-[40px]">Destinasi</h2>
            <p className="text-on-surface-variant">
              {filtered.length} tempat cocok. Centang yang menarik, atau lewati ke
              <strong> Perancangan</strong> untuk biar sistem yang memilihkan.
            </p>
          </div>

          <div className="relative mb-4 block">
            <Icon name="search" size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
            <input
              className="w-full rounded-lg border border-outline-variant py-2.5 pl-10 pr-3.5 text-[15px]
                         outline-none focus:border-tertiary-container focus:ring-[3px] focus:ring-tertiary-fixed"
              placeholder="Cari nama destinasi…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setShown(PAGE) }} />
          </div>

          <div className="filter-pills mb-6 flex gap-2 overflow-x-auto pb-1.5 md:flex-wrap md:overflow-visible">
            <button className={pill(filter === 'semua')}
              onClick={() => { setFilter('semua'); setShown(PAGE) }}>Semua</button>
            {CATEGORY_GROUPS.map((g) => (
              <button key={g.id} className={pill(filter === g.id)}
                onClick={() => { setFilter(g.id); setShown(PAGE) }}>
                <Icon name={g.icon} size={15} /> {g.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.slice(0, shown).map((v) => (
              <VenueCard key={v.venue_id} venue={v} />
            ))}
          </div>
          {filtered.length === 0 &&
            <p className="py-6 text-on-surface-variant">Tidak ada destinasi cocok.</p>}
          {shown < filtered.length && (
            <button onClick={() => setShown(shown + PAGE)}
              className="mx-auto mt-8 flex w-fit cursor-pointer items-center gap-1.5 rounded-full border-[1.5px] border-outline-variant px-6 py-2.5 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary-fixed">
              Muat {Math.min(PAGE, filtered.length - shown)} lagi
              <Icon name="chevronDown" size={16} />
            </button>
          )}
        </section>

        <aside className="min-w-0">
          <SelectionPanel venues={venues} />
        </aside>
      </div>
    </>
  )
}
