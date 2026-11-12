import { useState } from 'react'
import { FaSave, FaTimes } from 'react-icons/fa'
import { rutaPublica } from '../../utils/rutasPublicas'
import './ProductoForm.css'

const VACIO = {
  nombre: '', categoria: '', precio: '', unidad: 'kg', stock: '', descripcion: '', imagen: '',
}

// Validaciones del lado del cliente: devuelve un objeto { campo: 'mensaje' }
export function validar(d) {
  const e = {}
  if (d.nombre.trim().length < 3) e.nombre = 'El nombre es obligatorio (mínimo 3 caracteres).'
  if (!d.categoria.trim()) e.categoria = 'La categoría es obligatoria.'
  if (d.precio === '' || Number.isNaN(Number(d.precio)) || Number(d.precio) <= 0)
    e.precio = 'El precio debe ser un número mayor a 0.'
  if (d.stock === '' || !Number.isInteger(Number(d.stock)) || Number(d.stock) < 0)
    e.stock = 'El stock debe ser un número entero de 0 o más.'
  if (d.descripcion.trim().length < 10) e.descripcion = 'La descripción debe tener al menos 10 caracteres.'
  if (!d.imagen.trim()) e.imagen = 'Indicá la imagen (ruta en public/ o URL).'
  return e
}

// Formulario controlado REUTILIZADO para alta y edición:
//  - sin `inicial`  → modo alta
//  - con `inicial`  → modo edición (el formulario se puebla con los datos del producto)
function ProductoForm({ inicial, onGuardar, onCancelar, guardando }) {
  const modoEdicion = Boolean(inicial)
  const [datos, setDatos] = useState(inicial ? { ...VACIO, ...inicial } : VACIO)
  const [errores, setErrores] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setDatos((d) => ({ ...d, [name]: value }))
    if (errores[name]) setErrores((er) => ({ ...er, [name]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nuevos = validar(datos)
    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) return
    onGuardar(datos)
  }

  const campo = (name, label, props = {}) => (
    <div className="form-grupo">
      <label htmlFor={`pf-${name}`}>{label}</label>
      <input id={`pf-${name}`} name={name} value={datos[name]} onChange={handleChange}
        aria-invalid={Boolean(errores[name])} {...props} />
      {errores[name] && <span className="form-error" role="alert">{errores[name]}</span>}
    </div>
  )

  return (
    <form className="producto-form" onSubmit={handleSubmit} noValidate>
      <h3>{modoEdicion ? 'Editar producto' : 'Agregar producto'}</h3>

      <div className="producto-form-fila">
        {campo('nombre', 'Nombre')}
        {campo('categoria', 'Categoría')}
      </div>
      <div className="producto-form-fila">
        {campo('precio', 'Precio ($)', { type: 'number', min: 0, step: '1' })}
        <div className="form-grupo">
          <label htmlFor="pf-unidad">Unidad</label>
          <select id="pf-unidad" name="unidad" value={datos.unidad} onChange={handleChange}>
            <option value="kg">kg</option>
            <option value="unidad">unidad</option>
            <option value="atado">atado</option>
          </select>
        </div>
        {campo('stock', 'Stock', { type: 'number', min: 0, step: '1' })}
      </div>
      {campo('imagen', 'Imagen (ruta en public/ o URL)', { placeholder: 'verduras/tomate.jpg o https://...' })}
      {datos.imagen.trim() && (
        <img className="producto-form-preview" src={rutaPublica(datos.imagen.trim())} alt="Vista previa" />
      )}
      <div className="form-grupo">
        <label htmlFor="pf-descripcion">Descripción</label>
        <textarea id="pf-descripcion" name="descripcion" rows={3} value={datos.descripcion}
          onChange={handleChange} aria-invalid={Boolean(errores.descripcion)} />
        {errores.descripcion && <span className="form-error" role="alert">{errores.descripcion}</span>}
      </div>

      <div className="producto-form-acciones">
        <button type="submit" className="btn btn-primary" disabled={guardando}>
          <FaSave aria-hidden="true" /> {guardando ? 'Guardando...' : modoEdicion ? 'Actualizar producto' : 'Guardar producto'}
        </button>
        {onCancelar && (
          <button type="button" className="btn btn-outline" onClick={onCancelar} disabled={guardando}>
            <FaTimes aria-hidden="true" /> Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

export default ProductoForm
