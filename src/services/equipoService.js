import { collection, getDocs } from 'firebase/firestore'
// ↑ importar funciones de Firestore: collection para apuntar a una colección,
//    getDocs para leer todos los documentos de esa colección.

import { db } from '../firebase/config'
// ↑ db: instancia de Firestore inicializada en config.js. Si el archivo .env no tiene
//    todas las VITE_FIREBASE_*, esta será una app "sin configurar" y las operaciones
//    fallarán mostrándose un aviso en la UI.

export async function obtenerEquipo() {
  // ↑ Lectura de la colección 'equipo' en Firestore.
  //    El equipo se muestra en el pie de página (Footer) y tiene campos:
  //    nombre, rol, frase, inicial. Cada documento es una persona del equipo.
  const snap = await getDocs(collection(db, 'equipo'))
  return snap.docs
    .map((documento) => {
      // ↑ .map: transforma cada documento en un objeto plano con los campos que necesitamos.
      const datos = documento.data()
      // ↑ datos son todos los campos del documento en Firestore (nombre, rol, frase, inicial).

      const nombre = typeof datos.nombre === 'string' ? datos.nombre.trim() : ''
      // ↑ Si el nombre no es string (o viene vacío), usamos cadena vacía para evitar errores.

      return {
        id: documento.id,
        // ↑ id: el identificador único que asigna Firebase a cada documento.
        nombre,
        rol: typeof datos.rol === 'string' ? datos.rol.trim() : '',
        // ↑ rol: rol de la persona (ej. "Admin", "Gerente", "Fundador").
        frase: typeof datos.frase === 'string' ? datos.frase.trim() : '',
        // ↑ frase: una frase motivacional o personal de la persona.
        inicial: typeof datos.inicial === 'string' && datos.inicial.trim()
          ? datos.inicial.trim().slice(0, 1).toUpperCase()
          : nombre.slice(0, 1).toUpperCase(),
        // ↑ inicial: primera letra del nombre (en mayúscula).
        //    Si Firestore tiene el campo, usamos el de allí; si no, nos basamos en el nombre.
      }
    })
    .filter((persona) => persona.nombre && persona.rol)
    // ↑ .filter: solo incluimos personas que tengan nombre Y rol definidos.
    //    Esto evita entradas vacías o incompletas del equipo.
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
    // ↑ .sort: ordena el array alfabéticamente por nombre, ignorando tildes (español).
}
