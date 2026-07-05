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

  const ctl = `rounded-lg border border-outline-variant px-2.5 py-2 text-[13px] outline-none
    focus:border-tertiary-container focus:ring-[3px] focus:ring-tertiary-fixed`

  return (
    <div className="rounded-xl border border-border-subtle bg-white p-3">
      <div className="grid grid-cols-2 gap-2">
        <input className={ctl} value={search}
          onChange={(e) => setSearch(e.target.value)} placeholder="cari venue..." />
        <select className={ctl} value={category}
          onChange={(e) => setCategory(e.target.value)}>
          <option value="">Semua kategori</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <p className="my-2 inline-block rounded-full bg-primary-fixed px-3 py-0.5 text-xs font-semibold tracking-wide text-primary">
        {selected.length} venue dipilih
      </p>
      <div className="flex max-h-[280px] flex-col gap-0.5 overflow-y-auto">
        {shown.map((v) => (
          <label key={v.venue_id}
            className="grid cursor-pointer grid-cols-[auto_1fr] items-start gap-2 rounded px-2 py-1.5 font-normal hover:bg-surface-gray">
            <input type="checkbox" className="accent-primary"
              checked={selected.includes(String(v.venue_id))}
              onChange={() => toggle(String(v.venue_id))} />
            <span className="text-sm text-on-surface">{v.name}</span>
            <span className="col-start-2 text-[11px] text-outline">
              {v.venue_category} · ⭐{v.google_rating} · {PRICE_LABEL[v.price_level]}
            </span>
          </label>
        ))}
        {shown.length === 0 && <p className="text-sm">Tidak ada venue cocok.</p>}
      </div>
    </div>
  )
}
