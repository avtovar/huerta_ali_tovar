import { createContext, useContext, useEffect, useState } from 'react'
// ↑ createContext: crea un "estado compartido" para toda la app
// ↑ useContext: hook para leer ese estado compartido desde cualquier componente
// ↑ useState: estado local (en este caso, la lista del carrito)

const CartContext = createContext()
// ↑ Creamos el contexto vacío. Después lo "llenamos" con el provider

export function CartProvider({ children }) {
  // ↑ Provider: el componente que ENVUELVE la app y le da acceso al carrito
  // ↑ children = todo lo que esté adentro de <CartProvider>...</CartProvider>

  const [carrito, setCarrito] = useState(() => {
    // Recupera el carrito guardado para que no se pierda al recargar la página
    try {
      return JSON.parse(localStorage.getItem('carrito')) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('carrito', JSON.stringify(carrito))
    } catch {
      // si el navegador bloquea localStorage, el carrito sigue funcionando en memoria
    }
  }, [carrito])
  // ↑ carrito: array de productos agregados, ej. [{ id, nombre, cantidad, precio... }]
  // ↑ setCarrito: la función para actualizar ese array (React vuelve a dibujar la app)

  const addToCart = (producto, cantidad = 1) => {
    // ↑ Agrega un producto al carrito, respetando el stock disponible
    setCarrito((prev) => {
      // ↑ prev = el carrito tal como estaba antes de este cambio
      const yaExiste = prev.find((item) => item.id === producto.id)
      // ↑ ¿El producto ya está en el carrito? Lo buscamos por id
      const cantidadSolicitada = Math.max(1, cantidad)
      // ↑ Evitamos cantidades menores que 1

      if (yaExiste) {
        // ↑ Si ya estaba, sumamos la cantidad nueva...
        return prev.map((item) =>
          item.id === producto.id
            ? {
                ...item,
                // ↑ Copiamos el item tal como estaba...
                cantidad: Math.min(
                  item.cantidad + cantidadSolicitada,
                  producto.stock
                ),
                // ↑ ...pero la cantidad nueva queda limitada al stock (nunca pasa de ahí)
              }
            : item
        )
      }

      return [
        ...prev,
        // ↑ Si no estaba, agregamos un item nuevo al final del array
        { ...producto, cantidad: Math.min(cantidadSolicitada, producto.stock) },
        // ↑ Copiamos todas las props del producto y le asignamos la cantidad (con tope de stock)
      ]
    })
  }

  const removeFromCart = (id) => {
    // ↑ Quita un producto del carrito filtrando por id
    setCarrito((prev) => prev.filter((item) => item.id !== id))
    // ↑ .filter devuelve un nuevo array SIN el item que tenga ese id
  }

  const updateCantidad = (id, cantidad) => {
    // ↑ Cambia la cantidad de un producto ya agregado
    if (cantidad < 1) return
    // ↑ No permitimos bajar de 1 (para quitar se usa removeFromCart)
    setCarrito((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, cantidad: Math.min(cantidad, item.stock) }
          // ↑ Actualizamos la cantidad del item indicado, con tope de stock
          : item
      )
    )
  }

  const clearCart = () => setCarrito([])
  // ↑ Vacía el carrito completo (deja el array en [])

  const getCantidadTotal = () =>
    // ↑ Suma TODAS las cantidades del carrito (para el contador del widget 🛒)
    carrito.reduce((acc, item) => acc + item.cantidad, 0)
    // ↑ reduce acumula: arranca en 0 y va sumando item.cantidad de cada producto

  const getTotal = () =>
    // ↑ Calcula el total a pagar: cantidad × precio de cada producto, sumando todo
    carrito.reduce((acc, item) => acc + item.cantidad * item.precio, 0)

  return (
    <CartContext.Provider
      // ↑ El provider "expone" el valor del contexto a todos los componentes hijos
      value={{
        carrito,
        addToCart,
        removeFromCart,
        updateCantidad,
        clearCart,
        getCantidadTotal,
        getTotal,
      }}
    >
      {children}
      {/* ↑ Aquí se dibujan todos los componentes que están dentro del provider */}
    </CartContext.Provider>
  )
}

export function useCart() {
  // ↑ Hook personalizado: la forma cómoda de leer el carrito desde cualquier componente
  return useContext(CartContext)
  // ↑ useContext devuelve TODO el value que pasamos arriba (carrito + funciones)
}