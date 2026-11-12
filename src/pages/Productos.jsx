import Seo from '../components/Seo/Seo'
import ItemListContainer from '../components/ItemListContainer/ItemListContainer'
// ↑ Reutilizamos el mismo contenedor que usa Home para mostrar el catálogo

function Productos() {
  // ↑ Página del catálogo completo: ¡no repite lógica porque ItemListContainer la centraliza!
  return (
    <div className="page container">
      <Seo titulo="Productos" descripcion="Catálogo de verduras frescas de La Huerta de Ali." />
      {/* ↑ page + container: margen superior/inferior y contenido centrado */}
      <ItemListContainer saludo="Todas nuestras verduras" />
      {/* ↑ Mismo componente, con otro título */}
    </div>
  )
}

export default Productos
// ↑ Exportamos la página para declararla en las rutas de App.jsx