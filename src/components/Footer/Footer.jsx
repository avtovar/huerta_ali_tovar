import { useEffect, useState } from 'react'
// ↑ useEffect: hook para ejecutar efectos secundarios (suscribirse a cambios).
// ↑ useState: hook para crear estado local dentro de un componente funcional.

import styled from 'styled-components'
// ↑ styled-components: librería para escribir CSS con variables de JavaScript.
//    Permite crear estilos componibles y reutilizables usando template strings.

import { firebaseConfigurado } from '../../firebase/config'
// ↑ firebaseConfigurado: verifica si el archivo .env tiene todas las credenciales de Firebase.
//    Si es false, el footer usará los datos de respaldo local en lugar de Firestore.

import { obtenerEquipo } from '../../services/equipoService'
// ↑ obtenerEquipo: función que lee la colección 'equipo' de Firestore.
//    Trae los datos del equipo para mostrarlos en el footer.

const TeamCard = styled.article`
  background-color: var(--color-card);
  border-radius: var(--radius-md);
  padding: 24px;
  text-align: center;
  box-shadow: var(--shadow-soft);
`
// ↑ TeamCard: estilo modular para las tarjetas del equipo usando styled-components.
//    Usa variables CSS globales (paleta de colores y sombras) definidas en index.css.

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
// ↑ Componente de pie de página que muestra contacto, legales, newsletter y equipo.
//    El equipo se lee de Firestore, pero conserva datos locales como respaldo.

  const [equipo, setEquipo] = useState(equipoRespaldo)
// ↑ equipo: array con los datos del equipo para mostrar en el footer.
//    Estado inicial es el equipoRespaldo (datos locales).
  const [email, setEmail] = useState('')// ↑ email: valor del input del newsletter.
  const [enviado, setEnviado] = useState(false)// ↑ enviado: bandera para mostrar mensaje de gracias.

  useEffect(() => {
    // ↑ useEffect: se ejecuta una vez cuando el componente se monta.
    //    Aquí nos suscribimos a los cambios de la colección 'equipo' en Firestore.

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
    //    Cuando el componente se desmonta, dejamos de escuchar cambios para evitar fugas.
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
          <p className="footer-copy">© 2026 La Huerta de Ali. Todos los derechos reservados.</p>
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

// ↑ Exportamos el componente default para que sea usado por Layout.
//    El footer siempre aparece al final de todas las páginas.
export default Footer