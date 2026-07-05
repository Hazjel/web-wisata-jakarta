import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { requestItinerary } from '../api.js'
import Icon from '../components/Icon.jsx'
import ItineraryMap from '../components/ItineraryMap.jsx'
import ItineraryResult from '../components/ItineraryResult.jsx'
import TripForm from '../components/TripForm.jsx'
import { useSelection } from '../context/SelectionContext.jsx'

// Loading bertahap (bahasa user, tanpa jargon teknis)
const STAGES = [
  'Menyaring tempat sesuai seleramu…',
  'Menyusun urutan & jadwal kunjungan…',
  'Merapikan rute perjalananmu…',
]

const HISTORY_KEY = 'planHistory'

function readHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [] }
  catch { return [] }
}

// body request -> query string (tautan bisa dibagikan)
function bodyToParams(body) {
  const p = new URLSearchParams()
  if (body.preference_text) p.set('pref', body.preference_text)
  p.set('budget', body.budget)
  p.set('d', body.n_days)
  p.set('day', body.start_day)
  if (body.hotel_id !== null && body.hotel_id !== undefined)
    p.set('hotel', body.hotel_id)
  if (body.venue_ids) { p.set('mode', 'manual'); p.set('v', body.venue_ids.join(',')) }
  return p
}

function paramsToBody(p) {
  const manual = p.get('mode') === 'manual' && p.get('v')
  return {
    preference_text: p.get('pref') || null,
    budget: p.get('budget') || 'menengah',
    n_days: Number(p.get('d')) || 2,
    start_day: p.get('day') || 'Sabtu',
    hotel_id: p.get('hotel') !== null && p.get('hotel') !== '' ? Number(p.get('hotel')) : null,
    venue_ids: manual ? p.get('v').split(',') : null,
  }
}

export default function Planner({ hotels, venues }) {
  const [params, setParams] = useSearchParams()
  const { setSelected } = useSelection()
  const [itinerary, setItinerary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState(0)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState(readHistory)
  const stageTimer = useRef(null)
  const autoRan = useRef(false)

  useEffect(() => () => clearInterval(stageTimer.current), [])

  async function handleSubmit(body) {
    setLoading(true)
    setStage(0)
    setError('')
    setCopied(false)
    const qs = bodyToParams(body)
    setParams(qs, { replace: true })
    stageTimer.current = setInterval(
      () => setStage((s) => Math.min(s + 1, STAGES.length - 1)), 900)
    try {
      const result = await requestItinerary(body)
      setItinerary(result)
      // riwayat: 5 terakhir
      const entry = {
        qs: qs.toString(),
        label: body.venue_ids
          ? `${body.venue_ids.length} destinasi pilihan · ${body.n_days} hari`
          : `"${body.preference_text}" · ${body.n_days} hari`,
        summary: `${result.summary.n_visited} destinasi terkunjungi`,
        ts: Date.now(),
      }
      const next = [entry, ...readHistory().filter((h) => h.qs !== entry.qs)].slice(0, 5)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
      setHistory(next)
    } catch (e) {
      setError(e.message)
    } finally {
      clearInterval(stageTimer.current)
      setLoading(false)
    }
  }

  // auto-submit saat dibuka dari tautan berbagi (?pref=… atau ?v=…)
  useEffect(() => {
    if (autoRan.current) return
    if (!hotels.length || !venues.length) return
    if (!params.get('pref') && !params.get('v')) return
    autoRan.current = true
    const body = paramsToBody(params)
    if (body.venue_ids) setSelected(body.venue_ids)
    handleSubmit(body)
  }, [hotels, venues])  // eslint-disable-line react-hooks/exhaustive-deps

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  function loadHistory(h) {
    window.location.href = `/rencana?${h.qs}`
  }

  const initial = paramsToBody(params)

  return (
    <div className="layout">
      <aside className="sidebar">
        <TripForm hotels={hotels} venues={venues} loading={loading}
          initialMode={params.get('mode') === 'manual' ? 'manual' : 'otomatis'}
          initialValues={initial}
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
            <div className="result-actions">
              <button onClick={copyLink}>
                <Icon name="route" size={15} />
                {copied ? 'Tautan tersalin ✓' : 'Salin tautan rencana'}
              </button>
              <button onClick={() => window.print()}>
                <Icon name="list" size={15} /> Cetak / simpan PDF
              </button>
            </div>
            <ItineraryMap data={itinerary} />
            <ItineraryResult data={itinerary} />
          </>
        ) : (
          <>
            <div className="placeholder">
              <p>Isi form di kiri lalu klik <b>Rekomendasikan</b>.</p>
              <p>Mode <b>otomatis</b>: tulis apa yang kamu suka — museum, taman,
                pantai — dan kami pilihkan tempat terbaiknya.</p>
              <p>Mode <b>manual</b>: centang sendiri tempat yang ingin kamu
                kunjungi — kami susun urutan, pembagian hari, dan jamnya.</p>
            </div>
            {history.length > 0 && (
              <div className="plan-history">
                <h3>Rencana sebelumnya</h3>
                {history.map((h) => (
                  <button key={h.ts} className="plan-history-item"
                    onClick={() => loadHistory(h)}>
                    <b>{h.label}</b>
                    <small>{h.summary} · {new Date(h.ts).toLocaleDateString('id')}</small>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
