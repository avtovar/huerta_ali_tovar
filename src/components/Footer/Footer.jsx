import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { firebaseConfigurado } from '../../firebase/config'
import { obtenerEquipo } from '../../services/equipoService'
import './Footer.css'

const TeamCard = styled.article`
  background-color: var(--color-card);
  border-radius: var(--radius-md);
  padding: 24px;
  text-align: center;
  box-shadow: var(--shadow-soft);
`

const equipoRespaldo = [
  {
    nombre: 'Ali Tovar',
    rol: 'Fundador',
    frase: 'Verduras frescas todos los días.',
    inicial: 'A',
  },
  {
    nombre: 'Aniceto Rondón',
    rol: 'Administrador',
    frase: 'Siempre en tu hogar.',
    inicial: 'A',
  },
  {
    nombre: 'Alicia Tovar',
    rol: 'Gerente',
    frase: 'De la siembra a su mesa.',
    inicial: 'A',
  },
]

function Footer() {
  const [equipo, setEquipo] = useState(equipoRespaldo)
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const anio = new Date().getFullYear()

  useEffect(() => {
    if (!firebaseConfigurado) return undefined

    let activo = true
    obtenerEquipo()
      .then((personas) => {
        if (activo && personas.length > 0) setEquipo(personas)
      })
      .catch((error) => {
        console.error('No se pudo cargar el equipo de Firestore:', error)
      })

    return () => { activo = false }
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!email) return
    setEnviado(true)
    setEmail('')
  }

  return (
    <footer className="footer">
      <div className="container footer-top">
        <div className="footer-col">
          <h3>La Huerta de Ali</h3>
          <p className="footer-slogan">Somos los mejores en calidad y productos frescos.</p>
          <p>📍 Sede: Av. Siempre Verde 1234, Buenos Aires</p>
          <p>📧 huertaali@gmail.com</p>
          <p>📱 +54 9 12345678</p>
          <p>📷 @huertaali</p>
        </div>

        <div className="footer-col">
          <h3>Legales</h3>
          <ul className="footer-links">
            <li><a href="#privacidad">Políticas de privacidad</a></li>
            <li><a href="#terminos">Términos y condiciones</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
          <p className="footer-copy">© {anio} La Huerta de Ali. Todos los derechos reservados.</p>
        </div>

        <div className="footer-col">
          <h3>Newsletter</h3>
          <p>Recibí ofertas y novedades de temporada.</p>
          {enviado ? (
            <p className="footer-newsletter-ok">¡Gracias por suscribirte! 🌱</p>
          ) : (
            <form className="footer-newsletter" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                aria-label="Correo electrónico para el newsletter"
              />
              <button type="submit" className="btn btn-secondary">Suscribirme</button>
            </form>
          )}
        </div>
      </div>

      <div className="container footer-team">
        <h3>Nuestro equipo</h3>
        <div className="team-grid">
          {equipo.map((persona) => (
            <TeamCard className="team-card" key={persona.id || persona.nombre}>
              <div className="team-avatar">{persona.inicial}</div>
              <h4>{persona.nombre}</h4>
              <span className="team-rol">{persona.rol}</span>
              <p>{persona.frase}</p>
            </TeamCard>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer
