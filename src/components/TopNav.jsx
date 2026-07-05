import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useSelection } from '../context/SelectionContext.jsx'
import Icon from './Icon.jsx'

const navLink = ({ isActive }) =>
  `pb-1 border-b-[3px] text-[15px] transition-colors hover:text-secondary ${
    isActive
      ? 'text-primary font-semibold border-secondary-container'
      : 'text-on-surface-variant border-transparent'
  }`

export default function TopNav() {
  const { selected } = useSelection()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-[1100] bg-white/85 backdrop-blur-md border-b border-border-subtle">
      <div className="flex items-center gap-2 md:gap-6 h-14 md:h-16 px-4 md:px-10">
        <Link to="/" onClick={() => setOpen(false)}
          className="inline-flex items-center gap-2 font-head text-lg md:text-xl font-bold text-primary no-underline">
          <Icon name="route" size={20} strokeWidth={2} /> Jakarta Routes
        </Link>

        <div className="hidden md:flex gap-6 flex-1">
          <NavLink to="/" end className={navLink}>Home</NavLink>
          <NavLink to="/destinasi" className={navLink}>Destinasi</NavLink>
          <NavLink to="/rencana" className={navLink}>Perancangan</NavLink>
        </div>

        <button
          onClick={() => { setOpen(false); navigate('/rencana') }}
          className="ml-auto md:ml-0 inline-flex items-center gap-1.5 px-3 py-2.5 md:px-4 md:py-2 rounded-lg
                     bg-secondary-container text-white text-sm font-bold cursor-pointer
                     hover:brightness-105 transition">
          <Icon name="route" size={16} strokeWidth={2} />
          <span className="hidden md:inline">Susun Rute</span>
          {selected.length > 0 && (
            <span className="bg-white text-secondary rounded-full px-2 text-xs font-bold">
              {selected.length}
            </span>
          )}
        </button>

        <button aria-label="Menu" onClick={() => setOpen(!open)}
          className="md:hidden p-2.5 text-primary cursor-pointer">
          <Icon name={open ? 'close' : 'menu'} size={22} strokeWidth={2} />
        </button>
      </div>

      {open && (
        <div className="md:hidden flex flex-col border-t border-border-subtle bg-white"
          onClick={() => setOpen(false)}>
          {[['/', 'Home', true], ['/destinasi', 'Destinasi'], ['/rencana', 'Perancangan']]
            .map(([to, label, end]) => (
              <NavLink key={to} to={to} end={end}
                className={({ isActive }) =>
                  `px-4 py-3.5 text-[15px] border-b border-border-subtle no-underline ${
                    isActive ? 'text-primary font-bold' : 'text-on-surface-variant'
                  }`}>
                {label}
              </NavLink>
            ))}
        </div>
      )}
    </nav>
  )
}
