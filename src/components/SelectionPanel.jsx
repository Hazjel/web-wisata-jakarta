import { useNavigate } from 'react-router-dom'
import { useSelection } from '../context/SelectionContext.jsx'
import { groupOf } from '../lib/categories.js'
import Icon from './Icon.jsx'

export default function SelectionPanel({ venues }) {
  const { selected, toggle, clear } = useSelection()
  const navigate = useNavigate()
  const items = venues.filter((v) => selected.includes(String(v.venue_id)))

  return (
    <div className="selection-panel">
      <h3>Destinasi Terpilih</h3>
      <p className="selection-count">
        {items.length === 0 ? 'Belum ada destinasi'
          : `${items.length} destinasi ditambahkan`}
      </p>

      <div className="selection-list">
        {items.map((v) => {
          const g = groupOf(v.venue_category)
          return (
            <div key={v.venue_id} className="selection-item">
              <span className="selection-thumb" style={{ color: g.tint }}>
                <Icon name={g.icon} size={22} />
              </span>
              <span className="selection-info">
                <b>{v.name}</b>
                <small>
                  ±{Math.round((v.time_spent_minutes || 60) / 60 * 10) / 10} jam kunjungan
                </small>
              </span>
              <button className="selection-remove" title="Hapus"
                onClick={() => toggle(v.venue_id)}>
                <Icon name="close" size={15} />
              </button>
            </div>
          )
        })}
        <div className="selection-hint">
          <Icon name="plus" size={15} /> Tambahkan destinasi dari daftar
        </div>
      </div>

      <button className="selection-cta" disabled={items.length < 2}
        onClick={() => navigate('/rencana?mode=manual')}>
        Susun Rute dari {items.length} destinasi →
      </button>
      {items.length > 0 && (
        <button className="selection-clear" onClick={clear}>Kosongkan pilihan</button>
      )}
    </div>
  )
}
