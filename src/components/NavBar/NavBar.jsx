import { NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaUser, FaSignInAlt, FaSignOutAlt, FaTools } from 'react-icons/fa'
import CartWidget from '../CartWidget/CartWidget'
import { useAuth } from '../../context/AuthContext'
import './NavBar.css'

function NavBar() {
  const { usuario, esAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const linkClass = ({ isActive }) => 'nav-link' + (isActive ? ' nav-link-active' : '')

  const handleLogout = async () => {
    await logout()
    toast.info('Sesión cerrada')
    navigate('/')
  }

  return (
    <nav className="navbar" aria-label="Navegación principal">
      <div className="container navbar-inner">
        <ul className="nav-links">
          <li><NavLink to="/" end className={linkClass}>Inicio</NavLink></li>
          <li><NavLink to="/productos" className={linkClass}>Productos</NavLink></li>
          {esAdmin && (
            <li>
              <NavLink to="/panel" className={linkClass}><FaTools aria-hidden="true" /> Panel</NavLink>
            </li>
          )}
        </ul>
        <div className="nav-usuario">
          {usuario ? (
            <>
              <NavLink to="/perfil" className={linkClass}>
                <FaUser aria-hidden="true" /> <span className="nav-nombre">{usuario.displayName || 'Mi perfil'}</span>
              </NavLink>
              <button type="button" className="nav-boton" onClick={handleLogout} aria-label="Cerrar sesión">
                <FaSignOutAlt aria-hidden="true" /> <span className="nav-nombre">Salir</span>
              </button>
            </>
          ) : (
            <NavLink to="/login" className={linkClass}>
              <FaSignInAlt aria-hidden="true" /> Ingresar
            </NavLink>
          )}
          <CartWidget />
        </div>
      </div>
    </nav>
  )
}

export default NavBar
