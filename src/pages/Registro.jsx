import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaUserPlus } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { mensajeError } from '../utils/errores'
import Seo from '../components/Seo/Seo'
import './Auth.css'

function Registro() {
  const { registro } = useAuth()
  const navigate = useNavigate()

  const [datos, setDatos] = useState({ nombre: '', email: '', password: '', repetir: '' })
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const handleChange = (e) => setDatos({ ...datos, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    // Validaciones del lado del cliente
    if (datos.nombre.trim().length < 2) return setError('Ingresá tu nombre.')
    if (!/^\S+@\S+\.\S+$/.test(datos.email.trim())) return setError('Ingresá un email válido.')
    if (datos.password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.')
    if (datos.password !== datos.repetir) return setError('Las contraseñas no coinciden.')

    setEnviando(true)
    try {
      await registro(datos.nombre.trim(), datos.email.trim(), datos.password)
      toast.success('¡Cuenta creada con éxito!')
      navigate('/', { replace: true })
    } catch (err) {
      console.error('Error en el registro:', err.code)
      setError(mensajeError(err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="page container">
      <Seo titulo="Crear cuenta" descripcion="Registrate en La Huerta de Ali." />
      <div className="auth-card">
        <h2>Crear una cuenta</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grupo">
            <label htmlFor="nombre">Nombre</label>
            <input id="nombre" name="nombre" value={datos.nombre} onChange={handleChange} autoComplete="name" />
          </div>
          <div className="form-grupo">
            <label htmlFor="email">Correo electrónico</label>
            <input id="email" name="email" type="email" value={datos.email} onChange={handleChange} autoComplete="email" />
          </div>
          <div className="form-grupo">
            <label htmlFor="password">Contraseña</label>
            <input id="password" name="password" type="password" value={datos.password}
              onChange={handleChange} placeholder="Mínimo 6 caracteres" autoComplete="new-password" />
          </div>
          <div className="form-grupo">
            <label htmlFor="repetir">Repetir contraseña</label>
            <input id="repetir" name="repetir" type="password" value={datos.repetir}
              onChange={handleChange} autoComplete="new-password" />
          </div>
          {error && (
            <p className="mensaje mensaje-error" role="alert">
              {error}{' '}
              {error.startsWith('Ya existe') && <Link to="/login">Iniciar sesión</Link>}
            </p>
          )}
          <button type="submit" className="btn btn-primary auth-boton" disabled={enviando}>
            <FaUserPlus aria-hidden="true" /> {enviando ? 'Creando cuenta...' : 'Registrarme'}
          </button>
        </form>
        <p className="auth-pie">¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link></p>
      </div>
    </div>
  )
}

export default Registro
