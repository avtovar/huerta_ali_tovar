import { Link } from 'react-router-dom'
// ↑ Link: enlace SPA para ir al detalle del producto

import { toast } from 'react-toastify'
import { FaCartPlus } from 'react-icons/fa'
import { useCart } from '../../context/CartContext'
// ↑ useCart: acceso al carrito global (para el botón "Agregar")

import { rutaPublica } from '../../utils/rutasPublicas'
// ↑ rutaPublica: antepone el prefijo del proyecto a la ruta de la imagen

import './Item.css'
// ↑ Estilos propios de la tarjeta

function Item({ producto }) {
  // ↑ Recibe un producto por PROPS (viajan del padre ItemListContainer al hijo)
  const { addToCart } = useCart()
  // ↑ Extraemos del contexto la función para agregar al carrito

  const { id, nombre, precio, unidad, imagen, categoria } = producto
  // ↑ Desestructuración: sacamos del objeto producto los datos que vamos a mostrar

  return (
    <article className="item-card">
      {/* ↑ article: la tarjeta es una unidad de contenido independiente */}
      <Link to={`/producto/${id}`} className="item-image-link">
        {/* ↑ Template string: crea la URL dinámica, ej. /producto/3 */}
        <img src={rutaPublica(imagen)} alt={nombre} className="item-image" loading="lazy" />
        {/* ↑ Imagen del producto. rutaPublica() le pone el prefijo del proyecto */}
        {/* ↑ loading="lazy": se carga solo cuando está cerca de la vista */}
      </Link>
      <div className="item-body">
        <span className="item-categoria">{categoria}</span>
        {/* ↑ Categoría en mayúsculas pequeñas arriba de todo */}
        <h3 className="item-nombre">{nombre}</h3>
        <p className="item-precio">
          ${precio} <span>/ {unidad}</span>
          {/* ↑ Precio seguido de la unidad (kg, unidad, atado...) */}
        </p>
        <div className="item-actions">
          <Link to={`/producto/${id}`} className="btn btn-outline item-btn">
            Ver más
          </Link>
          <button
            type="button"
            className="btn btn-primary item-btn"
            onClick={() => {
              addToCart(producto, 1)
              toast.success(`${nombre} agregado al carrito`)
            }}
            disabled={producto.stock === 0}
            aria-label={`Agregar ${nombre} al carrito`}
            // ↑ onClick: al hacer clic agregamos 1 unidad al carrito global
          >
            <FaCartPlus aria-hidden="true" /> Agregar
          </button>
        </div>
      </div>
    </article>
  )
}

export default Item
// ↑ Exportamos la tarjeta para reutilizarla en ItemListContainer