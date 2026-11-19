import { Link } from 'react-router-dom'
// ↑ Link: crea enlaces de navegación SPA sin recargar la página.

import './Header.css'
// ↑ Estilos propios del encabezado.
//    Usa variables CSS de :root (paleta de colores) y clases .container, .header-brand, etc.

function Header() {
// ↑ Componente estático: este componente no tiene estado propio (no usa useState).
//    Solo muestra fijo el logo y el slogan. Es el "cartel" de la app que
//    siempre está visible en la parte superior.
  return (
    <header className="header">
      {/* ↑ Etiqueta semántica <header>: representa el encabezado de la página. */}
      <div className="container header-inner">
        {/* ↑ container: clase utilitaria que centra el contenido horizontalmente.
           width máxima y margin auto, definida en Header.css. -->
          header-inner: agrupa el logo y el título en una fila sola usando flexbox. */}
        <Link to="/" className="header-brand">
          {/* ↑ Link: componente de navegación SPA que lleva a la ruta '/' (inicio).
             className "header-brand" lo estiliza como marca principal. */}
          <span className="header-logo" aria-hidden="true">🥬</span>
          {/* ↑ span con emoji berenjena: marca visual de la verdulería.
             aria-hidden: este contenido es decorativo, los lectores de pantalla lo ignoran
             para no entorpecer la navegación para usuarios de tecnologías asistivas. */}
          <div>
            <h1 className="header-title">La Huerta de Ali</h1>
            {/* ↑ h1: el título más importante de la página (jerarquía HTML).
               Muestra el nombre del emprendimiento. */}
            <p className="header-slogan">Somos los mejores en calidad y productos frescos</p>
            {/* ↑ p (parágrafo): el slogan debajo del nombre.
               Ayuda a comunicar la propuesta de valor rápidamente. */}
          </div>
        </Link>
      </div>
    </header>
  )
}

export default Header
// ↑ Exportamos el componente para importarlo desde Layout.
//    Layout es quien lo envuelve junto con NavBar, Footer y el <Outlet/> central.