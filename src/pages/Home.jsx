import { Link } from 'react-router-dom'
// ↑ Link: enlace SPA para ir al catálogo

import Seo from '../components/Seo/Seo'
import ItemListContainer from '../components/ItemListContainer/ItemListContainer'
// ↑ Componente que muestra la grilla de productos (cargada con fetch)

import './Home.css'
// ↑ Estilos propios de la página de inicio (hero)

function Home() {
  // ↑ Página principal: presentación + catálogo
  return (
    <div className="page">
      <Seo descripcion="Verdulería online: verduras frescas, directo de la huerta a tu mesa." />
      {/* ↑ page: clase utilitaria que da padding vertical y altura mínima */}

      <section className="container hero">
        {/* ↑ Sección de bienvenida: texto a la izquierda, emojis a la derecha */}
        <div className="hero-text">
          <span className="hero-eyebrow">La Huerta de Ali</span>
          {/* ↑ eyebrow: etiqueta pequeña sobre el título */}

          <h1>Verduras frescas, directo de la huerta a tu mesa</h1>
          <p>
            Somos los mejores en calidad y productos frescos. Elegí entre más
            de 10 variedades de verduras seleccionadas cada día para vos.
          </p>
          <Link to="/productos" className="btn btn-primary hero-cta">
            Ver productos
          </Link>
          {/* ↑ Botón que lleva al catálogo completo */}
        </div>
        <div className="hero-image" aria-hidden="true">🥕🥬🍅🥦</div>
        {/* ↑ Emojis decorativos; aria-hidden los oculta de los lectores de pantalla */}
      </section>

      <section className="container">
        <ItemListContainer saludo="Nuestras verduras" limite={4} />
        {/* ↑ Reutilizamos el contenedor del catálogo; saludo es el título de la sección */}
      </section>
    </div>
  )
}

export default Home
// ↑ Exportamos la página para declararla en las rutas de App.jsx