import { Link } from 'react-router-dom'
// ↑ Link: crea enlaces de navegación SPA sin recargar la página.

import { toast } from 'react-toastify'
// ↑ toast: función para mostrar un mensaje emergente (toast) en la esquina inferior derecha.

import { FaCartPlus } from 'react-icons/fa'
// ↑ importar icono FaCartPlus de Font Awesome (react-icons/fa).

import { useCart } from '../../context/CartContext'
// ↑ useCart: hook personalizado que lee el carrito global y sus funciones.

import { rutaPublica } from '../../utils/rutasPublicas'
// ↑ rutaPublica: helper que construye la URL correcta a un archivo en public/.

import './Item.css'
// ↑ Estilos propios del componente Item (tarjeta). Usa clases como .item-card,
//    .item-image, .item-body, .item-actions definidas en este CSS.

function Item({ producto }) {
// ↑ Componente presentacional que muestra una tarjeta de producto.
//    Recibe el objeto 'producto' por props desde el padre (ItemListContainer).

  const { addToCart } = useCart()
// ↑ Desestructuramos del contexto solo lo que necesitamos: la función addToCart.

  const { id, nombre, precio, unidad, imagen, categoria } = producto
// ↑ Destructuración del objeto producto: extraemos las propiedades que necesitamos.

  return (
    <article className="item-card">
      <Link to={`/producto/${id}`} className="item-image-link">
        <img src={rutaPublica(imagen)} alt={nombre} className="item-image" loading="lazy" />
      </Link>

      <div className="item-body">
        <span className="item-categoria">{categoria}</span>
        <h3 className="item-nombre">{nombre}</h3>
        <p className="item-precio">
          ${precio} <span>/ {unidad}</span>
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
          >
            <FaCartPlus aria-hidden="true" /> Agregar
          </button>
        </div>
      </div>
    </article>
  )
}

// ↑ Exportamos el componente default para que sea usado por ItemListContainer.
export default Item