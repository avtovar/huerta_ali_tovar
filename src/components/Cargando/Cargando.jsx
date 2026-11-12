import { Spinner } from 'react-bootstrap'

// Indicador de carga reutilizable (spinner + texto)
function Cargando({ texto = 'Cargando productos...' }) {
  return (
    <div className="cargando" role="status">
      <Spinner animation="border" size="sm" className="cargando-spinner" />
      <span>{texto}</span>
    </div>
  )
}

export default Cargando
