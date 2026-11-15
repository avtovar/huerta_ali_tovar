import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { firebaseConfigurado } from '../../firebase/config'
import { obtenerEquipo } from '../../services/equipoService'
// ↑ useState: estado local del formulario de newsletter

import './Footer.css'
// ↑ Estilos propios del pie de página

const TeamCard = styled.article`
  background-color: var(--color-card);
  border-radius: var(--radius-md);
  padding: 24px;
  text-align: center;
  box-shadow: var(--shadow-soft);
`

const equipoRespaldo = [
  // ↑ Array de datos del equipo; no es estado, es información fija que se recorre con .map()
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
  // ↑ email: lo que el usuario escribe en el input del newsletter
  // ↑ setEmail: actualiza ese valor en cada tecla que se escribe

  const [enviado, setEnviado] = useState(false)
  // ↑ enviado: true después de "suscribirse" → mostramos el mensaje de gracias

  const handleSubmit = (e) => {
    // ↑ Función que corre al enviar el formulario
    e.preventDefault()
    // ↑ Evita que la página se recargue (comportamiento por defecto de los formularios)
    if (!email) return
    // ↑ Si no hay email, no hacemos nada
    setEnviado(true)
    // ↑ Marcamos que ya se "suscribió" → en pantalla aparece el mensaje de éxito
    setEmail('')
    // ↑ Limpiamos el input
  }

  const anio = new Date().getFullYear()
  // ↑ Año actual automático para el copyright (así no queda desactualizado)

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

  return (
    <footer className="footer">
      {/* ↑ Etiqueta semántica de pie de página */}
      <div className="container footer-top">
        {/* ↑ Contenedor con las 3 columnas: contacto, legales y newsletter */}

        <div className="footer-col">
          {/* ↑ Columna 1: datos del emprendimiento */}
          <h3>La Huerta de Ali</h3>
          <p className="footer-slogan">Somos los mejores en calidad y productos frescos.</p>
          <p>📍 Sede: Av. Siempre Verde 1234, Buenos Aires</p>
          <p>📧 huertaali@gmail.com</p>
          <p>📱 +54 9 12345678</p>
          <p>📷 @huertaali</p>
        </div>

        <div className="footer-col">
          {/* ↑ Columna 2: links legales (por ahora son anclas, no páginas reales) */}
          <h3>Legales</h3>
          <ul className="footer-links">
            <li><a href="#privacidad">Políticas de privacidad</a></li>
            <li><a href="#terminos">Términos y condiciones</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
          <p className="footer-copy">© {anio} La Huerta de Ali. Todos los derechos reservados.</p>
          {/* ↑ {anio} imprime dentro del texto el año calculado arriba */}
        </div>

        <div className="footer-col">
          {/* ↑ Columna 3: newsletter SIMULADO (no envía datos a ningún servidor) */}
          <h3>Newsletter</h3>
          <p>Recibí ofertas y novedades de temporada.</p>
          {enviado ? (
            // ↑ Operador ternario: si enviado es true...
            <p className="footer-newsletter-ok">¡Gracias por suscribirte! 🌱</p>
            // ↑ ...mostramos el mensaje de éxito
          ) : (
            // ↑ ...si es false, mostramos el formulario para escribir el email
            <form className="footer-newsletter" onSubmit={handleSubmit}>
              {/* ↑ onSubmit: se dispara al presionar el botón o Enter */}
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // ↑ En cada tecla guardamos el valor actual del input en el estado
                required
                aria-label="Correo electrónico para el newsletter"
              />
              <button type="submit" className="btn btn-secondary">Suscribirme</button>
            </form>
          )}
        </div>
      </div>

      <div className="container footer-team">
        {/* ↑ Sección del equipo */}
        <h3>Nuestro equipo</h3>
        <div className="team-grid">
          {equipo.map((persona) => (
            // ↑ .map recorre el array equipo y crea una tarjeta por persona
            <TeamCard className="team-card" key={persona.id || persona.nombre}>
              {/* ↑ key: identificador único que React necesita en listas */}
              <div className="team-avatar">{persona.inicial}</div>
              {/* ↑ Círculo con la inicial de la persona */}
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
// ↑ Exportamos el componente para usarlo en Layout