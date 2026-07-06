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
  if (body.vehicle && body.vehicle !== 'mobil') p.set('veh', body.vehicle)
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
    vehicle: p.get('veh') || 'mobil',
    venue_ids: manual ? p.get('v').split(',') : null,
  }
}

const actionBtn = `inline-flex cursor-pointer items-center gap-1.5 rounded-full border-[1.5px]
  border-outline-variant bg-white px-4 py-2 text-[13px] font-semibold text-primary
  transition hover:border-primary hover:bg-primary-fixed`

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

  const initial = paramsToBody(params)

  return (
    <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-6 p-4 md:grid-cols-[360px_1fr] lg:grid-cols-[400px_1fr] md:p-6 print:block print:max-w-none print:p-0">
      <aside className="min-w-0">
        <TripForm hotels={hotels} venues={venues} loading={loading}
          initialMode={params.get('mode') === 'manual' ? 'manual' : 'otomatis'}
          initialValues={initial}
          onSubmit={handleSubmit} />
        {error && (
          <p className="mt-3 rounded-lg bg-error-container px-3 py-2.5 text-sm text-on-error-container">
            {error}
          </p>
        )}
      </aside>

      <main className="flex min-w-0 flex-col gap-6 print:block">
        {loading ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-border-subtle bg-surface-gray p-10 text-center">
            <span className="planner-loading-icon text-primary"><Icon name="route" size={40} /></span>
            <p className="m-0 font-semibold text-on-surface-variant">{STAGES[stage]}</p>
            <div className="h-1.5 w-[min(320px,80%)] overflow-hidden rounded-full bg-surface-high">
              <span className="block h-full rounded-full bg-secondary-container transition-[width] duration-700 ease-out"
                style={{ width: `${((stage + 1) / STAGES.length) * 100}%` }} />
            </div>
          </div>
        ) : itinerary ? (
          <>
            <div className="flex flex-wrap gap-2 print:hidden">
              <button className={actionBtn} onClick={copyLink}>
                <Icon name="route" size={15} />
                {copied ? 'Tautan tersalin ✓' : 'Salin tautan rencana'}
              </button>
              <button className={actionBtn} onClick={() => window.print()}>
                <Icon name="list" size={15} /> Cetak / simpan PDF
              </button>
            </div>
            <ItineraryMap data={itinerary} />
            <ItineraryResult data={itinerary} />
          </>
        ) : (
          <>
            <div className="rounded-2xl border border-border-subtle bg-surface-gray p-10 leading-7 text-on-surface-variant [&_b]:text-primary">
              <p>Isi form di kiri lalu klik <b>Rekomendasikan</b>.</p>
              <p>Mode <b>otomatis</b>: tulis apa yang kamu suka — museum, taman,
                pantai — dan kami pilihkan tempat terbaiknya.</p>
              <p>Mode <b>manual</b>: centang sendiri tempat yang ingin kamu
                kunjungi — kami susun urutan, pembagian hari, dan jamnya.</p>
            </div>
            {history.length > 0 && (
              <div className="rounded-2xl border border-border-subtle bg-surface-gray p-6">
                <h3 className="mb-2 text-[17px]">Rencana sebelumnya</h3>
                {history.map((h) => (
                  <button key={h.ts}
                    onClick={() => { window.location.href = `/rencana?${h.qs}` }}
                    className="mt-1.5 flex w-full cursor-pointer flex-col items-start gap-0.5 rounded-lg border border-border-subtle bg-white px-3 py-2.5 text-left transition hover:border-primary">
                    <b className="text-sm text-on-surface">{h.label}</b>
                    <small className="text-xs text-outline">
                      {h.summary} · {new Date(h.ts).toLocaleDateString('id')}
                    </small>
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
