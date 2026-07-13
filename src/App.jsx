import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { fetchHotels, fetchVenues } from './api.js'
import Footer from './components/Footer.jsx'
import TopNav from './components/TopNav.jsx'
import { SelectionProvider } from './context/SelectionContext.jsx'
import Destinations from './pages/Destinations.jsx'
import Home from './pages/Home.jsx'
import Planner from './pages/Planner.jsx'
import VenueDetail from './pages/VenueDetail.jsx'

export default function App() {
  const [hotels, setHotels] = useState([])
  const [venues, setVenues] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchHotels(), fetchVenues()])
      .then(([h, v]) => { setHotels(h); setVenues(v) })
      .catch(() => setError(
        'Gagal terhubung ke backend. Jalankan dulu: uvicorn src.api.api:app --reload'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <BrowserRouter>
      <SelectionProvider>
        <div className="flex min-h-screen flex-col">
          <TopNav />
          {error && (
            <p className="mx-auto mt-4 w-full max-w-[1280px] rounded-lg bg-error-container px-3 py-2.5 text-sm text-on-error-container">
              {error}
            </p>
          )}
          {loading && !error && (
            <p className="mx-auto mt-4 flex w-full max-w-[1280px] items-center gap-2 px-3 py-2.5 text-sm text-on-surface-variant">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-outline-variant border-t-primary" />
              Memuat data destinasi…
            </p>
          )}
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Home venues={venues} />} />
              <Route path="/destinasi" element={<Destinations venues={venues} />} />
              <Route path="/venue/:id" element={<VenueDetail />} />
              <Route path="/rencana"
                element={<Planner hotels={hotels} venues={venues} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </SelectionProvider>
    </BrowserRouter>
  )
}
