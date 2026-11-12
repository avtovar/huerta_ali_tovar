import { useMemo, useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import Item from '../Item/Item'
import SearchBar from '../SearchBar/SearchBar'
import Paginador from '../Paginador/Paginador'
import Cargando from '../Cargando/Cargando'
import { useProductos } from '../../hooks/useProductos'
import './ItemListContainer.css'

const POR_PAGINA = 8

// Quita tildes y pasa a minúsculas para que "limon" encuentre "Limón"
const normalizar = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

// Props:
//  - saludo: título de la sección
//  - limite: si se indica (ej. en Home), muestra solo esa cantidad, sin búsqueda ni paginador
function ItemListContainer({ saludo, limite }) {
  const { productos, cargando, error, recargar } = useProductos()
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('')
  const [pagina, setPagina] = useState(1)

  const categorias = useMemo(
    () => [...new Set(productos.map((p) => p.categoria))].sort((a, b) => a.localeCompare(b, 'es')),
    [productos]
  )

  const filtrados = useMemo(() => {
    const q = normalizar(busqueda.trim())
    return productos.filter(
      (p) =>
        (!categoria || p.categoria === categoria) &&
        (!q || normalizar(p.nombre).includes(q) || normalizar(p.categoria).includes(q))
    )
  }, [productos, busqueda, categoria])

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA))
  const paginaActual = Math.min(pagina, totalPaginas)
  const visibles = limite
    ? filtrados.slice(0, limite)
    : filtrados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA)

  // Al cambiar un filtro volvemos a la página 1
  const onBusqueda = (v) => { setBusqueda(v); setPagina(1) }
  const onCategoria = (v) => { setCategoria(v); setPagina(1) }

  return (
    <div className="item-list-container">
      {saludo && <h2 className="section-title">{saludo}</h2>}

      {!limite && !cargando && !error && (
        <SearchBar
          busqueda={busqueda}
          onBusqueda={onBusqueda}
          categoria={categoria}
          onCategoria={onCategoria}
          categorias={categorias}
        />
      )}

      {cargando ? (
        <Cargando />
      ) : error ? (
        <div role="alert" className="mensaje mensaje-error">
          <p>{error}</p>
          <button type="button" className="btn btn-outline" onClick={recargar}>Reintentar</button>
        </div>
      ) : visibles.length === 0 ? (
        <p>
          {productos.length === 0
            ? 'Todavía no hay productos cargados.'
            : 'No encontramos productos que coincidan con tu búsqueda.'}
        </p>
      ) : (
        <>
          {/* Grilla React-Bootstrap: 1 columna en móvil, 2 en tablet, 4 en escritorio */}
          <Row className="g-4 mt-1">
            {visibles.map((producto) => (
              <Col key={producto.id} xs={12} sm={6} lg={3}>
                <Item producto={producto} />
              </Col>
            ))}
          </Row>
          {!limite && (
            <Paginador pagina={paginaActual} totalPaginas={totalPaginas} onCambiar={setPagina} />
          )}
        </>
      )}
    </div>
  )
}

export default ItemListContainer
