import { Navigate, useLocation } from 'react-router-dom'
// ↑ Navigate: componente de React Router que realiza una navegación imperativa (cambia de
//    ruta). Se usa aquí para redirigir al login si el usuario no tiene permisos.
//    El atributo `replace` reemplaza la entrada actual en el historial del navegador,
//    así que cuando el usuario dé "atrás" no vuelva a la ruta protegida bloqueada.
// ↑ useLocation: hook de React Router que devuelve la ubicación actual (la URL ruta,
//    state, etc.). Usamos esto para recordar a dónde quería ir el usuario antes de
//    intentar entrar a una ruta protegida sin estar logueado.

import { useAuth } from '../../context/AuthContext'
// ↑ useAuth: hook personalizado que lee el contexto de Auth (establecido por AuthProvider).
//    Destructuramos: usuario (objeto de sesión), rol ( 'admin' | 'user' | null ),
//    y cargando (boolean mientras Firebase verifica la sesión).

import Cargando from '../Cargando/Cargando'
// ↑ Cargando: componente de UI que muestra un spinner + texto mientras tanto.
//    Se usa aquí mientras Firebase verifica si el usuario tiene sesión activa (para
//    evitar que el usuario vea un flash de contenido público mientras se verifica).

import Seo from '../Seo/Seo'
// ↑ Seo: componente que cambia el <title> y los <meta> tags para SEO por página.
//    Se usa en la pantalla de "acceso restringido" para setear un título apropiado.

// Componente wrapper que protege rutas que requieren autenticación y roles específicos.
//    Se usa en App.jsx para las rutas: /perfil, /panel, /admin/cupones.

function RutaProtegida({ children, rolesPermitidos }) {
  // ↑ Props:
  //    - children: los componentes que queremos proteger (ej. <Perfil />, <Panel />).
  //    - rolesPermitidos: array opcional (ej. ['admin']) que indica qué roles pueden
  //      entrar. Si no se provee, solo se verifica que haya sesión (cualquier usuario
  //      logueado puede entrar, tanto admin como user).

  const { usuario, rol, cargando } = useAuth()
  //    Desestructuramos el estado de autenticación.
  //    - usuario: null si nadie está logueado, o el objeto de sesión de Firebase.
  //    - rol: 'admin' | 'user' | null, leído del documento usuarios/{uid} en Firestore.
  //    - cargando: true mientras Firebase verifica la sesión (usoEffect initial).

  const location = useLocation()
  //    URL actual de la página. La guardaremos en state para redirigir después del login.

  if (cargando) return <Cargando texto="Verificando sesión..." />
  //    Mientras Firebase verifica si hay sesión (al recargar la página), mostramos un
  //    spinner de carga para evitar que el usuario vea contenido que después cambiaría.
  //    Esto evita "parpadeos" visuales (flash de contenido público → redirección).

  if (!usuario) {
    //    Si no hay usuario logueado (cargando terminó y usuario sigue siendo null).
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
    //    Redirigimos a la página de login.
    //    `replace: true` reemplaza la URL actual en el historial, así que el usuario no
    //    puede presionar "atrás" y volver a la ruta protegida (quedaría bloqueada otra vez).
    //    `state={{ from: location.pathname }}`: guarda la ruta original en el state de la
    //    navegación, para que después del login podamos redirigirlo de vuelta a donde
    //    quería entrar originalmente.
  }

  if (rolesPermitidos && !rolesPermitidos.includes(rol)) {
    //    Si el usuario SÍ tiene sesión, pero su rol NO está en la lista de permitidos.
    //    Ejemplo: rolesPermitidos=['admin'] y el usuario es 'user'.
    return (
      <div className="page container texto-centrado">
        <Seo titulo="Acceso restringido" />
        <h2>Acceso restringido</h2>
        <p>Tu cuenta no tiene permisos para ver esta sección.</p>
      </div>
    )
  }

  //    Si passed todas las verificaciones arriba, el usuario tiene sesión y su rol es
  //    compatible. Devolvemos los children (la página real que el usuario pidió).
  return children
}

export default RutaProtegida
// ↑ Exportamos el componente para usarlo en App.jsx envuelto en las rutas privadas.
//    La lógica fluida: si no hay usuario -> login (guardando la ruta original).
//    Si hay usuario pero rol incorrecto -> pantalla de "acceso restringido".
//    Si hay usuario y rol correcto -> mostrar la página solicitada.
