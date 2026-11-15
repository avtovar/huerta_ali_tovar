import { Spinner } from 'react-bootstrap'

function Cargando({ texto = 'Cargando productos...' }) {
  return (
    <div className="cargando" role="status">
      <Spinner animation="border" size="sm" className="cargando-spinner" />
      <span>{texto}</span>
    </div>
  )
}

export default Cargando
