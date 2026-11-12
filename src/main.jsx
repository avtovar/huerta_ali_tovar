import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ToastContainer } from 'react-toastify'

import 'bootstrap/dist/css/bootstrap.min.css'
// ↑ Estilos de Bootstrap (grilla, modal, spinner). Va ANTES de index.css para que los estilos propios tengan prioridad.
import 'react-toastify/dist/ReactToastify.css'
import './index.css'

import App from './App'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      {/* ↑ HelmetProvider: permite que cada página cambie el <title> y los <meta> */}
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        {/* ↑ basename: carpeta del dominio donde vive la app ('/' en dev, '/la-huerta-de-ali/' en GitHub Pages) */}
        <AuthProvider>
          {/* ↑ Sesión y rol del usuario, disponibles en toda la app */}
          <CartProvider>
            {/* ↑ Carrito global */}
            <App />
            <ToastContainer position="bottom-right" theme="dark" autoClose={2500} />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
)
