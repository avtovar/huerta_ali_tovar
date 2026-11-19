import { createContext, useContext, useEffect, useState } from 'react'
// ↑ createContext: crea un "contexto" para compartir el carrito entre todos los componentes
//    sin tener que pasar props de componente en componente (evita el "prop drilling").

export function CartProvider({ children }) {
// ↑ CartProvider: componente que ENVUELLE la app (o una parte de ella) y le dé acceso
//    al carrito global. Cualquier hijo de este provider puede usar useCart().

  const [carrito, setCarrito] = useState(() => {
    // ↑ Usamos useState con una función para inicializar el carrito desde localStorage.
    //    Así el carrito persiste aunque el usuario recargue la página.

    try {
      // Intentamos recuperar el carrito guardado en localStorage.
      // localStorage.getItem('carrito') devuelve una string, o null si no hay nada.
      return JSON.parse(localStorage.getItem('carrito')) || []
    } catch {
      // Si localStorage falla o no tiene datos, arrancamos con carrito vacío [].
      return []
    }
  })
  // ↑ carrito: array que guarda los productos agregados.
  //    Cada elemento tiene al menos: id, nombre, precio, unidad, stock, cantidad.
  //    Ejemplo: [{ id: 1, nombre: "Tomate", precio: 2.5, unidad: "kg", cantidad: 3, stock: 10 }]
  // ↑ setCarrito: función que React usa para actualizar el estado y volver a dibujar la app.

  useEffect(() => {
    // ↑ useEffect: cada vez que el carrito cambia, guardamos la copia en localStorage.
    //    Esto persiste el carrito aunque el usuario recargue o cierre el navegador.

    try {
      localStorage.setItem('carrito', JSON.stringify(carrito))
    } catch {
      // Si el navegador bloquea localStorage o hay algún error, el carrito sigue
      // funcionando solo en memoria (se perderá al recargar, pero no romperá la app).
    }
  }, [carrito])
  // ↑ Nota: la dependencia [carrito] significa que este efecto se ejecuta cada vez
  //    que el carrito cambia (cada vez que se agrega, quita o cambia la cantidad).

  const addToCart = (producto, cantidad = 1) => {
// ↑ Agrega un producto al carrito, respetando el stock disponible.
    //    El parámetro "producto" es el objeto completo que viene de los items del catálogo.
    //    El parámetro "cantidad" cuántas unidades se quieren agregar (default: 1).

    setCarrito((prev) => {
      // ↑ Usamos la forma funcional de setCarrito porque el nuevo valor depende del previo.
      //    Patrón de inmutabilidad de React: nunca mutar directamente el state.

      const yaExiste = prev.find((item) => item.id === producto.id)
      // ↑ ¿El producto ya está en el carrito? Lo buscamos por su id único.
      //    .find devuelve el objeto si existe, o undefined si no.

      const cantidadSolicitada = Math.max(1, cantidad)
      // ↑ Evitamos que el usuario agregue cantidades menores a 1.
      //    Math.max(1, cantidad) asegura que el mínimo sea 1.

      if (yaExiste) {
        // ↑ Si el producto YA estaba en el carrito, sumamos la cantidad nueva a la existente.
        return prev.map((item) =>
          item.id === producto.id
            ? {
                // ↑ Copiamos el item tal como estaba, pero actualizamos la cantidad.
                ...item,
                cantidad: Math.min(
                  item.cantidad + cantidadSolicitada,
                  producto.stock
                ),
                // ↑ ...pero la cantidad nueva queda limitada al stock disponible del producto.
                //    Math.min(..., producto.stock) nunca deja pasar del stock máximo.
              }
            : item
        )
      // Si el producto NO estaba en el carrito, lo agregamos como un nuevo elemento.
      }

      return [
        ...prev,
        // ↑ Spread operator: copia todos los items que ya estaban en el carrito.
        { ...producto, cantidad: Math.min(cantidadSolicitada, producto.stock) },
        // ↑ Agregamos el producto nuevo con la cantidad solicitada (con tope de stock).
        //    Spread { ...producto } copia todas las propiedades del producto (id, nombre, precio, etc.)
        //    y le asignamos la cantidad con el tope.
      ]
    })
  }

//   const removeFromCart = (id) => {
//     // ↑ Quita un producto del carrito filtrando por id.
//     //    Elimina TODAS las unidades de ese producto, no solo una.
//     setCarrito((prev) => prev.filter((item) => item.id !== id))
//     // ↑ .filter devuelve un nuevo array SIN el item que tenga ese id.
//     //    Si el producto tenía cantidad > 1, se quita por completo.
//   }

//   const updateCantidad = (id, cantidad) => {
//     // ↑ Cambia la cantidad de un producto ya agregado en el carrito.
//     //    Si quantity < 1, no hace nada (para quitar se usa removeFromCart).
//     if (cantidad < 1) return
//     // ↑ No permitimos bajar de 1 cantidad. Si el usuario quiere quitarlo, usa removeFromCart.

//     setCarrito((prev) =>
//       prev.map((item) =>
//         item.id === id
//           ? { ...item, cantidad: Math.min(cantidad, item.stock) }
//           // ↑ Actualizamos la cantidad del item indicado, con tope de stock.
//           //    Si la nueva cantidad es mayor que el stock disponible, se limita al stock.
//           : item
//       )
//     )
//   }

//   const clearCart = () => setCarrito([])
//   // ↑ Vacía el carrito completo (deja el array en []).
//   //    Esto también dispara el useEffect de guardar en localStorage, así que se pierde
//   //    el carrito guardado y queda vacío.

  const getCantidadTotal = () =>
    // ↑ Suma TODAS las cantidades del carrito (para el contador del widget 🛒 en la NavBar).
    carrito.reduce((acc, item) => acc + item.cantidad, 0)
    // ↑ reduce: método de arrays que acumula un valor.
    //    Arranca en 0 (acc) y va sumando item.cantidad de cada producto del carrito.

  const getTotal = () =>
    // ↑ Calcula el total a pagar: cantidad × precio de cada producto, sumando todo.
    carrito.reduce((acc, item) => acc + item.cantidad * item.precio, 0)
    //    reduce acumula: arranca en 0 y suma (cantidad × precio) de cada item.

  return (
    <CartContext.Provider
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
    </CartContext.Provider>
  )
}

export function useCart() {
// ↑ Hook personalizado: la forma cómoda de leer el carrito y sus funciones desde
//    cualquier componente dentro de CartProvider.
//    En lugar de escribir useContext(CartContext) directamente, se usa este hook.
  return useContext(CartContext)
  // ↑ useContext devuelve TODO el value que pasamos arriba:
  //    { carrito, addToCart, removeFromCart, updateCantidad, clearCart,
  //    getCantidadTotal, getTotal }
}