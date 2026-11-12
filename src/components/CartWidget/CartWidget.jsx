import { Link } from 'react-router-dom'
// ↑ Link: enlace SPA sin recargar la página

import { FaShoppingCart } from 'react-icons/fa'
import { useCart } from '../../context/CartContext'
// ↑ useCart: nuestro hook para leer el carrito global

import './CartWidget.css'
// ↑ Estilos propios del widget del carrito

function CartWidget() {
  const { getCantidadTotal } = useCart()
  // ↑ Desestructuramos del contexto solo lo que necesitamos: la función que suma cantidades

  const cantidad = getCantidadTotal()
  // ↑ Total de productos en el carrito (ej. 2 tomates + 1 lechuga = 3)

  return (
    <Link to="/carrito" className="cart-widget" aria-label="Ir al carrito de compras">
      {/* ↑ Enlace redondo que lleva a la página /carrito. aria-label lo describe para accesibilidad */}
      <FaShoppingCart aria-hidden="true" />
      {/* ↑ Ícono del carrito (decorativo) */}
      {cantidad > 0 && <span className="cart-widget-badge">{cantidad}</span>}
      {/* ↑ Solo si hay productos mostramos el contador rojo. && = "si se cumple, renderizá esto" */}
    </Link>
  )
}

export default CartWidget
// ↑ Exportamos el widget para usarlo en la NavBar