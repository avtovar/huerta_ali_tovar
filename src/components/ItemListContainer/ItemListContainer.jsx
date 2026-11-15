import { useMemo, useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import Item from '../Item/Item'
import SearchBar from '../SearchBar/SearchBar'
import Paginador from '../Paginador/Paginador'
import Cargando from '../Cargando/Cargando'
import { useProductos } from '../../hooks/useProductos'
import './ItemListContainer.css'

const POR_PAGINA = 8
const normalizar = (texto) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

function ItemListContainer({ saludo, mostrarTodos = false }) {
  const { productos, cargando, error, recargar } = useProductos()
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('')
  const [pagina, setPagina] = useState(1)

  const categorias = useMemo(
    () => [...new Set(productos.map((producto) => producto.categoria))]
      .sort((a, b) => a.localeCompare(b, 'es')),
    [productos]
  )

  const filtrados = useMemo(() => {
    const consulta = normalizar(busqueda.trim())
    return productos.filter((producto) =>
      (!categoria || producto.categoria === categoria) &&
      (!consulta ||
        normalizar(producto.nombre).includes(consulta) ||
        normalizar(producto.categoria).includes(consulta))
    )
  }, [productos, busqueda, categoria])

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA))
  const paginaActual = Math.min(pagina, totalPaginas)
  const visibles = mostrarTodos
    ? filtrados
    : filtrados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA)

  const onBusqueda = (valor) => {
    setBusqueda(valor)
    setPagina(1)
  }

  const onCategoria = (valor) => {
    setCategoria(valor)
    setPagina(1)
  }

  return (
    <div className="item-list-container">
      {saludo && <h2 className="section-title">{saludo}</h2>}

      {!cargando && !error && (
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
          <Row className="g-4 mt-1">
            {visibles.map((producto) => (
              <Col key={producto.id} xs={12} sm={6} lg={3}>
                <Item producto={producto} />
              </Col>
            ))}
          </Row>
          {!mostrarTodos && (
            <Paginador
              pagina={paginaActual}
              totalPaginas={totalPaginas}
              onCambiar={setPagina}
            />
          )}
        </>
      )}
    </div>
  )
}

export default ItemListContainer
