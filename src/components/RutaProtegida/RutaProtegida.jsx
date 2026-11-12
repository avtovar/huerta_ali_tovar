import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Cargando from '../Cargando/Cargando'
import Seo from '../Seo/Seo'

// Envuelve rutas privadas.
//  - Sin sesión → redirige a /login (recordando a dónde quería ir).
//  - Con rolesPermitidos (ej. ['admin']) → además exige que el rol del usuario esté en la lista.
function RutaProtegida({ children, rolesPermitidos }) {
  const { usuario, rol, cargando } = useAuth()
  const location = useLocation()

  if (cargando) return <Cargando texto="Verificando sesión..." />

  if (!usuario) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (rolesPermitidos && !rolesPermitidos.includes(rol)) {
    return (
      <div className="page container texto-centrado">
        <Seo titulo="Acceso restringido" />
        <h2>Acceso restringido</h2>
        <p>Tu cuenta no tiene permisos para ver esta sección.</p>
      </div>
    )
  }

  return children
}

export default RutaProtegida
