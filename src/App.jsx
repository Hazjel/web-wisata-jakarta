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

  useEffect(() => {
    Promise.all([fetchHotels(), fetchVenues()])
      .then(([h, v]) => { setHotels(h); setVenues(v) })
      .catch(() => setError(
        'Gagal terhubung ke backend. Jalankan dulu: uvicorn src.api.api:app --reload'))
  }, [])

  return (
    <BrowserRouter>
      <SelectionProvider>
        <div className="app-shell">
          <TopNav />
          {error && <p className="error global-error">{error}</p>}
          <div className="page">
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
