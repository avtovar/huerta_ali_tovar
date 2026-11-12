import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ItemDetail from '../components/ItemDetail/ItemDetail'
import Cargando from '../components/Cargando/Cargando'
import Seo from '../components/Seo/Seo'
import { obtenerProducto } from '../services/productosService'
import { mensajeError } from '../utils/errores'

function ProductoDetalle() {
  const { id } = useParams()

  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true
    setCargando(true)
    setError('')
    obtenerProducto(id)
      .then((p) => activo && setProducto(p))
      .catch((e) => {
        console.error('Error al cargar el producto:', e)
        if (activo) setError(mensajeError(e))
      })
      .finally(() => activo && setCargando(false))
    return () => { activo = false }
  }, [id])

  if (cargando) {
    return <div className="page container"><Cargando texto="Cargando producto..." /></div>
  }

  if (error) {
    return (
      <div className="page container">
        <p className="mensaje mensaje-error" role="alert">{error}</p>
        <Link to="/productos" className="btn btn-primary">Volver a productos</Link>
      </div>
    )
  }

  if (!producto) {
    return (
      <div className="page container">
        <Seo titulo="Producto no encontrado" />
        <h2>No encontramos esa verdura</h2>
        <p>Puede que el producto ya no esté disponible.</p>
        <Link to="/productos" className="btn btn-primary">Volver a productos</Link>
      </div>
    )
  }

  return (
    <div className="page container">
      <Seo titulo={producto.nombre} descripcion={`${producto.nombre}: ${producto.descripcion}`} />
      <ItemDetail producto={producto} />
    </div>
  )
}

export default ProductoDetalle
