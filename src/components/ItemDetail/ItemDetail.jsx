import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { rutaPublica } from '../../utils/rutasPublicas'
import './ItemDetail.css'

function ItemDetail({ producto }) {
  const { addToCart, carrito } = useCart()
  const [cantidad, setCantidad] = useState(1)
  const [agregado, setAgregado] = useState(false)
  const { nombre, categoria, precio, unidad, descripcion, imagen, stock } = producto

  const cantidadEnCarrito = carrito.find((item) => item.id === producto.id)?.cantidad || 0
  const stockDisponible = Math.max(0, stock - cantidadEnCarrito)

  const handleAgregar = () => {
    if (stockDisponible === 0) return
    addToCart(producto, Math.min(cantidad, stockDisponible))
    setAgregado(true)
  }

  return (
    <div className="item-detail">
      <div className="item-detail-image">
        <img src={rutaPublica(imagen)} alt={nombre} />
      </div>

      <div className="item-detail-info">
        <span className="item-categoria">{categoria}</span>
        <h2>{nombre}</h2>
        <p className="item-detail-precio">
          ${precio} <span>/ {unidad}</span>
        </p>
        <p className="item-detail-descripcion">{descripcion}</p>
        <p className="item-detail-stock">Disponible: {stockDisponible} {unidad}</p>

        {agregado ? (
          <div className="item-detail-confirmacion">
            <p>¡Agregado al carrito! 🛒</p>
            <Link to="/carrito" className="btn btn-primary">Ir al carrito</Link>
            <Link to="/productos" className="btn btn-outline">Seguir comprando</Link>
          </div>
        ) : (
          <div className="item-detail-compra">
            <div className="cantidad-selector">
              <button
                type="button"
                onClick={() => setCantidad((actual) => Math.max(1, actual - 1))}
                aria-label="Disminuir cantidad"
              >
                −
              </button>
              <span>{cantidad}</span>
              <button
                type="button"
                disabled={cantidad >= stockDisponible}
                onClick={() => setCantidad((actual) => Math.min(stockDisponible, actual + 1))}
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              disabled={stockDisponible === 0}
              onClick={handleAgregar}
            >
              {stockDisponible === 0 ? 'Sin stock disponible' : 'Agregar al carrito'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ItemDetail
