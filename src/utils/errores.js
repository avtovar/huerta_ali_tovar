// Traduce códigos de error de Firebase a mensajes claros en español
const MENSAJES = {
  'auth/invalid-email': 'El email no es válido.',
  'auth/missing-password': 'Ingresá tu contraseña.',
  'auth/invalid-credential': 'Email o contraseña incorrectos.',
  'auth/user-not-found': 'Email o contraseña incorrectos.',
  'auth/wrong-password': 'Email o contraseña incorrectos.',
  'auth/email-already-in-use': 'Ya existe una cuenta con ese email.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/too-many-requests': 'Demasiados intentos. Probá de nuevo en unos minutos.',
  'auth/network-request-failed': 'Sin conexión. Revisá tu internet.',
  'auth/api-key-not-valid.-please-pass-a-valid-api-key.': 'Firebase no está configurado (revisá el archivo .env).',
  'auth/invalid-api-key': 'Firebase no está configurado (revisá el archivo .env).',
  'permission-denied': 'No tenés permisos para realizar esta acción.',
  unavailable: 'No se pudo conectar con el servidor. Intentá de nuevo.',
}

export function mensajeError(error) {
  return MENSAJES[error?.code] || 'Ocurrió un error inesperado. Intentá de nuevo.'
}
