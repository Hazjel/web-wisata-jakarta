import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelection } from '../context/SelectionContext.jsx'
import { groupOf } from '../lib/categories.js'
import Icon from './Icon.jsx'

export default function SelectionPanel({ venues }) {
  const { selected, toggle, clear } = useSelection()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false) // bottom-sheet mobile
  const items = venues.filter((v) => selected.includes(String(v.venue_id)))

  const list = (
    <div className="flex max-h-[330px] flex-col gap-2 overflow-y-auto">
      {items.map((v) => {
        const g = groupOf(v.venue_category)
        return (
          <div key={v.venue_id}
            className="flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-gray p-2">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded border border-border-subtle bg-surface-gray"
              style={{ color: g.tint }}>
              <Icon name={g.icon} size={22} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <b className="truncate text-[13px]">{v.name}</b>
              <small className="text-[11px] text-outline">
                ±{Math.round((v.time_spent_minutes || 60) / 60 * 10) / 10} jam kunjungan
              </small>
            </span>
            <button title="Hapus" onClick={() => toggle(v.venue_id)}
              className="flex cursor-pointer p-1 text-outline hover:text-error">
              <Icon name="close" size={15} />
            </button>
          </div>
        )
      })}
      <div className="flex items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-outline-variant p-4 text-xs text-outline">
        <Icon name="plus" size={15} /> Tambahkan destinasi dari daftar
      </div>
    </div>
  )

  const cta = (
    <button disabled={items.length < 2}
      onClick={() => navigate('/rencana?mode=manual')}
      className="w-full cursor-pointer rounded-lg bg-primary p-3 text-sm font-bold text-white
                 transition hover:bg-primary-container disabled:cursor-not-allowed disabled:bg-outline-variant">
      Susun Rute dari {items.length} destinasi →
    </button>
  )

  return (
    <>
      {/* panel sticky — desktop/tablet */}
      <div className="hidden md:block sticky top-[88px] rounded-xl border border-border-subtle bg-white p-6 shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
        <h3 className="mb-0.5 text-xl">Destinasi Terpilih</h3>
        <p className="mb-4 text-xs font-semibold tracking-wide text-on-surface-variant">
          {items.length === 0 ? 'Belum ada destinasi'
            : `${items.length} destinasi ditambahkan`}
        </p>
        {list}
        <div className="mt-4">{cta}</div>
        {items.length > 0 && (
          <button onClick={clear}
            className="mt-2 w-full cursor-pointer p-1.5 text-xs text-outline underline">
            Kosongkan pilihan
          </button>
        )}
      </div>

      {/* bottom bar + sheet — mobile */}
      <div className="fixed inset-x-0 bottom-0 z-[1200] block border-t border-border-subtle bg-white shadow-[0_-6px_20px_rgba(0,0,0,0.08)] md:hidden print:hidden">
        {open && (
          <div className="max-h-[46vh] overflow-y-auto border-b border-border-subtle p-4">
            <div className="mb-2 flex items-center justify-between">
              <b>Destinasi Terpilih</b>
              {items.length > 0 && (
                <button onClick={clear}
                  className="cursor-pointer text-xs text-outline underline">Kosongkan</button>
              )}
            </div>
            {list}
          </div>
        )}
        <div className="flex items-center gap-2 px-4 py-2.5">
          <button onClick={() => setOpen(!open)}
            className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap p-1.5 text-sm font-semibold text-on-surface-variant">
            <span className="rounded-full bg-primary px-2 text-xs font-bold text-white">
              {items.length}
            </span>
            destinasi
            <Icon name={open ? 'chevronDown' : 'chevronUp'} size={16} />
          </button>
          <div className="flex-1">{cta}</div>
        </div>
      </div>
    </>
  )
}
