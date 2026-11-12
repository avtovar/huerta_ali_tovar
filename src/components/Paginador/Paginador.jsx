import './Paginador.css'

// Paginador: Anterior / números / Siguiente. No se dibuja si hay una sola página.
function Paginador({ pagina, totalPaginas, onCambiar }) {
  if (totalPaginas <= 1) return null

  const numeros = Array.from({ length: totalPaginas }, (_, i) => i + 1)

  return (
    <nav className="paginador" aria-label="Paginación del catálogo">
      <button
        type="button"
        className="paginador-btn"
        disabled={pagina === 1}
        onClick={() => onCambiar(pagina - 1)}
      >
        ← Anterior
      </button>
      {numeros.map((n) => (
        <button
          key={n}
          type="button"
          className={'paginador-btn' + (n === pagina ? ' paginador-btn-activo' : '')}
          aria-current={n === pagina ? 'page' : undefined}
          onClick={() => onCambiar(n)}
        >
          {n}
        </button>
      ))}
      <button
        type="button"
        className="paginador-btn"
        disabled={pagina === totalPaginas}
        onClick={() => onCambiar(pagina + 1)}
      >
        Siguiente →
      </button>
    </nav>
  )
}

export default Paginador
