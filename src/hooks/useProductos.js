import { useCallback, useEffect, useState } from 'react'
import { obtenerProductos } from '../services/productosService'
import { mensajeError } from '../utils/errores'

// Hook que carga el catálogo desde Firestore y expone { productos, cargando, error, recargar }
export function useProductos() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const recargar = useCallback(async () => {
    setCargando(true)
    setError('')
    try {
      setProductos(await obtenerProductos())
    } catch (e) {
      console.error('Error al cargar los productos:', e)
      setError(mensajeError(e))
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    recargar()
  }, [recargar])

  return { productos, cargando, error, recargar }
}
