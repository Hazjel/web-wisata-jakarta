import { useState } from 'react'
import { osrmSteps } from '../api.js'
import Icon from './Icon.jsx'

// Tombol "lihat rute" per leg -> expand instruksi belok-per-belok (OSRM steps).
// Fetch on-demand (hanya saat dibuka) supaya tak membanjiri jaringan di awal.
export default function LegDirections({ from, to, vehicle, travelMin }) {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)

  async function toggle() {
    if (open) { setOpen(false); return }
    setOpen(true)
    if (data || failed || !from || !to) return
    setLoading(true)
    const res = await osrmSteps(from[0], from[1], to[0], to[1], vehicle)
    setLoading(false)
    if (res && res.steps.length) setData(res)
    else setFailed(true)
  }

  if (!from || !to) return null

  return (
    <div className="mt-1">
      <button type="button" onClick={toggle}
        className="inline-flex items-center gap-1 text-[12px] font-medium text-primary hover:underline print:hidden">
        <Icon name="route" size={12} />
        {open ? 'Sembunyikan rute' : 'Lihat rute jalan'}
      </button>

      {open && (
        <div className="mt-1.5 rounded-lg border border-outline-variant bg-surface-gray px-3 py-2 text-[12px]">
          {loading && <span className="text-outline">Memuat rute…</span>}
          {failed && <span className="text-outline">Rute detail tak tersedia (cek peta di atas).</span>}
          {data && (
            <>
              <div className="mb-1.5 font-medium text-on-surface-variant">
                {data.distance_km} km · {data.duration_min} menit
              </div>
              <ol className="m-0 flex list-none flex-col gap-1 p-0">
                {data.steps.map((s, i) => (
                  <li key={i} className="flex items-baseline justify-between gap-3">
                    <span className="text-on-surface-variant">{s.instruction}</span>
                    {s.distance_m > 0 && (
                      <span className="shrink-0 tabular-nums text-outline">
                        {s.distance_m >= 1000
                          ? `${(s.distance_m / 1000).toFixed(1)} km`
                          : `${s.distance_m} m`}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
      )}
    </div>
  )
}
