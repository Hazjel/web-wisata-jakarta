import { useState } from 'react'
import VenuePicker from './VenuePicker.jsx'

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

export default function TripForm({ hotels, venues, loading, onSubmit }) {
  const [mode, setMode] = useState('otomatis')
  const [preference, setPreference] = useState('museum sejarah budaya')
  const [budget, setBudget] = useState('menengah')
  const [nDays, setNDays] = useState(2)
  const [startDay, setStartDay] = useState('Sabtu')
  const [hotelId, setHotelId] = useState('')
  const [hotelSearch, setHotelSearch] = useState('')
  const [selectedVenues, setSelectedVenues] = useState([])
  const [error, setError] = useState('')

  const hotelOptions = hotels
    .filter((h) => h.name.toLowerCase().includes(hotelSearch.toLowerCase()))
    .sort((a, b) => b.google_rating - a.google_rating)

  function submit(e) {
    e.preventDefault()
    setError('')
    if (mode === 'otomatis' && !preference.trim()) {
      setError('Mode otomatis butuh preferensi (mis. "museum sejarah budaya")')
      return
    }
    if (mode === 'manual' && selectedVenues.length < 2) {
      setError('Mode manual: pilih minimal 2 venue')
      return
    }
    onSubmit({
      preference_text: preference.trim() || null,
      budget,
      n_days: Number(nDays),
      start_day: startDay,
      hotel_id: hotelId === '' ? null : Number(hotelId),
      venue_ids: mode === 'manual' ? selectedVenues : null,
      // algorithm tidak dikirim -> backend pilih otomatis dari hasil
      // eksperimen (hybrid utk 1-3 hari, GA utk 4-5 hari)
    })
  }

  return (
    <form className="trip-form" onSubmit={submit}>
      <h2>Rencanakan Perjalanan</h2>

      <div className="mode-toggle">
        <button type="button"
          className={mode === 'otomatis' ? 'active' : ''}
          onClick={() => setMode('otomatis')}>
          Otomatis (preferensi)
        </button>
        <button type="button"
          className={mode === 'manual' ? 'active' : ''}
          onClick={() => setMode('manual')}>
          Pilih venue manual
        </button>
      </div>

      <label>
        Preferensi {mode === 'manual' && <small>(opsional di mode manual)</small>}
        <input value={preference} onChange={(e) => setPreference(e.target.value)}
          placeholder="mis. museum sejarah budaya" />
      </label>

      {mode === 'manual' && (
        <VenuePicker venues={venues} selected={selectedVenues}
          onChange={setSelectedVenues} />
      )}

      <div className="form-row">
        <label>
          Budget
          <select value={budget} onChange={(e) => setBudget(e.target.value)}>
            <option value="hemat">Hemat</option>
            <option value="menengah">Menengah</option>
            <option value="bebas">Bebas</option>
          </select>
        </label>
        <label>
          Jumlah hari
          <select value={nDays} onChange={(e) => setNDays(e.target.value)}>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label>
          Hari mulai
          <select value={startDay} onChange={(e) => setStartDay(e.target.value)}>
            {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </label>
      </div>

      <label>
        Hotel (titik berangkat/pulang)
        <input value={hotelSearch} onChange={(e) => setHotelSearch(e.target.value)}
          placeholder="cari hotel..." />
        <small>{hotelOptions.length} hotel tersedia</small>
        <select value={hotelId} onChange={(e) => setHotelId(e.target.value)} size="6">
          <option value="">(default: pusat kota)</option>
          {hotelOptions.map((h) => (
            <option key={h.hotel_id} value={h.hotel_id}>
              {h.name} — ⭐{h.google_rating}
            </option>
          ))}
        </select>
      </label>

      {error && <p className="error">{error}</p>}

      <button type="submit" className="submit" disabled={loading}>
        {loading ? 'Menyusun itinerary…' : <>🔍 Rekomendasikan</>}
      </button>
    </form>
  )
}
