import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { requestItinerary } from '../api.js'
import Icon from '../components/Icon.jsx'
import ItineraryMap from '../components/ItineraryMap.jsx'
import ItineraryResult from '../components/ItineraryResult.jsx'
import TripForm from '../components/TripForm.jsx'

// Loading bertahap (bahasa user, tanpa jargon teknis)
const STAGES = [
  'Menyaring tempat sesuai seleramu…',
  'Menyusun urutan & jadwal kunjungan…',
  'Merapikan rute perjalananmu…',
]

export default function Planner({ hotels, venues }) {
  const [params] = useSearchParams()
  const [itinerary, setItinerary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState(0)
  const [error, setError] = useState('')
  const stageTimer = useRef(null)

  useEffect(() => () => clearInterval(stageTimer.current), [])

  async function handleSubmit(body) {
    setLoading(true)
    setStage(0)
    setError('')
    stageTimer.current = setInterval(
      () => setStage((s) => Math.min(s + 1, STAGES.length - 1)), 900)
    try {
      setItinerary(await requestItinerary(body))
    } catch (e) {
      setError(e.message)
    } finally {
      clearInterval(stageTimer.current)
      setLoading(false)
    }
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <TripForm hotels={hotels} venues={venues} loading={loading}
          initialMode={params.get('mode') === 'manual' ? 'manual' : 'otomatis'}
          onSubmit={handleSubmit} />
        {error && <p className="error">{error}</p>}
      </aside>

      <main className="content">
        {loading ? (
          <div className="planner-loading">
            <span className="planner-loading-icon"><Icon name="route" size={40} /></span>
            <p className="planner-loading-stage">{STAGES[stage]}</p>
            <div className="planner-loading-bar">
              <span style={{ width: `${((stage + 1) / STAGES.length) * 100}%` }} />
            </div>
          </div>
        ) : itinerary ? (
          <>
            <ItineraryMap data={itinerary} />
            <ItineraryResult data={itinerary} />
          </>
        ) : (
          <div className="placeholder">
            <p>Isi form di kiri lalu klik <b>Rekomendasikan</b>.</p>
            <p>Mode <b>otomatis</b>: tulis apa yang kamu suka — museum, taman,
              pantai — dan kami pilihkan tempat terbaiknya.</p>
            <p>Mode <b>manual</b>: centang sendiri tempat yang ingin kamu
              kunjungi — kami susun urutan, pembagian hari, dan jamnya.</p>
          </div>
        )}
      </main>
    </div>
  )
}
