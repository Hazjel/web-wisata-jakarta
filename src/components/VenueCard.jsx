import { Link } from 'react-router-dom'
import { useSelection } from '../context/SelectionContext.jsx'
import { groupOf, PRICE_LABEL } from '../lib/categories.js'

export default function VenueCard({ venue }) {
  const { selected, toggle } = useSelection()
  const g = groupOf(venue.venue_category)
  const isSelected = selected.includes(String(venue.venue_id))

  return (
    <div className={`venue-card ${isSelected ? 'selected' : ''}`}>
      <Link to={`/venue/${venue.venue_id}`} className="card-media"
        style={{ background: g.gradient }}>
        <span className="card-icon">{g.icon}</span>
        <span className="card-group">{g.label}</span>
      </Link>
      <button
        className={`card-add ${isSelected ? 'added' : ''}`}
        title={isSelected ? 'Hapus dari pilihan' : 'Tambah ke pilihan'}
        onClick={() => toggle(venue.venue_id)}>
        {isSelected ? '✓' : '+'}
      </button>
      <div className="card-body">
        <Link to={`/venue/${venue.venue_id}`} className="card-title">
          {venue.name}
        </Link>
        <div className="card-meta">
          <span>⭐ {venue.google_rating || '–'}</span>
          <span>{PRICE_LABEL[venue.price_level]}</span>
          {venue.time_spent_minutes &&
            <span>±{Math.round(venue.time_spent_minutes / 60 * 10) / 10} jam</span>}
        </div>
        {venue.description_short && (
          <p className="card-desc">{venue.description_short}…</p>
        )}
      </div>
    </div>
  )
}
