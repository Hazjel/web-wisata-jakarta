# Web Wisata Jakarta — Itinerary Multi-Hari

Frontend (Vite + React) untuk [sistem-rekomendasi-destinasi-wisata-jakarta](https://github.com/Hazjel/sistem-rekomendasi-destinasi-wisata-jakarta) —
riset HUMIC: rekomendasi itinerary wisata Jakarta multi-hari berbasis
**Content-Based Filtering (TF-IDF + MMR) + optimasi rute GA / PSO / GA-PSO Hybrid / GWO-TS**.

## Fitur

- **Mode otomatis** — turis isi preferensi teks (mis. "museum sejarah budaya"),
  budget, jumlah hari, hotel → sistem pilih kandidat venue (CBF) dan susun
  itinerary optimal per hari
- **Mode manual** (ala go-routes.com) — turis centang sendiri venue dari 166
  destinasi → sistem susun urutan & pembagian hari
- Itinerary per hari: jam kunjungan, waktu perjalanan antar venue, istirahat
  makan siang otomatis, jam kembali ke hotel — dijamin tanpa pelanggaran jam
  buka & tanpa rute bolak-balik zona
- Peta interaktif (react-leaflet): rute jalan asli (OSRM), segmen akses venue
  putus-putus, warna beda per hari
- Pilihan algoritma: GWO-TS (default, auto) / GA / PSO / Hybrid — untuk demo perbandingan

## Prasyarat

**Backend harus jalan dulu** (repo [sistem-rekomendasi-destinasi-wisata-jakarta](https://github.com/Hazjel/sistem-rekomendasi-destinasi-wisata-jakarta)):

```powershell
cd sistem-rekomendasi-destinasi-wisata-jakarta
.\venv\Scripts\Activate.ps1
uvicorn src.api.api:app --reload   # port 8000
```

## Jalankan

```powershell
npm install
npm run dev        # buka http://localhost:5173
```

Request `/api/*` di-proxy ke `http://localhost:8000` (lihat `vite.config.js`).

## Kontrak API

| Endpoint | Keterangan |
|----------|-----------|
| `GET /venues` | 166 venue: `venue_id, name, venue_category, zone_id, google_rating, price_level, latitude, longitude` |
| `GET /hotels` | 181 hotel: `hotel_id, name, google_rating, latitude, longitude` |
| `POST /itinerary` | susun itinerary |

Contoh body `POST /itinerary`:

```json
{
  "preference_text": "museum sejarah budaya",
  "budget": "menengah",
  "n_days": 2,
  "start_day": "Sabtu",
  "hotel_id": 0,
  "venue_ids": null
}
```

- `venue_ids: null` → mode otomatis (kandidat dari CBF, `preference_text` wajib)
- `venue_ids: ["6", "328", ...]` → mode manual (`preference_text` opsional)
- `algorithm` (opsional, default `auto`): backend pilih otomatis berdasar hasil
  eksperimen riset — **Hybrid** untuk 1–3 hari, **GA** untuk 4–5 hari. Nilai
  eksplisit `ga`/`pso`/`hybrid` tetap didukung untuk keperluan riset.

Response: `hotel`, `params`, `summary` (fitness, n_visited, travel_total_min,
violations, …), `days[].visits[]` (type `visit`/`break`/`return`, jam, koordinat),
`not_fitted[]` (venue pilihan yang tidak termuat).

## Struktur

```
src/
  api.js                       — client API + fetch geometri OSRM
  App.jsx                      — layout form kiri / hasil+peta kanan
  components/TripForm.jsx      — form input + toggle mode otomatis/manual
  components/VenuePicker.jsx   — checkbox 166 venue (search + filter kategori)
  components/ItineraryResult.jsx — kartu itinerary per hari
  components/ItineraryMap.jsx  — peta react-leaflet + rute OSRM
```
