
import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { CalendarDays, Menu, X, LogOut } from 'lucide-react'
import '../css/Navbar.css'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const token = localStorage.getItem('token')

  let user = null

  try {
    user = JSON.parse(localStorage.getItem('user'))
  } catch {
    user = null
  }

  const isLoggedIn = Boolean(token && user)
  
  const dashboardRoutes = {
    PARTICIPANT: '/participant/dashboard',
    ORGANIZER: '/organizer/dashboard',
    ADMIN: '/admin/dashboard',
  }

  const dashboardRoute = dashboardRoutes[user?.role]

  const closeMenu = () => {
    setMenuOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    closeMenu()
    navigate('/')
    window.location.reload()
  }

  return (
    <header className="navbar">
      <Link to="/" className="navbar-logo" onClick={closeMenu}>
        <CalendarDays size={28} />
        <span>EventSphere</span>
      </Link>

      <nav className="navbar-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/events">Explore Events</NavLink>
        <a href="/#about">About</a>
      </nav>

      <div className="navbar-actions">
        {isLoggedIn && dashboardRoute ? (
          <>
            <Link to={dashboardRoute} className="login-link">
              Dashboard
            </Link>

            <button
              type="button"
              className="register-button"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-link">
              Login
            </Link>

            <Link to="/register" className="register-button">
              Get Started
            </Link>
          </>
        )}
      </div>

      <button
        className="mobile-menu"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={25} /> : <Menu size={25} />}
      </button>

      <div className={`mobile-nav ${menuOpen ? 'active' : ''}`}>
        <NavLink to="/" end onClick={closeMenu}>
          Home
        </NavLink>

        <NavLink to="/events" onClick={closeMenu}>
          Explore Events
        </NavLink>

        <a href="/#about" onClick={closeMenu}>
          About
        </a>

        {isLoggedIn && dashboardRoute ? (
          <>
            <Link to={dashboardRoute} onClick={closeMenu}>
              Dashboard
            </Link>

            <button
              type="button"
              className="mobile-register-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={closeMenu}>
              Login
            </Link>

            <Link
              to="/register"
              className="mobile-register-button"
              onClick={closeMenu}
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

export default Navbar
