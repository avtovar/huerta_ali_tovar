import { Modal } from 'react-bootstrap'
import { FaTrash } from 'react-icons/fa'

// Modal de confirmación (se usa antes de eliminar un producto)
function ModalConfirmar({ mostrar, titulo, mensaje, onConfirmar, onCancelar, procesando }) {
  return (
    <Modal show={mostrar} onHide={onCancelar} centered contentClassName="modal-oscuro">
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title>{titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{mensaje}</Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn btn-outline" onClick={onCancelar} disabled={procesando}>
          Cancelar
        </button>
        <button type="button" className="btn btn-peligro" onClick={onConfirmar} disabled={procesando}>
          <FaTrash aria-hidden="true" /> {procesando ? 'Eliminando...' : 'Sí, eliminar'}
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalConfirmar
