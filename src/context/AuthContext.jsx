import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, updateProfile,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  // ↑ usuario: objeto de Firebase Auth (null = no logueado)
  const [rol, setRol] = useState(null)
  // ↑ rol: 'admin' | 'user' (se lee del documento usuarios/{uid} en Firestore)
  const [cargando, setCargando] = useState(true)
  // ↑ true hasta que Firebase informa si hay sesión: evita "parpadeos" de login

  useEffect(() => {
    // onAuthStateChanged avisa cada vez que alguien entra o sale (y al recargar la página)
    const cancelar = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setUsuario(null)
        setRol(null)
        setCargando(false)
        return
      }
      try {
        const snap = await getDoc(doc(db, 'usuarios', u.uid))
        setRol(snap.exists() ? snap.data().rol : 'user')
      } catch (e) {
        console.error('No se pudo leer el rol:', e)
        setRol('user')
      }
      setUsuario(u)
      setCargando(false)
    })
    return cancelar
  }, [])

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password)

  const registro = async (nombre, email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: nombre })
    // Perfil con rol 'user'. El rol 'admin' se asigna a mano desde la consola de Firebase.
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
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
