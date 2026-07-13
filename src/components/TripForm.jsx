import { useState } from 'react'
import { useSelection } from '../context/SelectionContext.jsx'
import Icon from './Icon.jsx'
import VenuePicker from './VenuePicker.jsx'

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
const VEHICLES = [
  { key: 'mobil', icon: 'car', label: 'Mobil' },
  { key: 'motor', icon: 'motorbike', label: 'Motor' },
]

const label = 'flex flex-col gap-1.5 text-sm font-semibold text-on-surface-variant'
const input = `rounded-lg border border-outline-variant bg-white px-3 py-2.5 text-[15px] font-normal
  text-night outline-none focus:border-tertiary-container focus:ring-[3px] focus:ring-tertiary-fixed`
const modeBtn = (active) =>
  `cursor-pointer rounded-lg border p-2.5 text-[13px] transition hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] ${
    active ? 'border-primary bg-primary font-semibold text-white'
           : 'border-outline-variant bg-white font-medium text-on-surface-variant'}`

export default function TripForm({ hotels, venues, loading, onSubmit,
                                   initialMode = 'otomatis',
                                   initialValues = {} }) {
  // venue terpilih dibagikan dgn halaman Home/Detail via context
  const { selected: selectedVenues, setSelected: setSelectedVenues } = useSelection()
  const [mode, setMode] = useState(initialMode)
  const [preference, setPreference] = useState(
    initialValues.preference_text ?? 'museum sejarah budaya')
  const [budget, setBudget] = useState(initialValues.budget ?? 'menengah')
  const [nDays, setNDays] = useState(initialValues.n_days ?? 2)
  const [startDay, setStartDay] = useState(initialValues.start_day ?? 'Sabtu')
  const [hotelId, setHotelId] = useState(
    initialValues.hotel_id !== null && initialValues.hotel_id !== undefined
      ? String(initialValues.hotel_id) : '')
  const [hotelQuery, setHotelQuery] = useState('')
  const [hotelOpen, setHotelOpen] = useState(false)
  const [vehicle, setVehicle] = useState(initialValues.vehicle ?? 'mobil')
  const [error, setError] = useState('')

  const selectedHotel = hotels.find((h) => String(h.hotel_id) === hotelId)
  const hotelOptions = hotels
    .filter((h) => h.name.toLowerCase().includes(hotelQuery.toLowerCase()))
    .sort((a, b) => b.google_rating - a.google_rating)
    .slice(0, 8)

  function pickHotel(h) {
    if (h) { setHotelId(String(h.hotel_id)); setHotelQuery('') }
    else { setHotelId(''); setHotelQuery('') }
    setHotelOpen(false)
  }

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
      vehicle,
      // algorithm tidak dikirim -> backend pilih otomatis dari hasil
      // eksperimen (hybrid utk 1-3 hari, GA utk 4-5 hari)
    })
  }

  return (
    <form onSubmit={submit}
      className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface-gray p-6 print:hidden">
      <h2 className="text-xl">Rencanakan Perjalanan</h2>

      <div className="grid grid-cols-2 gap-2">
        <button type="button" className={modeBtn(mode === 'otomatis')}
          onClick={() => setMode('otomatis')}>
          Otomatis (preferensi)
        </button>
        <button type="button" className={modeBtn(mode === 'manual')}
          onClick={() => setMode('manual')}>
          Pilih venue manual
        </button>
      </div>

      <label className={label}>
        <span>Preferensi {mode === 'manual' &&
          <small className="font-normal text-outline">(opsional di mode manual)</small>}</span>
        <input className={input} value={preference}
          onChange={(e) => setPreference(e.target.value)}
          placeholder="mis. museum sejarah budaya" />
      </label>

      {mode === 'manual' && (
        <VenuePicker venues={venues} selected={selectedVenues}
          onChange={setSelectedVenues} />
      )}

      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        <label className={label}>
          Budget
          <select className={input} value={budget} onChange={(e) => setBudget(e.target.value)}>
            <option value="hemat">Hemat</option>
            <option value="menengah">Menengah</option>
            <option value="bebas">Bebas</option>
          </select>
        </label>
        <label className={label}>
          Jumlah hari
          <select className={input} value={nDays} onChange={(e) => setNDays(e.target.value)}>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label className={label}>
          Hari mulai
          <select className={input} value={startDay} onChange={(e) => setStartDay(e.target.value)}>
            {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </label>
      </div>

      <div className={label}>
        Kendaraan
        <div className="grid grid-cols-2 gap-2">
          {VEHICLES.map((v) => (
            <button key={v.key} type="button" onClick={() => setVehicle(v.key)}
              className={`flex cursor-pointer flex-col items-center gap-1 rounded-lg border p-2.5 text-[13px] transition
                ${vehicle === v.key
                  ? 'border-primary bg-primary font-semibold text-white'
                  : 'border-outline-variant bg-white font-medium text-on-surface-variant hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)]'}`}>
              <Icon name={v.icon} size={22} />
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <label className={label}>
        Hotel (titik berangkat/pulang)
        <div className="relative">
          <input className={`${input} w-full`}
            value={hotelOpen ? hotelQuery : (selectedHotel ? selectedHotel.name : '')}
            onChange={(e) => { setHotelQuery(e.target.value); setHotelOpen(true) }}
            onFocus={() => { setHotelQuery(''); setHotelOpen(true) }}
            onBlur={() => setTimeout(() => setHotelOpen(false), 150)}
            placeholder="(default: pusat kota) — ketik nama hotel..." />
          {hotelOpen && (
            <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-outline-variant bg-white shadow-lg">
              <li>
                <button type="button" onMouseDown={() => pickHotel(null)}
                  className="w-full px-3 py-2 text-left text-[14px] text-outline hover:bg-surface-gray">
                  (default: pusat kota)
                </button>
              </li>
              {hotelOptions.map((h) => (
                <li key={h.hotel_id}>
                  <button type="button" onMouseDown={() => pickHotel(h)}
                    className="w-full px-3 py-2 text-left text-[14px] text-night hover:bg-surface-gray">
                    {h.name} — ⭐{h.google_rating}
                  </button>
                </li>
              ))}
              {hotelOptions.length === 0 && (
                <li className="px-3 py-2 text-[13px] text-outline">Tak ada hotel cocok</li>
              )}
            </ul>
          )}
        </div>
      </label>

      {error && (
        <p className="m-0 rounded-lg bg-error-container px-3 py-2.5 text-sm text-on-error-container">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading}
        className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-secondary-container p-3.5 text-base font-bold text-white transition hover:brightness-105 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] disabled:cursor-wait disabled:bg-outline-variant">
        {loading ? 'Menyusun itinerary…' : <>🔍 Rekomendasikan</>}
      </button>
    </form>
  )
}
