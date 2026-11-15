// ============================================================
// config.js — inicializa Firebase (Auth + Firestore)
// ============================================================
// Este archivo configura la conexión con Firebase Auth y Firestore.
// Las credenciales se leen de variables de entorno de Vite (archivo .env).
// Importante: solo las variables que empiezan con `VITE_` llegarán al navegador;
// las demás deben quedarse en el lado del servidor (Node.js/Cloud Functions).
//
// Estructura esperada en .env (ejemplo en .env.example):
//   VITE_FIREBASE_API_KEY=...
//   VITE_FIREBASE_AUTH_DOMAIN=...
//   VITE_FIREBASE_PROJECT_ID=...
//   VITE_FIREBASE_STORAGE_BUCKET=...
//   VITE_FIREBASE_MESSAGING_SENDER_ID=...
//   VITE_FIREBASE_APP_ID=...

import { initializeApp } from 'firebase/app'
// ↑ importar initializeApp: la función principal que configura Firebase con tus credenciales.

import { getAuth } from 'firebase/auth'
// ↑ importar getAuth: crea y devuelve la instancia de Firebase Auth (maneja sesiones, login, logout, etc.).

import { getFirestore } from 'firebase/firestore'
// ↑ importar getFirestore: crea y devuelve la instancia de Firestore (base de datos en tiempo real).

// Objeto de configuración: lee las variables de entorno de .env.
//    import.meta.env.VITE_... funcionan en Vite al compilar para producción.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// true solo si el .env está completo; la UI lo usa para avisar qué falta.
// Verifica que todas las credenciales esenciales estén definidas.
export const firebaseConfigurado = Boolean(
  firebaseConfig.apiKey
    && firebaseConfig.authDomain
    && firebaseConfig.projectId
    && firebaseConfig.storageBucket
    && firebaseConfig.messagingSenderId
    && firebaseConfig.appId,
)

// Si falta la config, mostramos un aviso en la consola del navegador.
// La app todavía arranca (con datos de respaldo) para no romper el UI.
if (!firebaseConfigurado) {
  console.warn('Firebase no está configurado: copiá .env.example a .env y completá los valores.')
}

// Si falta la config usamos valores de relleno para que la app arranque igual
// (las operaciones fallarán y se mostrará el error en pantalla, y los avisos en UI).
const app = initializeApp(
  firebaseConfigurado
    ? firebaseConfig
    : { apiKey: 'sin-configurar', projectId: 'sin-configurar', appId: 'sin-configurar' }
)

// Exportamos las instancias de Auth y Firestore para usar en todo el proyecto.
// Si el .env estaba incompleto, estas serán instancias "vacías" pero la app no se rompe.
export const auth = getAuth(app)
export const db = getFirestore(app)