import { useMemo, useState } from 'react'

const PRICE_LABEL = ['gratis', 'murah', 'sedang', 'mahal']

export default function VenuePicker({ venues, selected, onChange }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  const categories = useMemo(
    () => [...new Set(venues.map((v) => v.venue_category))].sort(),
    [venues],
  )

  const shown = venues.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase()) &&
    (!category || v.venue_category === category),
  )

  function toggle(id) {
    onChange(selected.includes(id)
      ? selected.filter((x) => x !== id)
      : [...selected, id])
  }

  return (
    <div className="venue-picker">
      <div className="picker-controls">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="cari venue..." />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Semua kategori</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <p className="picker-count">{selected.length} venue dipilih</p>
      <div className="picker-list">
        {shown.map((v) => (
          <label key={v.venue_id} className="picker-item">
            <input type="checkbox"
              checked={selected.includes(String(v.venue_id))}
              onChange={() => toggle(String(v.venue_id))} />
            <span className="picker-name">{v.name}</span>
            <span className="picker-meta">
              {v.venue_category} · ⭐{v.google_rating} · {PRICE_LABEL[v.price_level]}
            </span>
          </label>
        ))}
        {shown.length === 0 && <p>Tidak ada venue cocok.</p>}
      </div>
    </div>
  )
}
