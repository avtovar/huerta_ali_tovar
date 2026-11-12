// ============================================================
// config.js — inicializa Firebase (Auth + Firestore)
// ============================================================
// Las credenciales se leen de variables de entorno de Vite (archivo .env).
// Solo las variables que empiezan con VITE_ llegan al navegador.
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// true solo si el .env está completo; la UI lo usa para avisar qué falta
export const firebaseConfigurado = Boolean(
  firebaseConfig.apiKey
    && firebaseConfig.authDomain
    && firebaseConfig.projectId
    && firebaseConfig.storageBucket
    && firebaseConfig.messagingSenderId
    && firebaseConfig.appId,
)

if (!firebaseConfigurado) {
  console.warn('Firebase no está configurado: copiá .env.example a .env y completá los valores.')
}

// Si falta la config usamos valores de relleno para que la app arranque igual
// (las operaciones fallarán y se mostrará el error en pantalla).
const app = initializeApp(
  firebaseConfigurado
    ? firebaseConfig
    : { apiKey: 'sin-configurar', projectId: 'sin-configurar', appId: 'sin-configurar' },
)

export const auth = getAuth(app)
export const db = getFirestore(app)
