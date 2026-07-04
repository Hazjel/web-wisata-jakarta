export default function ItineraryResult({ data }) {
  const s = data.summary
  return (
    <div className="itinerary-result">
      <div className="summary">
        <span><b>{s.n_visited}</b>/{s.n_candidates} venue</span>
        <span>total perjalanan <b>{Math.round(s.travel_total_min)} mnt</b></span>
        <span>pelanggaran jam <b>{s.violations}</b></span>
        <span>bolak-balik zona <b>{s.zone_revisit}</b></span>
        <span>algoritma <b>{data.params.algorithm.toUpperCase()}</b></span>
      </div>

      {data.days.map((day) => (
        <div key={day.day_index} className="day-card">
          <h3>Hari {day.day_index} — {day.day_name}</h3>
          <table>
            <tbody>
              {day.visits.map((v, i) => {
                if (v.type === 'break') {
                  return (
                    <tr key={i} className="row-break">
                      <td>{v.start}–{v.depart}</td>
                      <td colSpan="2">🍽️ Istirahat makan siang</td>
                    </tr>
                  )
                }
                if (v.type === 'return') {
                  return (
                    <tr key={i} className="row-return">
                      <td>{v.depart_prev}</td>
                      <td colSpan="2">
                        🏨 Kembali ke hotel (perjalanan {Math.round(v.travel_min)} mnt,
                        tiba {v.arrival})
                      </td>
                    </tr>
                  )
                }
                return (
                  <tr key={i}>
                    <td>{v.start}–{v.depart}</td>
                    <td>
                      <b>{v.name}</b>
                      <small> {v.venue_category}</small>
                      {v.wait_min > 0 &&
                        <small className="wait"> (menunggu buka {Math.round(v.wait_min)} mnt)</small>}
                    </td>
                    <td className="travel">
                      🚗 {Math.round(v.travel_min)} mnt
                      {v.from_hotel ? ' dari hotel' : ''}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ))}

      {data.not_fitted.length > 0 && (
        <div className="not-fitted">
          <b>Tidak termuat dalam {data.days.length} hari:</b>{' '}
          {data.not_fitted.map((v) => v.name).join(', ')}
        </div>
      )}
    </div>
  )
}
