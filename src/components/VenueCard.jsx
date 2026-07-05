import { useState } from 'react'
import { Link } from 'react-router-dom'
import { venuePhotoUrl } from '../api.js'
import { useSelection } from '../context/SelectionContext.jsx'
import { groupOf, PRICE_LABEL } from '../lib/categories.js'
import Icon from './Icon.jsx'

export default function VenueCard({ venue, featured = false }) {
  const { selected, toggle } = useSelection()
  const g = groupOf(venue.venue_category)
  const isSelected = selected.includes(String(venue.venue_id))
  const [imgOk, setImgOk] = useState(venue.has_photo)

  return (
    <div className={`venue-card ${isSelected ? 'selected' : ''} ${featured ? 'featured' : ''}`}>
      <Link to={`/venue/${venue.venue_id}`} className="card-media">
        {imgOk ? (
          <img className="card-photo" loading="lazy" alt={venue.name}
            src={venuePhotoUrl(venue.venue_id, featured ? 800 : 400)}
            onError={() => setImgOk(false)} />
        ) : (
          <span className="card-placeholder" style={{ color: g.tint }}>
            <Icon name={g.icon} size={40} />
          </span>
        )}
      </Link>
      <button
        className={`card-add ${isSelected ? 'added' : ''}`}
        title={isSelected ? 'Hapus dari pilihan' : 'Tambah ke pilihan'}
        onClick={() => toggle(venue.venue_id)}>
        <Icon name={isSelected ? 'check' : 'plus'} size={18} strokeWidth={2.25} />
      </button>
      <div className="card-body">
        <span className="card-subtitle" style={{ color: g.tint }}>{g.label}</span>
        <Link to={`/venue/${venue.venue_id}`} className="card-title">
          {venue.name}
        </Link>
        {venue.description_short && (
          <p className="card-desc">{venue.description_short}…</p>
        )}
        <div className="card-meta">
          <span className="card-rating">
            <Icon name="star" size={13} strokeWidth={0} className="star-fill" />
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
