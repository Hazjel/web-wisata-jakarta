import Icon from './Icon.jsx'

// Timeline vertikal per hari — motif "garis rute" (identitas visual situs).
// Bahasa murni untuk turis: tanpa istilah teknis optimasi.

function fmtJam(mnt) {
  const jam = mnt / 60
  return jam >= 1 ? `${Math.round(jam * 10) / 10} jam` : `${Math.round(mnt)} menit`
}

export default function ItineraryResult({ data }) {
  const s = data.summary

  return (
    <div className="itinerary-result">
      <div className="trip-summary">
        <span><Icon name="pin" size={15} /> <b>{s.n_visited}</b> destinasi</span>
        <span><Icon name="clock" size={15} /> <b>{data.days.length}</b> hari</span>
        <span><Icon name="route" size={15} /> total perjalanan <b>{fmtJam(s.travel_total_min)}</b></span>
        <span className="trip-summary-note">sudah termasuk jeda makan siang</span>
      </div>

      {data.days.map((day) => {
        let no = 0
        return (
          <section key={day.day_index} className="tl-day">
            <h3 className="tl-day-title">
              Hari {day.day_index} <span>— {day.day_name}</span>
            </h3>
            <ol className="tl">
              {day.visits.map((v, i) => {
                if (v.type === 'break') {
                  return (
                    <li key={i} className="tl-item tl-break">
                      <span className="tl-time">{v.start}–{v.depart}</span>
                      <span className="tl-node"><Icon name="clock" size={14} /></span>
                      <div className="tl-body">
                        <b>Istirahat makan siang</b>
                        <small>±60 menit — cari kuliner di sekitar lokasi</small>
                      </div>
                    </li>
                  )
                }
                if (v.type === 'return') {
                  return (
                    <li key={i} className="tl-item tl-return">
                      <span className="tl-time">{v.arrival}</span>
                      <span className="tl-node tl-node-end"><Icon name="pin" size={14} /></span>
                      <div className="tl-body">
                        <b>Kembali ke hotel</b>
                        <small>perjalanan {Math.round(v.travel_min)} menit</small>
                      </div>
                    </li>
                  )
                }
                no += 1
                return (
                  <li key={i} className="tl-item">
                    <span className="tl-time">{v.start}–{v.depart}</span>
                    <span className="tl-node tl-node-num">{no}</span>
                    <div className="tl-body">
                      <span className="tl-leg">
                        {Math.round(v.travel_min)} menit dari {v.from_hotel ? 'hotel' : 'lokasi sebelumnya'}
                        {v.wait_min > 0 && ` · menunggu buka ${Math.round(v.wait_min)} menit`}
                      </span>
                      <b>{v.name}</b>
                      <span className="venue-tag">{v.venue_category}</span>
                    </div>
                  </li>
                )
              })}
            </ol>
          </section>
        )
      })}

      {data.not_fitted.length > 0 && (
        <div className="not-fitted">
          <b>Tidak termuat dalam {data.days.length} hari:</b>{' '}
          {data.not_fitted.map((v) => v.name).join(', ')}.
          <small> Tambah jumlah hari untuk memuat semuanya.</small>
        </div>
      )}
    </div>
  )
}
