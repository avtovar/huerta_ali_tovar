import {
  collection, deleteDoc, doc, getDocs, runTransaction, updateDoc,
} from 'firebase/firestore'
// ↑ importar funciones de Firestore necesarias para el CRUD de cupones.
//    runTransaction se usa para operaciones atómicas (evitar cupones duplicados).

import { db } from '../firebase/config'
// ↑ db: instancia de Firestore inicializada en config.js. Requiere que el archivo .env
//    tenga todas las VITE_FIREBASE_*; si falta, las operaciones fallarán y la UI lo avisará.

function limpiar(datos) {
  // función limpiar: normaliza los datos del formulario antes de guardarlos en Firestore.
  //    - código: mayúsculas, sin espacios extra.
  //    - descuento: convierte a número (puede venir como string del input type="number").
  //    - fechaVencimiento: tal como viene (puede ser vacío o string de date).
  //    - activo: asegura que sea un booleano (checkbox checked/unchecked).
  return {
    codigo: datos.codigo.trim().toUpperCase(),
    descuento: Number(datos.descuento),
    fechaVencimiento: datos.fechaVencimiento,
    activo: Boolean(datos.activo),
  }
}

// ── Lectura ────────────────────────────────────────────────

export async function obtenerCupones() {
  // ↑ Lee TODOS los cupones de la colección 'cupones' en Firestore.
  //    Devuelve un array ordenado por código (orden alfabético).
  const snap = await getDocs(collection(db, 'cupones'))
  return snap.docs
    .map((documento) => ({ id: documento.id, ...documento.data() }))
    .sort((a, b) => a.codigo.localeCompare(b.codigo, 'es'))
}

// ── Escritura ───────────────────────────────────────────────

export async function crearCupon(datos) {
  // ↑ Crea un nuevo cupón en Firestore usando una transacción.
  //    Esto evita que dos usuarios intenten crear el mismo código al mismo tiempo.
  const cupon = limpiar(datos)
  const referencia = doc(db, 'cupones', cupon.codigo) // usamos el código como ID único

  await runTransaction(db, async (transaccion) => {
    // ↑ runTransaction: asegura que la operación sea atómica.
    //    Si falla parte de la transacción, se revierte automáticamente.
    const existente = await transaccion.get(referencia)
    if (existente.exists()) {
      // Si ya existe un cupón con ese código, lanzamos un error.
      const error = new Error('Ya existe un cupón con ese código.')
      error.code = 'already-exists'
      throw error
    }
    transaccion.set(referencia, cupon)
    // Si no existe, guardamos el nuevo cupón.
  })
}

export async function actualizarCupon(id, datos) {
  // ↑ Actualiza un cupón existente en Firestore.
  //    Usamos el parámetro `id` (el documento ID en Firestore, no el código).
  await updateDoc(doc(db, 'cupones', id), limpiar(datos))
}

export async function eliminarCupon(id) {
  // ↑ Elimina un cupón de Firestore por su ID de documento.
  await deleteDoc(doc(db, 'cupones', id))
}
