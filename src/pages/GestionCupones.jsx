import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { FaEdit, FaPlus, FaSave, FaTimes, FaTrash } from 'react-icons/fa'
import Cargando from '../components/Cargando/Cargando'
import ModalConfirmar from '../components/ModalConfirmar/ModalConfirmar'
import Seo from '../components/Seo/Seo'
import { useAuth } from '../context/AuthContext'
import {
  actualizarCupon, crearCupon, eliminarCupon, obtenerCupones,
} from '../services/cuponesService'
import { mensajeError } from '../utils/errores'
import './GestionCupones.css'

const CUPON_VACIO = {
  codigo: '',
  descuento: '',
  fechaVencimiento: '',
  activo: true,
}

function validarCupon(datos) {
  const errores = {}
  const codigo = datos.codigo.trim()
  const descuento = Number(datos.descuento)

  if (!/^[a-zA-Z0-9_-]{3,30}$/.test(codigo)) {
    errores.codigo = 'Usá entre 3 y 30 letras, números, guiones o guiones bajos.'
  }
  if (datos.descuento === '' || !Number.isFinite(descuento) || descuento <= 0 || descuento > 100) {
    errores.descuento = 'El descuento debe ser mayor a 0 y no superar el 100%.'
  }
  return errores
}

function CuponForm({ inicial, onGuardar, onCancelar, guardando }) {
  const [datos, setDatos] = useState(inicial ? { ...CUPON_VACIO, ...inicial } : CUPON_VACIO)
  const [errores, setErrores] = useState({})
  const codigoDeshabilitado = Boolean(inicial)

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target
    setDatos((actuales) => ({ ...actuales, [name]: type === 'checkbox' ? checked : value }))
    if (errores[name]) setErrores((actuales) => ({ ...actuales, [name]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nuevosErrores = validarCupon(datos)
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return
    onGuardar({ ...datos, codigo: datos.codigo.trim().toUpperCase() })
  }

  return (
    <form className="cupon-form" onSubmit={handleSubmit} noValidate>
      <h3>{inicial ? 'Editar cupón' : 'Nuevo cupón'}</h3>
      <div className="cupon-form-fila">
        <div className="form-grupo">
          <label htmlFor="cupon-codigo">Código</label>
          <input id="cupon-codigo" name="codigo" value={datos.codigo} onChange={handleChange}
            disabled={codigoDeshabilitado} autoComplete="off" aria-invalid={Boolean(errores.codigo)} />
          {errores.codigo && <span className="form-error" role="alert">{errores.codigo}</span>}
        </div>
        <div className="form-grupo">
          <label htmlFor="cupon-descuento">Descuento (%)</label>
          <input id="cupon-descuento" name="descuento" type="number" min="0.01" max="100"
            step="0.01" value={datos.descuento} onChange={handleChange}
            aria-invalid={Boolean(errores.descuento)} />
          {errores.descuento && <span className="form-error" role="alert">{errores.descuento}</span>}
        </div>
      </div>
      <div className="cupon-form-fila">
        <div className="form-grupo">
          <label htmlFor="cupon-vencimiento">Válido hasta (opcional)</label>
          <input id="cupon-vencimiento" name="fechaVencimiento" type="date"
            value={datos.fechaVencimiento || ''} onChange={handleChange} />
        </div>
        <label className="cupon-activo">
          <input name="activo" type="checkbox" checked={Boolean(datos.activo)} onChange={handleChange} />
          Cupón activo
        </label>
      </div>
      <div className="cupon-form-acciones">
        <button type="submit" className="btn btn-primary" disabled={guardando}>
          <FaSave aria-hidden="true" /> {guardando ? 'Guardando...' : 'Guardar cupón'}
        </button>
        <button type="button" className="btn btn-outline" onClick={onCancelar} disabled={guardando}>
          <FaTimes aria-hidden="true" /> Cancelar
        </button>
      </div>
    </form>
  )
}

function GestionCupones() {
  const { esAdmin } = useAuth()
  const [cupones, setCupones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [errorOperacion, setErrorOperacion] = useState('')
  const [cuponAEditar, setCuponAEditar] = useState(null)
  const [cuponABorrar, setCuponABorrar] = useState(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [borrando, setBorrando] = useState(false)

  const recargar = useCallback(async () => {
    setCargando(true)
    setError('')
    try {
      setCupones(await obtenerCupones())
    } catch (e) {
      console.error('Error al cargar cupones:', e)
      setError(mensajeError(e))
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    recargar()
  }, [recargar])

  const abrirAlta = () => {
    setCuponAEditar(null)
    setMostrarForm(true)
    setErrorOperacion('')
  }

  const abrirEdicion = (cupon) => {
    setCuponAEditar(cupon)
    setMostrarForm(true)
    setErrorOperacion('')
  }

  const cerrarForm = () => {
    setCuponAEditar(null)
    setMostrarForm(false)
  }

  const handleGuardar = async (datos) => {
    setGuardando(true)
    setErrorOperacion('')
    try {
      if (cuponAEditar) {
        await actualizarCupon(cuponAEditar.id, datos)
        toast.success('Cupón actualizado')
      } else {
        await crearCupon(datos)
        toast.success('Cupón creado')
      }
      cerrarForm()
      await recargar()
    } catch (e) {
      console.error('Error al guardar el cupón:', e)
      setErrorOperacion(mensajeError(e))
    } finally {
      setGuardando(false)
    }
  }

  const handleEliminar = async () => {
    if (!cuponABorrar) return
    setBorrando(true)
    setErrorOperacion('')
    try {
      await eliminarCupon(cuponABorrar.id)
      toast.success(`Cupón "${cuponABorrar.codigo}" eliminado`)
      setCuponABorrar(null)
      await recargar()
    } catch (e) {
      console.error('Error al eliminar el cupón:', e)
      setErrorOperacion(mensajeError(e))
    } finally {
      setBorrando(false)
    }
  }

  if (!esAdmin) {
    return (
      <div className="page container">
        <Seo titulo="Acceso restringido" />
        <h2>Acceso restringido</h2>
        <p>Tu cuenta no tiene permisos para administrar cupones.</p>
      </div>
    )
  }

  return (
    <div className="page container">
      <Seo titulo="Gestión de cupones" descripcion="Administrá los cupones de descuento." />
      <div className="panel-encabezado">
        <h2>Gestión de cupones</h2>
        {!mostrarForm && (
          <button type="button" className="btn btn-primary" onClick={abrirAlta}>
            <FaPlus aria-hidden="true" /> Nuevo cupón
          </button>
        )}
      </div>

      {errorOperacion && <p className="mensaje mensaje-error" role="alert">{errorOperacion}</p>}

      {mostrarForm && (
        <CuponForm
          key={cuponAEditar?.id || 'nuevo'}
          inicial={cuponAEditar}
          onGuardar={handleGuardar}
          onCancelar={cerrarForm}
          guardando={guardando}
        />
      )}

      {cargando ? (
        <Cargando texto="Cargando cupones..." />
      ) : error ? (
        <div className="mensaje mensaje-error" role="alert">
          <p>{error}</p>
          <button type="button" className="btn btn-outline" onClick={recargar}>Reintentar</button>
        </div>
      ) : cupones.length === 0 ? (
        <div className="panel-vacio"><p>Todavía no hay cupones registrados.</p></div>
      ) : (
        <ul className="cupon-lista">
          {cupones.map((cupon) => (
            <li className="cupon-item" key={cupon.id}>
              <div className="cupon-info">
                <strong>{cupon.codigo}</strong>
                <span>{cupon.descuento}% de descuento · {cupon.activo ? 'Activo' : 'Inactivo'}</span>
                <span>Válido hasta: {cupon.fechaVencimiento || 'Sin vencimiento'}</span>
              </div>
              <div className="panel-item-acciones">
                <button type="button" className="btn-accion btn-accion-editar"
                  onClick={() => abrirEdicion(cupon)} aria-label={`Editar ${cupon.codigo}`}>
                  <FaEdit aria-hidden="true" /> Editar
                </button>
                <button type="button" className="btn-accion btn-accion-eliminar"
                  onClick={() => setCuponABorrar(cupon)} aria-label={`Eliminar ${cupon.codigo}`}>
                  <FaTrash aria-hidden="true" /> Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ModalConfirmar
        mostrar={Boolean(cuponABorrar)}
        titulo="Eliminar cupón"
        mensaje={`¿Deseás eliminar el cupón "${cuponABorrar?.codigo}"? Esta acción no se puede deshacer.`}
        onConfirmar={handleEliminar}
        onCancelar={() => setCuponABorrar(null)}
        procesando={borrando}
      />
    </div>
  )
}

export default GestionCupones
