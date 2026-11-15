import { Modal } from 'react-bootstrap'
import { FaTrash } from 'react-icons/fa'

function ModalConfirmar({
  mostrar, titulo, mensaje, onConfirmar, onCancelar, procesando,
  textoConfirmar = 'Sí, eliminar', textoProcesando = 'Eliminando...',
  icono: Icono = FaTrash, claseAccion = 'btn-peligro',
}) {
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
        <button type="button" className={`btn ${claseAccion}`} onClick={onConfirmar} disabled={procesando}>
          <Icono aria-hidden="true" /> {procesando ? textoProcesando : textoConfirmar}
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalConfirmar
