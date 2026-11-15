import './Paginador.css'
// ↑ Importar los estilos CSS del componente Paginador.
//    Define el layout .paginador, .paginador-btn, .paginador-btn-activo y la posición
//    y apariencia de los botones de navegación.

// Paginador: Anterior / números / Siguiente. No se dibuja si hay una sola página.
function Paginador({ pagina, totalPaginas, onCambiar }) {
  //    Props:
  //    - pagina: número actual de la página que el usuario está viendo (empieza en 1).
  //    - totalPaginas: cuántas páginas hay en total (calculado en el padre).
  //    - onCambiar: función callback que el padre ejecuta cuando el usuario hace clic
    //      en un número de página o en los botones "Anterior/Siguiente".

  if (totalPaginas <= 1) return null
  //    Si solo hay una página (o ninguno), no mostramos el componente de paginación
  //    porque no hace falta navegar a otra parte. Devolvemos null para no renderizar nada.

  const numeros = Array.from({ length: totalPaginas }, (_, i) => i + 1)
  //    Generamos un array con los números de 1 hasta totalPaginas.
  //    Ejemplo: si totalPaginas es 3, numeros = [1, 2, 3].
  //    El segundo parámetro (_, i) es el índice: _ es el valor (ignoramos), i es el índice
  //    (0, 1, 2, ...). Sumamos 1 porque las páginas humanamente empiezan en 1, no en 0.

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
// ↑ Exportamos el componente default para que sea usado por ItemListContainer.
//    Este componente es "presentacional": se encarga de mostrar los botones de navegación
//    de página, pero la lógica de qué productos mostrar corresponde al padre
//    (ItemListContainer), que tiene el state `pagina` y la función `setPagina`.
