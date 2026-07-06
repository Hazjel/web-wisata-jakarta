import Icon from './Icon.jsx'

// Timeline vertikal per hari — motif "garis rute" (garis dashed di App.css).
// Bahasa murni untuk turis: tanpa istilah teknis optimasi.

function fmtJam(mnt) {
  const jam = mnt / 60
  return jam >= 1 ? `${Math.round(jam * 10) / 10} jam` : `${Math.round(mnt)} menit`
}

const tag = 'mt-1 self-start rounded-full bg-tertiary-fixed px-2 py-px text-[11px] font-medium text-tertiary-container'

export default function ItineraryResult({ data }) {
  const s = data.summary

  return (
    <div className="flex flex-col gap-6">
      <div className="trip-summary flex flex-wrap items-center gap-4 md:gap-6 rounded-xl bg-primary px-6 py-4 text-[13px] md:text-sm text-white [&_b]:text-gold">
        <span className="inline-flex items-center gap-1.5">
          <Icon name="pin" size={15} /> <b>{s.n_visited}</b> destinasi</span>
        <span className="inline-flex items-center gap-1.5">
          <Icon name="clock" size={15} /> <b>{data.days.length}</b> hari</span>
        <span className="inline-flex items-center gap-1.5">
          <Icon name="route" size={15} /> total perjalanan <b>{fmtJam(s.travel_total_min)}</b>
          {data.params?.vehicle_label && ` (${data.params.vehicle_label})`}</span>
        <span className="w-full md:ml-auto md:w-auto text-xs opacity-75">
          sudah termasuk jeda makan siang</span>
      </div>

      {data.days.map((day) => {
        let no = 0
        return (
          <section key={day.day_index} className="tl-day">
            <h3 className="mb-4 text-[22px]">
              Hari {day.day_index} <span className="font-semibold text-outline">— {day.day_name}</span>
            </h3>
            <ol className="m-0 flex list-none flex-col p-0">
              {day.visits.map((v, i) => {
                const node = (extra, content) => (
                  <span className={`tl-node relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ring-4 ring-white ${extra}`}>
                    {content}
                  </span>
                )
                if (v.type === 'break') {
                  return (
                    <li key={i} className="tl-item">
                      <span className="tl-time">{v.start}–{v.depart}</span>
                      {node('bg-secondary-container', <Icon name="clock" size={14} />)}
                      <div className="flex flex-col gap-0.5 pt-0.5">
                        <b className="text-base leading-tight text-secondary">Istirahat makan siang</b>
                        <small className="text-[12.5px] text-outline">±60 menit — cari kuliner di sekitar lokasi</small>
                      </div>
                    </li>
                  )
                }
                if (v.type === 'return') {
                  return (
                    <li key={i} className="tl-item">
                      <span className="tl-time">{v.arrival}</span>
                      {node('bg-night', <Icon name="pin" size={14} />)}
                      <div className="flex flex-col gap-0.5 pt-0.5">
                        <b className="text-base font-semibold leading-tight text-on-surface-variant">Kembali ke hotel</b>
                        <small className="text-[12.5px] text-outline">perjalanan {Math.round(v.travel_min)} menit</small>
                      </div>
                    </li>
                  )
                }
                no += 1
                return (
                  <li key={i} className="tl-item">
                    <span className="tl-time">{v.start}–{v.depart}</span>
                    {node('bg-primary', no)}
                    <div className="flex flex-col gap-0.5 pt-0.5">
                      <span className="text-[12.5px] text-outline">
                        {Math.round(v.travel_min)} menit dari {v.from_hotel ? 'hotel' : 'lokasi sebelumnya'}
                        {v.wait_min > 0 && ` · menunggu buka ${Math.round(v.wait_min)} menit`}
                      </span>
                      <b className="text-base leading-tight">{v.name}</b>
                      <span className={tag}>{v.venue_category}</span>
                    </div>
                  </li>
                )
              })}
            </ol>
          </section>
        )
      })}

      {data.not_fitted.length > 0 && (
        <div className="rounded-xl bg-error-container px-6 py-4 text-[13px] text-on-error-container">
          <b>Tidak termuat dalam {data.days.length} hari:</b>{' '}
          {data.not_fitted.map((v) => v.name).join(', ')}.
          <small className="print:hidden"> Tambah jumlah hari untuk memuat semuanya.</small>
        </div>
      )}
    </div>
  )
}
