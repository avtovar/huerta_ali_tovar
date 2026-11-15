// Traduce códigos de error de Firebase a mensajes claros en español
const MENSAJES = {
  'auth/invalid-email': 'El email no es válido.',
  'auth/missing-password': 'Ingresá tu contraseña.',
  'auth/invalid-credential': 'Email o contraseña incorrectos.',
  'auth/user-not-found': 'Email o contraseña incorrectos.',
  'auth/user-disabled': 'Esta cuenta está deshabilitada. Contactá al administrador.',
  'auth/wrong-password': 'Email o contraseña incorrectos.',
  'auth/email-already-in-use': 'Ya existe una cuenta con ese email.',
  'auth/operation-not-allowed': 'Este método de acceso no está habilitado en Firebase.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/too-many-requests': 'Demasiados intentos. Probá de nuevo en unos minutos.',
  'auth/network-request-failed': 'Sin conexión. Revisá tu internet.',
  'auth/quota-exceeded': 'Se alcanzó el límite de solicitudes. Intentá de nuevo más tarde.',
  'auth/api-key-not-valid.-please-pass-a-valid-api-key.': 'Firebase no está configurado (revisá el archivo .env).',
  'auth/invalid-api-key': 'Firebase no está configurado (revisá el archivo .env).',
  'permission-denied': 'No tenés permisos para realizar esta acción.',
  'unauthenticated': 'Tu sesión expiró. Iniciá sesión de nuevo e intentá otra vez.',
  'not-found': 'El producto que intentás actualizar ya no existe. Recargá la página e intentá otra vez.',
  'failed-precondition': 'No se pudo completar la operación por el estado actual de la base de datos.',
  'invalid-argument': 'Los datos del producto no son válidos. Revisalos e intentá otra vez.',
  aborted: 'La operación se interrumpió. Intentá de nuevo.',
  'already-exists': 'El registro ya existe. Recargá la página e intentá de nuevo.',
  cancelled: 'La operación fue cancelada. Intentá de nuevo.',
  'data-loss': 'No se pudieron leer los datos correctamente. Contactá al administrador.',
  'deadline-exceeded': 'La operación tardó demasiado. Revisá tu conexión e intentá de nuevo.',
  internal: 'Hubo un problema interno al procesar la operación. Intentá de nuevo.',
  'out-of-range': 'Uno de los valores está fuera del rango permitido. Revisá los datos.',
  'resource-exhausted': 'Se alcanzó un límite de uso. Intentá de nuevo más tarde.',
  unimplemented: 'Esta operación no está disponible en la configuración actual.',
  unknown: 'No se pudo completar la operación. Intentá de nuevo.',
  unavailable: 'No se pudo conectar con el servidor. Intentá de nuevo.',
}

export function mensajeError(error) {
  const codigo = error?.code
  const codigoFirestore = typeof codigo === 'string' ? codigo.replace(/^firestore\//, '') : undefined
  return MENSAJES[codigo]
    || MENSAJES[codigoFirestore]
    || (codigo ? `Ocurrió un error inesperado (código: ${codigo}). Intentá de nuevo.` : 'Ocurrió un error inesperado. Intentá de nuevo.')
}
