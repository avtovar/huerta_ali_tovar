import { NavLink, useNavigate } from 'react-router-dom'
// ↑ NavLink: componente de React Router que renderiza un <a> con estilos automáticos.
//    A diferencia de <Link>, NavLink agrega la clase "activo" automáticamente cuando
//    la ruta actual coincide con el `to`. Ideal para menús de navegación.

import { toast } from 'react-toastify'
// ↑ toast: función para mostrar un mensaje emergente (toast) en la esquina inferior derecha.
//    Se usa para feedback usuario: "Sesión cerrada", "Cuenta creada", etc.
//    Se auto-cierra después de unos segundos.

import { FaUser, FaSignInAlt, FaSignOutAlt, FaTools, FaTags } from 'react-icons/fa'
// ↑ importar iconos de Font Awesome (react-icons/fa).
//    Se usan para darle un significado visual a los botones/links (seta = usuario,
//    herramientas = panel, etiquetas = cupones, etc.
//    aria-hidden="true" porque el texto descriptivo ya está en el <span> siguiente.

import CartWidget from '../CartWidget/CartWidget'
// ↑ CartWidget: componente pequeño que muestra un carrito con contador de productos.
//    Se incluye siempre en la navbar, tanto si el usuario está logueado como no.

import { useAuth } from '../../context/AuthContext'
// ↑ useAuth: hook personalizado que lee el contexto de Auth (usuario, rol, login, logout).
//    Desestructuramos usuario, esAdmin y la función logout.

import './NavBar.css'
// ↑ Estilos propios de la navbar.
//    Usa Flexbox para el layout, clases .navbar-inner, .nav-links, .nav-usuario.
//    La responsividad (cómo se apilan los links en móvil) está en este CSS.

function NavBar() {
  // ↑ Componente de navegación principal que muestra links, botones de usuario y el carrito.
  //    Se incluye en Layout.jsx por lo que aparece en TODAS las páginas.
  const { usuario, esAdmin, logout } = useAuth()
  // ↑ usuario: objeto de sesión de Firebase (null si nadie está logueado).
  //    Tiene propiedades: uid, email, displayName, etc.
  //    Si es null, mostramos links de "Ingresar/Registrarse".
  // ↓ esAdmin: booleano que indica si el usuario tiene rol 'admin'.
  //    Se lee del documento 'usuarios/{uid}' en Firestore. Si es true, muestra enlaces
  //    extra de "Panel" y "Cupones".
  // ↓ logout: función para cerrar la sesión (signOut de Firebase).

  const navigate = useNavigate()
  // ↑ useNavigate: hook de React Router para programar navegación imperativa.
  //    Ejemplo: navigate('/login') o navigate('/', { replace: true }).

  const handleLogout = async () => {
    // ↑ Función que se ejecuta al hacer clic en "Cerrar sesión".
    await logout()
    //    Cierra la sesión en Firebase Auth y establece usuario = null en el contexto.
    toast.info('Sesión cerrada')
    //    Muestra un toast de confirmación breve.
    navigate('/')
    //    Redirige a la página de inicio. Usamos navigation imperativa.
  }

  const linkClass = ({ isActive }) => 'nav-link' + (isActive ? ' nav-link-active' : '')
  // ↑ función auxiliar que genera la clase CSS para cada link.
  //    Si el link está activo (estamos en esa ruta), agrega 'nav-link-active' para
  //    resaltar visualmente el menú actual.

  return (
    <nav className="navbar" aria-label="Navegación principal">
      <div className="container navbar-inner">
        <ul className="nav-links">
          <li><NavLink to="/" end className={linkClass}>Inicio</NavLink></li>
          <li><NavLink to="/productos" className={linkClass}>Productos</NavLink></li>
          {esAdmin && (
            <>
              <li><NavLink to="/panel" className={linkClass}><FaTools aria-hidden="true" /> Panel</NavLink></li>
              <li><NavLink to="/admin/cupones" className={linkClass}><FaTags aria-hidden="true" /> Cupones</NavLink></li>
            </>
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
// ↑ Exportamos el componente para usarlo en Layout.jsx.
//    La navbar es parte del "esqueleto" común de todas las páginas.
