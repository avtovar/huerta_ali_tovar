import { Helmet } from 'react-helmet-async'

// Cambia el <title> y la meta description de cada página (SEO)
function Seo({ titulo, descripcion }) {
  return (
    <Helmet>
      <title>{titulo ? `${titulo} | La Huerta de Ali` : 'La Huerta de Ali | Verdulería online'}</title>
      {descripcion && <meta name="description" content={descripcion} />}
    </Helmet>
  )
}

export default Seo
