import { Link } from 'react-router-dom'
import Seo from '../components/Seo/Seo'
// ↑ Link: enlace SPA para volver al inicio

function NotFound() {
  // ↑ Página 404: se muestra para cualquier ruta que no exista (la captura "*" en App.jsx)
  return (
    <div className="page container texto-centrado">
      <Seo titulo="Página no encontrada" />
      <h2>404 - Página no encontrada</h2>
      <p>La página que buscás no existe.</p>
      <Link to="/" className="btn btn-primary">Volver al inicio</Link>
    </div>
  )
}

export default NotFound
// ↑ Exportamos la página para declararla en las rutas de App.jsx