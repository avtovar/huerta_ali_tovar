import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import RutaProtegida from './components/RutaProtegida/RutaProtegida'
import Cargando from './components/Cargando/Cargando'
import NotFound from './pages/NotFound'

const Home = lazy(() => import('./pages/Home'))
const Productos = lazy(() => import('./pages/Productos'))
const ProductoDetalle = lazy(() => import('./pages/ProductoDetalle'))
const Carrito = lazy(() => import('./pages/Carrito'))
const Login = lazy(() => import('./pages/Login'))
const Registro = lazy(() => import('./pages/Registro'))
const Perfil = lazy(() => import('./pages/Perfil'))
const Panel = lazy(() => import('./pages/Panel'))
const GestionCupones = lazy(() => import('./pages/GestionCupones'))

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
          <Route
            path="admin/cupones"
            element={
              <RutaProtegida rolesPermitidos={['admin']}>
                <GestionCupones />
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