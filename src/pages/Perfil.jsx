import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaSignOutAlt, FaTools } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import Seo from '../components/Seo/Seo'
import './Auth.css'

function Perfil() {
  const { usuario, rol, esAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    toast.info('Sesión cerrada')
    navigate('/')
  }

  return (
    <div className="page container">
      <Seo titulo="Mi perfil" />
      <div className="auth-card">
        <h2>¡Hola de nuevo, {usuario.displayName || usuario.email}!</h2>
        <p>Email: <strong>{usuario.email}</strong></p>
        <p>Tipo de cuenta: <strong>{rol === 'admin' ? 'Administrador' : 'Cliente'}</strong></p>
        <div className="auth-acciones">
          {esAdmin && (
            <Link to="/panel" className="btn btn-secondary"><FaTools aria-hidden="true" /> Ir al panel</Link>
          )}
          <button type="button" className="btn btn-outline" onClick={handleLogout}>
            <FaSignOutAlt aria-hidden="true" /> Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  )
}

export default Perfil
