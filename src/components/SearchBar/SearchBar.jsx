import './SearchBar.css'
// ↑ Importar los estilos CSS del componente SearchBar.
//    Define el layout .searchbar, .searchbar-input, .searchbar-select y la clase
//    .visually-hidden (para etiquetas que solo existen para accesibilidad, no se ven en pantalla).

// Barra de búsqueda controlada + filtro por categoría
function SearchBar({ busqueda, onBusqueda, categoria, onCategoria, categorias }) {
  //    Props que recibe este componente desde el padre (ItemListContainer):
  //    - busqueda: string con el texto actual del input (estado local del padre).
  //    - onBusqueda: función callback que el padre ejecuta cuando el usuario escribe.
  //      Actualiza el estado `busqueda` en el padre.
  //    - categoria: string con la categoría seleccionada actual (estado local del padre).
  //    - onCategoria: función callback que el padre ejecuta cuando el usuario cambia
  //      el selector de categoría.
  //    - categorias: array de strings con todas las categorías únicas del catálogo
  //      (ej. ["Verduras", "Frutas", "Raíces"]). Se usa para poblar el <select>.

  return (
    <div className="searchbar">
      <label className="visually-hidden" htmlFor="busqueda">Buscar producto</label>
      <input
        id="busqueda"
        type="search"
        className="searchbar-input"
        placeholder="Buscar verduras..."
        value={busqueda}
        onChange={(e) => onBusqueda(e.target.value)}
      />

      <label className="visually-hidden" htmlFor="categoria">Categoría</label>
      <select
        id="categoria"
        className="searchbar-select"
        value={categoria}
        onChange={(e) => onCategoria(e.target.value)}
      >
        <option value="">Todas las categorías</option>
        {categorias.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  )
}

export default SearchBar
// ↑ Exportamos el componente default para que sea usado por ItemListContainer.
//    Este componente es "controlado": su valor y comportamiento vienen completamente del padre.
//    ItemListContainer gestiona el state de busqueda y categoria, y pasa las funciones
//    de callback. SearchBar se encarga solo de mostrar y capturar la entrada del usuario.