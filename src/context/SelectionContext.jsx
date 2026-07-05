import { createContext, useContext, useEffect, useState } from 'react'

// Venue terpilih (mode manual) — dibagikan Home <-> Detail <-> Perancangan,
// persist di localStorage supaya tahan refresh.
const SelectionContext = createContext(null)

export function SelectionProvider({ children }) {
  const [selected, setSelected] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('selectedVenues')) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('selectedVenues', JSON.stringify(selected))
  }, [selected])

  function toggle(id) {
    const sid = String(id)
    setSelected((cur) =>
      cur.includes(sid) ? cur.filter((x) => x !== sid) : [...cur, sid])
  }
  const clear = () => setSelected([])

  return (
    <SelectionContext.Provider value={{ selected, toggle, clear, setSelected }}>
      {children}
    </SelectionContext.Provider>
  )
}

export function useSelection() {
  return useContext(SelectionContext)
}
