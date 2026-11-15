import { useState } from 'react'
import { toast } from 'react-toastify'
import { FaEdit, FaTrash, FaPlus, FaDatabase } from 'react-icons/fa'
import { useProductos } from '../hooks/useProductos'
import {
  crearProducto, actualizarProducto, eliminarProducto, cargarProductosIniciales, obtenerProductosIniciales,
} from '../services/productosService'
import { mensajeError } from '../utils/errores'
import { rutaPublica } from '../utils/rutasPublicas'
import ProductoForm from '../components/ProductoForm/ProductoForm'
import ModalConfirmar from '../components/ModalConfirmar/ModalConfirmar'
import Cargando from '../components/Cargando/Cargando'
import Seo from '../components/Seo/Seo'
import './Panel.css'

function Panel() {
  const { productos, cargando, error, aviso, catalogoRespaldo, coleccionVacia, recargar } = useProductos()
  const [productoAEditar, setProductoAEditar] = useState(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [productoABorrar, setProductoABorrar] = useState(null)
  const [borrando, setBorrando] = useState(false)
  const [cargandoInicial, setCargandoInicial] = useState(false)
  const [errorOperacion, setErrorOperacion] = useState('')

  const abrirAlta = () => { setProductoAEditar(null); setMostrarForm(true); setErrorOperacion('') }
  const abrirEdicion = (p) => { setProductoAEditar(p); setMostrarForm(true); setErrorOperacion(''); window.scrollTo(0, 0) }
  const cerrarForm = () => { setProductoAEditar(null); setMostrarForm(false) }

  const handleGuardar = async (datos) => {
    setGuardando(true)
    setErrorOperacion('')
    try {
      if (productoAEditar) {
        await actualizarProducto(productoAEditar.id, datos)
        toast.success('Producto actualizado con éxito')
      } else {
        await crearProducto(datos)
        toast.success('Producto creado con éxito')
      }
      cerrarForm()
      await recargar()
    } catch (e) {
      console.error('Error al guardar:', e)
      setErrorOperacion(mensajeError(e))
    } finally {
      setGuardando(false)
    }
  }

  const handleEliminar = async () => {
    setBorrando(true)
    try {
      await eliminarProducto(productoABorrar.id)
      toast.success(`"${productoABorrar.nombre}" eliminado`)
      setProductoABorrar(null)
      await recargar()
    } catch (e) {
      console.error('Error al eliminar:', e)
      setErrorOperacion(mensajeError(e))
    } finally {
      setBorrando(false)
    }
  }

  const handleCargaInicial = async () => {
    setErrorOperacion('')
    setCargandoInicial(true)
    try {
      const lista = await obtenerProductosIniciales()
      await cargarProductosIniciales(lista)
      toast.success(`${lista.length} productos cargados`)
      await recargar()
    } catch (e) {
      console.error('Error en la carga inicial:', e)
      setErrorOperacion(mensajeError(e))
    } finally {
      setCargandoInicial(false)
    }
  }

  return (
    <div className="page container">
      <Seo titulo="Panel de administración" />
      <div className="panel-encabezado">
        <h2>Panel de administración</h2>
        {!mostrarForm && !cargando && !error && !catalogoRespaldo && (
          <button type="button" className="btn btn-primary" onClick={abrirAlta}>
            <FaPlus aria-hidden="true" /> Nuevo producto
          </button>
        )}
      </div>

      {errorOperacion && <p className="mensaje mensaje-error" role="alert">{errorOperacion}</p>}

      {mostrarForm && (
        <ProductoForm
          key={productoAEditar?.id || 'nuevo'}
          inicial={productoAEditar}
          onGuardar={handleGuardar}
          onCancelar={cerrarForm}
          guardando={guardando}
        />
      )}

      {cargando ? (
        <Cargando texto="Cargando productos..." />
      ) : error ? (
        <div role="alert" className="mensaje mensaje-error">
          <p>{error}</p>
          <button type="button" className="btn btn-outline" onClick={recargar}>Reintentar</button>
        </div>
      ) : catalogoRespaldo ? (
        <div className="panel-vacio">
          <p role="status">{aviso}</p>
          {coleccionVacia && (
            <button type="button" className="btn btn-secondary" onClick={handleCargaInicial} disabled={cargandoInicial}>
              <FaDatabase aria-hidden="true" />
              {cargandoInicial ? 'Cargando...' : 'Cargar los 12 productos iniciales'}
            </button>
          )}
        </div>
      ) : productos.length === 0 ? (
        <div className="panel-vacio">
          <p>Todavía no hay productos en la base de datos.</p>
          <button type="button" className="btn btn-secondary" onClick={handleCargaInicial}>
            <FaDatabase aria-hidden="true" /> Cargar los 12 productos iniciales
          </button>
        </div>
      ) : (
        <ul className="panel-lista">
          {productos.map((p) => (
            <li key={p.id} className="panel-item">
              <img src={rutaPublica(p.imagen)} alt="" className="panel-item-img" />
              <div className="panel-item-info">
                <strong>{p.nombre}</strong>
                <span>{p.categoria} · ${p.precio}/{p.unidad} · stock {p.stock}</span>
              </div>
              <div className="panel-item-acciones">
                <button type="button" className="btn-accion btn-accion-editar"
                  onClick={() => abrirEdicion(p)} aria-label={`Editar ${p.nombre}`}>
                  <FaEdit aria-hidden="true" /> Editar
                </button>
                <button type="button" className="btn-accion btn-accion-eliminar"
                  onClick={() => setProductoABorrar(p)} aria-label={`Eliminar ${p.nombre}`}>
                  <FaTrash aria-hidden="true" /> Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ModalConfirmar
        mostrar={Boolean(productoABorrar)}
        titulo="Eliminar producto"
        mensaje={`¿Desea eliminar "${productoABorrar?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirmar={handleEliminar}
        onCancelar={() => setProductoABorrar(null)}
        procesando={borrando}
      />
    </div>
  )
}

export default Panel