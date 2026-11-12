import './SearchBar.css'

// Barra de búsqueda controlada + filtro por categoría
function SearchBar({ busqueda, onBusqueda, categoria, onCategoria, categorias }) {
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
