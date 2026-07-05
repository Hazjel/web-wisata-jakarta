import { useState } from 'react'
import { Link } from 'react-router-dom'
import { venuePhotoUrl } from '../api.js'
import { useSelection } from '../context/SelectionContext.jsx'
import { groupOf, PRICE_LABEL } from '../lib/categories.js'
import Icon from './Icon.jsx'

export default function VenueCard({ venue }) {
  const { selected, toggle } = useSelection()
  const g = groupOf(venue.venue_category)
  const isSelected = selected.includes(String(venue.venue_id))
  const [imgOk, setImgOk] = useState(venue.has_photo)

  return (
    <div className={`relative flex flex-col overflow-hidden rounded-xl border bg-white
        transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)]
        ${isSelected ? 'border-primary ring-1 ring-primary' : 'border-border-subtle'}`}>
      <Link to={`/venue/${venue.venue_id}`}
        className="flex h-40 items-center justify-center overflow-hidden bg-surface-gray">
        {imgOk ? (
          <img className="h-full w-full object-cover" loading="lazy" alt={venue.name}
            src={venuePhotoUrl(venue.venue_id, 400)}
            onError={() => setImgOk(false)} />
        ) : (
          <span className="flex opacity-55" style={{ color: g.tint }}>
            <Icon name={g.icon} size={40} />
          </span>
        )}
      </Link>
      <button
        onClick={() => toggle(venue.venue_id)}
        title={isSelected ? 'Hapus dari pilihan' : 'Tambah ke pilihan'}
        className={`absolute right-3 top-3 flex h-11 w-11 md:h-[34px] md:w-[34px] cursor-pointer
          items-center justify-center rounded-lg shadow-sm transition
          ${isSelected
            ? 'bg-primary text-white'
            : 'bg-white/90 text-on-surface-variant hover:bg-white hover:text-primary'}`}>
        <Icon name={isSelected ? 'check' : 'plus'} size={18} strokeWidth={2.25} />
      </button>
      <div className="flex flex-1 flex-col p-4">
        <span className="mb-1 text-[11px] font-bold uppercase tracking-wider"
          style={{ color: g.tint }}>{g.label}</span>
        <Link to={`/venue/${venue.venue_id}`}
          className="mb-1.5 font-head text-[17px] md:text-lg font-semibold leading-tight text-night no-underline hover:text-primary">
          {venue.name}
        </Link>
        {venue.description_short && (
          <p className="mb-2.5 line-clamp-2 text-sm leading-relaxed text-on-surface-variant">
            {venue.description_short}…
          </p>
        )}
        <div className="mt-auto flex gap-3.5 pt-1 text-xs text-outline">
          <span className="inline-flex items-center gap-1">
            <Icon name="star" size={13} strokeWidth={0} className="fill-[#f5a623]" />
            {venue.google_rating || '–'}
          </span>
          <span>{PRICE_LABEL[venue.price_level]}</span>
          {venue.time_spent_minutes &&
            <span>±{Math.round(venue.time_spent_minutes / 60 * 10) / 10} jam</span>}
        </div>
      </div>
    </div>
  )
}
