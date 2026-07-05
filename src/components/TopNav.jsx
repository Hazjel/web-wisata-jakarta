import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useSelection } from '../context/SelectionContext.jsx'

export default function TopNav() {
  const { selected } = useSelection()
  const navigate = useNavigate()

  return (
    <nav className="topnav">
      <Link to="/" className="brand">Jakarta Routes</Link>
      <div className="nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/destinasi">Destinasi</NavLink>
        <NavLink to="/rencana">Perancangan</NavLink>
      </div>
      <button className="nav-cta" onClick={() => navigate('/rencana')}>
        🔍 Rekomendasikan
        {selected.length > 0 && <span className="nav-badge">{selected.length}</span>}
      </button>
    </nav>
  )
}
