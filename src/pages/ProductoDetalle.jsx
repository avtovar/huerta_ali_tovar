import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ItemDetail from '../components/ItemDetail/ItemDetail'
import Cargando from '../components/Cargando/Cargando'
import Seo from '../components/Seo/Seo'
import { obtenerProducto, obtenerProductosIniciales } from '../services/productosService'
import { firebaseConfigurado } from '../firebase/config'
import { mensajeError } from '../utils/errores'

function ProductoDetalle() {
  const { id } = useParams()

  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [aviso, setAviso] = useState('')

  useEffect(() => {
    let activo = true
    setCargando(true)
    setError('')
    setAviso('')

    async function cargarProducto() {
      try {
        let productoCargado = null

        if (firebaseConfigurado) {
          try {
            productoCargado = await obtenerProducto(id)
          } catch (e) {
            console.error('Error al cargar el producto de Firestore:', e)
            if (activo) {
              setAviso(`No se pudo cargar Firestore (${mensajeError(e)}). Se muestra el catálogo inicial.`)
            }
          }
        } else if (activo) {
          setAviso('Mostrando el catálogo inicial. Configurá Firebase para administrar productos.')
        }

        if (!productoCargado) {
          const productosIniciales = await obtenerProductosIniciales()
          productoCargado = productosIniciales.find((producto) => String(producto.id) === id) || null
        }

        if (activo) setProducto(productoCargado)
      } catch (e) {
        console.error('Error al cargar el producto:', e)
        if (activo) setError(mensajeError(e))
      } finally {
        if (activo) setCargando(false)
      }
    }

    cargarProducto()
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
      {aviso && <p className="mensaje mensaje-aviso" role="status">{aviso}</p>}
      <ItemDetail producto={producto} />
    </div>
  )
}

export default ProductoDetalle
