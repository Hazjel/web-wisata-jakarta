// Basemap bersama untuk semua peta Leaflet (tile standar OpenStreetMap, tanpa API key).
// Atribusi wajib menurut kebijakan pemakaian tile OSM.
export const TILE_LAYER = {
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
}
