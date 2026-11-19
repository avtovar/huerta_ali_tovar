import { Outlet } from 'react-router-dom'
// ↑ Outlet: el "hueco" donde React dibuja la página según la ruta actual.

import Header from '../Header/Header'
// ↑ Encabezado con el logo de la verdulería.

import NavBar from '../NavBar/NavBar'
// ↑ Barra de navegación (links + carrito).

import Footer from '../Footer/Footer'
// ↑ Pie de página (contacto, newsletter, equipo).

import './Layout.css'
// ↑ Estilos propios del layout (columnas y altura mínima).

function Layout() {
// ↑ Componente "plantilla": envuelve todas las páginas para que compartan estructura
  return (
    <div className="layout">
      {/* ↑ Contenedor flex en columna que ocupa toda la pantalla */}
      <Header />
      <NavBar />
      <main className="layout-main">
        {/* ↑ main: la zona central; crece sola para empujar el footer hacia abajo */}
        <Outlet />
        {/* ↑ Aquí se "inyecta" la página de la ruta (Home, Productos, Carrito, etc.) */}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
// ↑ Exportamos el Layout para usarlo como elemento raíz de las rutas en App.jsx