// ============================================================
// productosService.js — acceso a la colección "productos" de Firestore
// ============================================================
// Centraliza las operaciones CRUD para que los componentes no hablen
// directo con Firebase.
import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, writeBatch,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { rutaPublica } from '../utils/rutasPublicas'

const coleccion = collection(db, 'productos')

export async function obtenerProductosIniciales() {
  const respuesta = await fetch(rutaPublica('productos.json'))
  if (!respuesta.ok) {
    throw new Error(`No se pudo cargar el catálogo inicial (HTTP ${respuesta.status}).`)
  }

  const productos = await respuesta.json()
  if (!Array.isArray(productos)) {
    throw new Error('El catálogo inicial no tiene un formato válido.')
  }

  return productos
}

// Normaliza lo que viene de un formulario (todo texto) a los tipos correctos
function limpiar(datos) {
  return {
    nombre: datos.nombre.trim(),
    categoria: datos.categoria.trim(),
    precio: Number(datos.precio),
    unidad: datos.unidad,
    stock: Number(datos.stock),
    descripcion: datos.descripcion.trim(),
    imagen: datos.imagen.trim(),
  }
}

export async function obtenerProductos() {
  const snap = await getDocs(coleccion)
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
}

export async function obtenerProducto(id) {
  const snap = await getDoc(doc(db, 'productos', id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function crearProducto(datos) {
  const ref = await addDoc(coleccion, limpiar(datos))
  return ref.id
}

export async function actualizarProducto(id, datos) {
  await updateDoc(doc(db, 'productos', id), limpiar(datos))
}

export async function eliminarProducto(id) {
  await deleteDoc(doc(db, 'productos', id))
}

// Carga inicial: copia los productos de public/productos.json a Firestore
export async function cargarProductosIniciales(lista) {
  const batch = writeBatch(db)
  lista.forEach(({ id, ...resto }) => {
    batch.set(doc(db, 'productos', String(id)), resto)
  })
  await batch.commit()
}
