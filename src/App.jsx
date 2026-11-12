import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

import Layout from './components/Layout/Layout'
import RutaProtegida from './components/RutaProtegida/RutaProtegida'

import Home from './pages/Home'
import Productos from './pages/Productos'
import ProductoDetalle from './pages/ProductoDetalle'
import Carrito from './pages/Carrito'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Cargando from './components/Cargando/Cargando'
import NotFound from './pages/NotFound'

// Code splitting: el Panel y el Perfil se descargan solo cuando se entra a esas rutas
const Perfil = lazy(() => import('./pages/Perfil'))
const Panel = lazy(() => import('./pages/Panel'))

function App() {
  return (
    <Suspense fallback={<Cargando texto="Cargando..." />}>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="productos" element={<Productos />} />
        <Route path="producto/:id" element={<ProductoDetalle />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />

        {/* Rutas protegidas: /perfil exige sesión; /panel exige sesión + rol admin */}
        <Route
          path="perfil"
          element={
            <RutaProtegida>
              <Perfil />
            </RutaProtegida>
          }
        />
        <Route
          path="panel"
          element={
            <RutaProtegida rolesPermitidos={['admin']}>
              <Panel />
            </RutaProtegida>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
    </Suspense>
  )
}

export default App
