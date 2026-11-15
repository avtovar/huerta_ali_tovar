import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaCartPlus } from 'react-icons/fa'
import { useCart } from '../../context/CartContext'
import { rutaPublica } from '../../utils/rutasPublicas'
import './Item.css'

function Item({ producto }) {
  const { addToCart } = useCart()
  const { id, nombre, precio, unidad, imagen, categoria } = producto

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

export default Item
