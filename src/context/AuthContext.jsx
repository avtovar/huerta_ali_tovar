import { createContext, useContext, useEffect, useState } from 'react'
// ↑ createContext: crea un "contexto" que permite compartir valores (estado, funciones)
//    entre componentes sin necesidad de pasar props de mano en mano.

import {
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, updateProfile,
} from 'firebase/auth'
// ↑ onAuthStateChanged: función de Firebase que avisa cada vez que alguien entra o sale
//    de la sesión (incluye al recargar la página).
//    Escucha cambios de autenticación en tiempo real.

// ↑ signInWithEmailAndPassword: para iniciar sesión con email y contraseña.
// ↑ createUserWithEmailAndPassword: para crear una nueva cuenta.
// ↑ signOut: para cerrar sesión.
// ↑ updateProfile: para actualizar el perfil del usuario (displayName, foto, etc.).

import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
// ↑ doc: crea una referencia a un documento en Firestore.
// ↑ getDoc: lee los datos de un documento.
// ↑ setDoc: guarda/datos un documento nuevo.
// ↑ serverTimestamp: guarda una marca de tiempo que sincroniza con el servidor de Firebase.

import { auth, db } from '../firebase/config'
// ↑ auth: instancia de Firebase Auth (sesión de usuario actual).
// ↑ db: instancia de Firestore (base de datos en tiempo real).

const AuthContext = createContext()
// ↑ Creamos un contexto vacío. Después lo "llenaremos" con el Provider que está más abajo.

export function AuthProvider({ children }) {
// ↑ AuthProvider: el componente que ENVUELLE la app y le da acceso al estado de/auth.
//    Los hijos de este provider pueden leer usuario, rol y funciones de login/logout.

  const [usuario, setUsuario] = useState(null)
// ↑ usuario: objeto de Firebase Auth (null = no logueado).
//    Cuando hay una sesión, contiene uid, email, displayName, etc.
//    Cuando el usuario cierra sesión, vuelve a null.

  const [rol, setRol] = useState(null)
// ↑ rol: 'admin' | 'user' (se lee del documento usuarios/{uid} en Firestore).
//    Si no existe el documento, el usuario es rol 'user' por defecto.

  const [cargando, setCargando] = useState(true)
// ↑ true hasta que Firebase informa si hay sesión: evita "parpadeos" de login
//    en la pantalla cuando la sesión cambia al recargar la página.

  useEffect(() => {
    // ↑ useEffect: se ejecuta una vez cuando el componente se monta.
    //    Aquí nos suscribimos a los cambios de auth de Firebase.

    // onAuthStateChanged avisa cada vez que alguien entra o sale (y al recargar la página)
    const cancelar = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        // Si no hay usuario logueado (se cerró sesión o se expiró el token)
        setUsuario(null)
        setRol(null)
        setCargando(false)
        return
      }
      try {
        // Leer el documento del usuario en Firestore para obtener su rol
        const snap = await getDoc(doc(db, 'usuarios', u.uid))
        setRol(snap.exists() ? snap.data().rol : 'user')
      } catch (e) {
        console.error('No se pudo leer el rol:', e)
        setRol('user') // Si falla la lectura, asumimos rol 'user' por seguridad
      }
      setUsuario(u)
      setCargando(false)
    })
    // Retornamos una función de limpieza: Firebase deja de avisar cuando el componente se desmonta
    return cancelar
  }, [])

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password)

  const registro = async (nombre, email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: nombre })
    await setDoc(doc(db, 'usuarios', cred.user.uid), {
      nombre, email, rol: 'user', creadoEn: serverTimestamp(),
    })
    setUsuario({ ...cred.user, displayName: nombre })
    setRol('user')
  }

  const logout = () => signOut(auth)

  return (
    <AuthContext.Provider
      value={{ usuario, rol, esAdmin: rol === 'admin', cargando, login, registro, logout }}
    >
      {/* ↑ AuthContext.Provider: proveedor que "expone" el valor del contexto a todos los hijos.
         El valor incluye: usuario, rol, esAdmin (computed), cargando, y las funciones. */}
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
// ↑ Hook personalizado: la forma cómoda de leer el contexto Auth desde cualquier componente.
//    En lugar de usar useContext(AuthContext) directamente, se usa este hook.
  return useContext(AuthContext)
  // ↑ useContext devuelve TODO el value que pasamos arriba:
  //    { usuario, rol, esAdmin, cargando, login, registro, logout }
}