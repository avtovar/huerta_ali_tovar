import { useState } from 'react'
// ↑ useState: estado local que dice si la compra ya se finalizó

import { Link } from 'react-router-dom'
// ↑ Link: enlaces para seguir comprando o ver productos

import { useCart } from '../context/CartContext'
// ↑ useCart: acceso completo al carrito global (items, totales y acciones)

import { toast } from 'react-toastify'
import { FaTrash, FaTimes } from 'react-icons/fa'
import Seo from '../components/Seo/Seo'
import { rutaPublica } from '../utils/rutasPublicas'
// ↑ rutaPublica: antepone el prefijo del proyecto a la ruta de la imagen

import './Carrito.css'
// ↑ Estilos propios de la página del carrito

function Carrito() {
  const { carrito, removeFromCart, updateCantidad, clearCart, getTotal } = useCart()
  // ↑ Desestructuramos del contexto todo lo que la página necesita

  const [comprado, setComprado] = useState(false)
  // ↑ comprado: true después de "Finalizar compra" → pantalla de agradecimiento

  const handleComprar = () => {
    // ↑ Acción del botón "Finalizar compra" (simulación, no hay pago real)
    setComprado(true)
    // ↑ Cambiamos a la pantalla de gracias
    clearCart()
    // ↑ Vaciamos el carrito global
  }

  if (comprado) {
    // ↑ Pantalla post-compra
    return (
      <div className="page container carrito-vacio">
        <h2>¡Gracias por tu compra! 🥬</h2>
        <p>En breve nos contactamos para coordinar la entrega.</p>
        <Link to="/productos" className="btn btn-primary">Seguir comprando</Link>
      </div>
    )
  }

  if (carrito.length === 0) {
    // ↑ Pantalla de carrito vacío (antes de comprar)
    return (
      <div className="page container carrito-vacio">
        <h2>Tu carrito está vacío</h2>
        <p>Todavía no agregaste ninguna verdura.</p>
        <Link to="/productos" className="btn btn-primary">Ver productos</Link>
      </div>
    )
  }

  return (
    <div className="page container">
      <Seo titulo="Tu carrito" />
      <h2>Tu carrito</h2>

      <div className="carrito-lista">
        {carrito.map((item) => (
          // ↑ .map: una fila por cada producto del carrito
          <div className="carrito-item" key={item.id}>
            {/* ↑ key: id único del producto */}
            <img src={rutaPublica(item.imagen)} alt={item.nombre} />
            {/* ↑ Foto del producto: el carrito guarda el mismo 'imagen' del JSON */}
            <div className="carrito-item-info">
              <h4>{item.nombre}</h4>
              <p>${item.precio} / {item.unidad}</p>
            </div>
            <div className="cantidad-selector">
              <button type="button" onClick={() => updateCantidad(item.id, item.cantidad - 1)}>−</button>
              {/* ↑ Baja la cantidad (updateCantidad no deja pasar de 1) */}
              <span>{item.cantidad}</span>
              <button type="button" onClick={() => updateCantidad(item.id, item.cantidad + 1)}>+</button>
              {/* ↑ Sube la cantidad (con tope de stock dentro del contexto) */}
            </div>
            <p className="carrito-item-subtotal">${item.precio * item.cantidad}</p>
            {/* ↑ Subtotal de este producto: precio × cantidad */}
            <button
              type="button"
              className="carrito-item-quitar"
              onClick={() => removeFromCart(item.id)}
              aria-label={`Quitar ${item.nombre} del carrito`}
              // ↑ aria-label: descripción accesible para el botón ✕
            >
              <FaTimes aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>

      <div className="carrito-resumen">
        {/* ↑ Barra inferior: vaciar / total / finalizar */}
        <button type="button" className="btn btn-outline" onClick={clearCart}>
          <FaTrash aria-hidden="true" /> Vaciar carrito
        </button>
        <div className="carrito-total">
          <span>Total</span>
          <strong>${getTotal()}</strong>
          {/* ↑ Suma total de todos los subtotales */}
        </div>
        <button type="button" className="btn btn-primary" onClick={handleComprar}>
          Finalizar compra
        </button>
      </div>
    </div>
  )
}

export default Carrito
// ↑ Exportamos la página para declararla en las rutas de App.jsx