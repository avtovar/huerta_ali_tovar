import { useCallback, useEffect, useState } from 'react'
import { obtenerProductos, obtenerProductosIniciales } from '../services/productosService'
import { firebaseConfigurado } from '../firebase/config'
import { mensajeError } from '../utils/errores'

// Hook que carga el catálogo desde Firestore y expone { productos, cargando, error, recargar }
export function useProductos() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [aviso, setAviso] = useState('')

  const recargar = useCallback(async () => {
    setCargando(true)
    setError('')
    setAviso('')
    try {
      if (!firebaseConfigurado) {
        setProductos(await obtenerProductosIniciales())
        setAviso('Mostrando el catálogo inicial. Configurá Firebase para administrar productos.')
        return
      }

      try {
        const lista = await obtenerProductos()
        if (lista.length > 0) {
          setProductos(lista)
          return
        }

        setProductos(await obtenerProductosIniciales())
        setAviso('Firestore todavía no tiene productos; se muestra el catálogo inicial.')
      } catch (e) {
        console.error('Error al cargar productos de Firestore:', e)
        setProductos(await obtenerProductosIniciales())
        setAviso(`No se pudo cargar Firestore (${mensajeError(e)}). Se muestra el catálogo inicial.`)
      }
    } catch (e) {
      console.error('Error al cargar el catálogo:', e)
      setError(mensajeError(e))
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    recargar()
  }, [recargar])

  return { productos, cargando, error, aviso, recargar }
}
