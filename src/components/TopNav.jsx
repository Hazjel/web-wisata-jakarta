import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useSelection } from '../context/SelectionContext.jsx'
import Icon from './Icon.jsx'

export default function TopNav() {
  const { selected } = useSelection()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <nav className="topnav">
      <div className="topnav-row">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <Icon name="route" size={20} strokeWidth={2} /> Jakarta Routes
        </Link>

        <div className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/destinasi">Destinasi</NavLink>
          <NavLink to="/rencana">Perancangan</NavLink>
        </div>

        <button className="nav-cta" onClick={() => { setOpen(false); navigate('/rencana') }}>
          <Icon name="route" size={16} strokeWidth={2} />
          <span className="nav-cta-label">Susun Rute</span>
          {selected.length > 0 && <span className="nav-badge">{selected.length}</span>}
        </button>

        <button className="nav-burger" aria-label="Menu"
          onClick={() => setOpen(!open)}>
          <Icon name={open ? 'close' : 'menu'} size={22} strokeWidth={2} />
        </button>
      </div>

      {open && (
        <div className="nav-drawer" onClick={() => setOpen(false)}>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/destinasi">Destinasi</NavLink>
          <NavLink to="/rencana">Perancangan</NavLink>
        </div>
      )}
    </nav>
  )
}
