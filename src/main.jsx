import React from 'react'
// ↑ importar React: nos permite crear componentes y elementos JSX

import ReactDOM from 'react-dom/client'
// ↑ importar ReactDOM: nos da createRoot para renderizar la app en el DOM

import { BrowserRouter } from 'react-router-dom'
// ↑ BrowserRouter: envuelve toda la app en enrutamiento SPA (single page app)
//    usa basename para saber en qué carpeta del dominio vive (import.meta.env.BASE_URL)

import { HelmetProvider } from 'react-helmet-async'
// ↑ HelmetProvider: permite que cada página cambie el <title> y los <meta>
//    tags para SEO por página (no hay que tocar el <head> manualmente)

import { ToastContainer } from 'react-toastify'
// ↑ ToastContainer: componente que muestra los toast (mensajes emergentes)
//    posición: bottom-right, tema oscuro, se auto-cierra después de 2500ms

import 'bootstrap/dist/css/bootstrap.min.css'
// ↑ Estilos de Bootstrap: grilla, modal, spinner, botones base.
//    Se importa ANTES de index.css para que los estilos propios tengan prioridad.
import 'react-toastify/dist/ReactToastify.css'

import './index.css'
// ↑ index.css: estilos globales (variables CSS, clases utilitarias .container, .btn, .page)
//    Se importa DESPUÉS de Bootstrap para que los estilos propios sobreescriban los de Bootstrap si hay conflicto.

import App from './App'
// ↑ App: componente raíz que configura las rutas (<Routes>/<Route>) y carga las páginas

import { AuthProvider } from './context/AuthContext'
// ↑ AuthProvider: proveedor de contexto que gestiona la sesión de Firebase Auth,
//    lee el rol (admin/user) del documento usuarios/{uid} en Firestore,
//    y expone `usuario`, `rol`, `esAdmin` a toda la app.

import { CartProvider } from './context/CartContext'
// ↑ CartProvider: proveedor de contexto que gestiona el carrito de compras global.
//    Usa localStorage para persistir el carrito al recargar la página.
//    Expone `carrito`, `addToCart`, `removeFromCart`, `updateCantidad`, `clearCart`,
//    `getCantidadTotal`, `getTotal` a todos los componentes hijos.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      {/* ↑ HelmetProvider: envuelve la app para que cada página pueda cambiar el <title> y los <meta> */}
      <BrowserRouter basename={import.meta.env.BASE_URL}>
      {/* ↑ basename: carpeta del dominio donde vive la app.
         - 'npm run dev' -> BASE_URL === '/'
         - 'npm run build' -> BASE_URL === '/huerta_ali_tavar/'
         Esto evita que las rutas relativas rompan el sitio en GitHub Pages. */}
        <AuthProvider>
        {/* ↑ AuthProvider: hace disponible la sesión y el rol en toda la app */}
          <CartProvider>
          {/* ↑ CartProvider: hace disponible el carrito global a todos los componentes */}
            <App />
            {/* ↑ App: se renderiza aquí, es el componente que tiene <Routes> */}
            <ToastContainer position="bottom-right" theme="dark" autoClose={2500} />
            {/* ↑ ToastContainer: muestra los mensajes de confirmación (agregar al carrito, etc.) */}
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
)
