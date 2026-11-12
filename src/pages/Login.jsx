import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaSignInAlt } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { mensajeError } from '../utils/errores'
import Seo from '../components/Seo/Seo'
import './Auth.css'

function Login() {
  const { login, usuario } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const destino = location.state?.from || '/'
  // ↑ Si venía de una ruta protegida (ej. /panel), vuelve ahí después de loguearse

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Completá tu email y tu contraseña.')
      return
    }
    setEnviando(true)
    try {
      await login(email.trim(), password)
      toast.success('¡Bienvenido/a!')
      navigate(destino, { replace: true })
    } catch (err) {
      console.error('Error en el login:', err.code)
      setError(mensajeError(err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="page container">
      <Seo titulo="Iniciar sesión" descripcion="Ingresá a tu cuenta de La Huerta de Ali." />
      <div className="auth-card">
        <h2>Iniciar sesión</h2>
        {usuario && <p className="auth-aviso">Ya iniciaste sesión como {usuario.email}.</p>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grupo">
            <label htmlFor="email">Correo electrónico</label>
            <input id="email" type="email" value={email} autoComplete="email"
              onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" />
          </div>
          <div className="form-grupo">
            <label htmlFor="password">Contraseña</label>
            <input id="password" type="password" value={password} autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)} placeholder="Tu contraseña" />
          </div>
          {error && <p className="mensaje mensaje-error" role="alert">{error}</p>}
          <button type="submit" className="btn btn-primary auth-boton" disabled={enviando}>
            <FaSignInAlt aria-hidden="true" /> {enviando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
        <p className="auth-pie">¿No tenés una cuenta? <Link to="/registro">Registrate aquí</Link></p>
      </div>
    </div>
  )
}

export default Login
