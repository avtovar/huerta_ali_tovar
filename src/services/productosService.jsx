// ============================================================
// productosService.js — acceso a la colección "productos" de Firestore
// ============================================================
// Centraliza las operaciones CRUD para que los componentes no hablen
// directo con Firebase. Todas las funciones aquí expuestas son asíncronas
// y manejan errores de forma consistente.
//
// Áreas principales:
//  - Lectura: obtenerProductosIniciales, obtenerProductos, obtenerProducto
//  - Escritura: crearProducto, actualizarProducto, eliminarProducto
//  - Carga masiva: cargarProductosIniciales (copia JSON → Firestore)
//
// El helper `rutaPublica()` se usa para leer el JSON de respaldo desde public/,
// anteponiendo el prefijo correcto según el entorno (dev vs GitHub Pages).

import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, writeBatch,
} from 'firebase/firestore'
// ↑ importar las funciones CRUD de Firestore: collection, doc, getDocs, getDoc,
//    addDoc, updateDoc, deleteDoc, writeBatch. Sirven para hablar con la BD.

import { db } from '../firebase/config'
// ↑ db: instancia de Firestore ya inicializada en config.js (lee variables VITE_FIREBASE_*).
//    Solo está disponible si el .env está completo; si no, la app muestra aviso.

import { rutaPublica } from '../utils/rutasPublicas'
// ↑ rutaPublica(): helper que construye la URL correcta a un archivo en public/.
//    Antepone el prefijo /huerta_ali_tavar/ en build de GitHub Pages, o / en dev.
//    Evita 404 al cargar imágenes o el JSON del catálogo.

const coleccion = collection(db, 'productos')
// ↑ const coleccion: atajo para no escribir collection(db, 'productos') siempre.
//    Apunta a la colección "productos" en Firestore.

// Normaliza lo que viene de un formulario (todo texto) a los tipos correctos
// función limpiar: quita espacios en blanco y convierte tipos (string → Number).
// Esto asegura que los datos guardados en Firestore tengan el formato correcto.

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

// ── Lectura ────────────────────────────────────────────────

export async function obtenerProductosIniciales() {
  // ↑ Obtiene el catálogo desde public/productos.json (archivo estático).
  //    Se usa como respaldo si Firebase no está configurado o Firestore está vacío.
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

export async function obtenerProductos() {
  // ↑ Lee TODOS los productos desde la colección Firestore 'productos'.
  //    Devuelve un array ordenado alfabéticamente por nombre (localeCompare en español).
  const snap = await getDocs(coleccion)
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
}

export async function obtenerProducto(id) {
  // ↑ Busca un producto específico por su ID en Firestore.
  //    Retorna el objeto con su id incluido, o null si no existe.
  const snap = await getDoc(doc(db, 'productos', id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

// ── Escritura ───────────────────────────────────────────────

export async function crearProducto(datos) {
  // ↑ Crea un nuevo producto en la colección Firestore.
  //    Recibe los datos del formulario, los normaliza con limpiar() y los guarda.
  const ref = await addDoc(coleccion, limpiar(datos))
  return ref.id   // Devuelve el ID que Firebase asignó automáticamente.
}

export async function actualizarProducto(id, datos) {
  // ↑ Actualiza un producto existente en Firestore.
  //    Usa una transacción suave (updateDoc) para modificar solo los campos cambiados.
  await updateDoc(doc(db, 'productos', id), limpiar(datos))
}

export async function eliminarProducto(id) {
  // ↑ Elimina un producto de Firestore por su ID.
  await deleteDoc(doc(db, 'productos', id))
}

// ── Carga inicial masiva ─────────────────────────────────────

export async function cargarProductosIniciales(lista) {
  // ↑ Copia los productos desde public/productos.json y los guarda en Firestore.
  //    Usa writeBatch para escribir en lote (más eficiente que llamadas individuales).
  //    Cada producto se guarda como un documento con su ID numérico en la colección 'productos'.

  const batch = writeBatch(db)
  // ↑ writeBatch: permite escribir múltiples documentos en una sola operación atómica.

  lista.forEach(({ id, ...resto }) => {
    // ↑ Destructuring: separa el ID del resto de datos.
    //    String(id) asegura que el ID sea string (Firestore requiere strings en doc()).
    batch.set(doc(db, 'productos', String(id)), resto)
  })
  await batch.commit()
  // ↑ commit(): ejecuta todas las escrituras del batch de una vez.
}
