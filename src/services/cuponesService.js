import {
  collection, deleteDoc, doc, getDocs, runTransaction, updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase/config'

function limpiar(datos) {
  return {
    codigo: datos.codigo.trim().toUpperCase(),
    descuento: Number(datos.descuento),
    fechaVencimiento: datos.fechaVencimiento,
    activo: Boolean(datos.activo),
  }
}

export async function obtenerCupones() {
  const snap = await getDocs(collection(db, 'cupones'))
  return snap.docs
    .map((documento) => ({ id: documento.id, ...documento.data() }))
    .sort((a, b) => a.codigo.localeCompare(b.codigo, 'es'))
}

export async function crearCupon(datos) {
  const cupon = limpiar(datos)
  const referencia = doc(db, 'cupones', cupon.codigo)

  await runTransaction(db, async (transaccion) => {
    const existente = await transaccion.get(referencia)
    if (existente.exists()) {
      const error = new Error('Ya existe un cupón con ese código.')
      error.code = 'already-exists'
      throw error
    }
    transaccion.set(referencia, cupon)
  })
}

export async function actualizarCupon(id, datos) {
  await updateDoc(doc(db, 'cupones', id), limpiar(datos))
}

export async function eliminarCupon(id) {
  await deleteDoc(doc(db, 'cupones', id))
}
