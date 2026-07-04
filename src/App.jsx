import { useEffect, useState } from 'react'
import './App.css'
import { fetchHotels, fetchVenues, requestItinerary } from './api.js'
import ItineraryMap from './components/ItineraryMap.jsx'
import ItineraryResult from './components/ItineraryResult.jsx'
import TripForm from './components/TripForm.jsx'

export default function App() {
  const [hotels, setHotels] = useState([])
  const [venues, setVenues] = useState([])
  const [itinerary, setItinerary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([fetchHotels(), fetchVenues()])
      .then(([h, v]) => { setHotels(h); setVenues(v) })
      .catch(() => setError(
        'Gagal terhubung ke backend. Jalankan dulu: uvicorn src.api.api:app --reload'))
  }, [])

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
        <h1>Wisata Jakarta 🗺️</h1>
        <p className="tagline">
          Itinerary multi-hari — Content-Based Filtering + optimasi rute GA/PSO
        </p>
        <TripForm hotels={hotels} venues={venues} loading={loading}
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
            <p>Isi form di kiri lalu klik <b>Susun Itinerary</b>.</p>
            <p>Mode <b>otomatis</b>: sistem memilih venue dari preferensimu (CBF + MMR).</p>
            <p>Mode <b>manual</b>: centang sendiri venue yang ingin dikunjungi —
              sistem menyusun urutan & pembagian harinya.</p>
          </div>
        )}
      </main>
    </div>
  )
}
