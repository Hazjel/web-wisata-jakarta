import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { requestItinerary } from '../api.js'
import ItineraryMap from '../components/ItineraryMap.jsx'
import ItineraryResult from '../components/ItineraryResult.jsx'
import TripForm from '../components/TripForm.jsx'

export default function Planner({ hotels, venues }) {
  const [params] = useSearchParams()
  const [itinerary, setItinerary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(body) {
    setLoading(true)
    setError('')
    try {
      setItinerary(await requestItinerary(body))
    } catch (e) {
      setError(e.message)
    } finally {
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
        {itinerary ? (
          <>
            <ItineraryMap data={itinerary} />
            <ItineraryResult data={itinerary} />
          </>
        ) : (
          <div className="placeholder">
            <p>Isi form di kiri lalu klik <b>Rekomendasikan</b>.</p>
            <p>Mode <b>otomatis</b>: sistem memilih venue dari preferensimu (CBF + MMR).</p>
            <p>Mode <b>manual</b>: venue yang kamu centang di halaman Home / picker —
              sistem menyusun urutan & pembagian harinya.</p>
          </div>
        )}
      </main>
    </div>
  )
}
