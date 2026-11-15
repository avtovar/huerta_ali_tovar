import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'

export async function obtenerEquipo() {
  const snap = await getDocs(collection(db, 'equipo'))
  return snap.docs
    .map((documento) => {
      const datos = documento.data()
      const nombre = typeof datos.nombre === 'string' ? datos.nombre.trim() : ''
      return {
        id: documento.id,
        nombre,
        rol: typeof datos.rol === 'string' ? datos.rol.trim() : '',
        frase: typeof datos.frase === 'string' ? datos.frase.trim() : '',
        inicial: typeof datos.inicial === 'string' && datos.inicial.trim()
          ? datos.inicial.trim().slice(0, 1).toUpperCase()
          : nombre.slice(0, 1).toUpperCase(),
      }
    })
    .filter((persona) => persona.nombre && persona.rol)
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
}
