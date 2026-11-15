# Documentación - la-huerta-de-ali

**La Huerta de Ali** es una verdulería online que muestra un catálogo de verduras, permite ver el detalle de cada producto, armar un carrito de compras y finalizar una compra simulada. Usa **React 18 + Vite**, **React Router DOM 6** para la navegación, **Context API** para el estado global del carrito y **CSS + styled-components** para los estilos. El proyecto se integra con **Firebase Authentication y Firestore** para autenticación, gestión de productos, cupones y datos del equipo.

## Estructura

- `index.html` — Punto de entrada HTML: define `#root` donde Vite monta la app.
- `package.json` — Configuración del proyecto: scripts (`dev`, `build`, `preview`) y dependencias (Bootstrap, Firebase, React, React-Bootstrap, styled-components, etc.).
- `vite.config.js` — Configuración de Vite: plugin de React y `base` que cambia según el entorno (`/` en dev, `/huerta_ali_tovar/` en la build por GitHub Pages).
- `src/main.jsx` — Entrada de la app: monta React con `createRoot`, envuelve todo con `BrowserRouter` (recibe `basename={import.meta.env.BASE_URL}` para saber en qué carpeta del dominio está) + `CartProvider` + `AuthProvider` + `HelmetProvider` (para cambiar `<title>` y `<meta>` por página).
- `src/index.css` — Estilos GLOBALES: variables de color (paleta), tipografías, botones genéricos, clases utilitarias (`.container`, `.btn`, `.page`).
- `src/App.jsx` — Configura las rutas y carga cada página bajo demanda usando `lazy` + `Suspense`. Define las rutas privadas (`/perfil`, `/panel`, `/admin/cupones`) con el componente `RutaProtegida`.
- `src/context/CartContext.jsx` — Estado GLOBAL del carrito con Context API: agregar, quitar, cambiar cantidad, vaciar y calcular totales. Los datos se guardan en `localStorage` para persistir al recargar.
- `src/context/AuthContext.jsx` — Proveedor de sesión y rol: gestiona la sesión de Firebase Auth, lee el rol (`admin` | `user`) del documento `usuarios/{uid}` en Firestore, y expone `esAdmin` para rutas protegidas.
- `src/utils/rutasPublicas.js` — Helper `rutaPublica(relativa)`: le antepone el prefijo del proyecto (`/huerta_ali_tovar/` en build) a las rutas de los archivos de `public/`, evitando 404 en GitHub Pages.
- `src/components/Layout/Layout.jsx` — Esqueleto común de todas las páginas: Header + NavBar + contenido (`<Outlet/>`) + Footer.
- `src/components/Header/Header.jsx` — Encabezado con el logo y el slogan del emprendimiento.
- `src/components/NavBar/NavBar.jsx` — Barra de navegación; los enlaces de administración solo aparecen para usuarios con rol `admin`.
- `src/components/CartWidget/CartWidget.jsx` — Ícono del carrito con un contador de productos agregados.
- `src/components/Footer/Footer.jsx` — Pie de página: contacto, legales, newsletter simulado y equipo leído de Firestore, con respaldo local. Las tarjetas usan `styled-components`.
- `src/components/Item/Item.jsx` — Tarjeta reutilizable que muestra un producto (imagen, nombre, precio, botones "Agregar", "Ver más").
- `src/components/ItemListContainer/ItemListContainer.jsx` — Lee el catálogo mediante `useProductos`, filtra por búsqueda/categoría y dibuja la grilla React-Bootstrap de `Item`.
- `src/components/ItemDetail/ItemDetail.jsx` — Vista de detalle de un producto con selector de cantidad y control de stock.
- `src/pages/Home.jsx` — Página principal con hero de presentación y el catálogo.
- `src/pages/Productos.jsx` — Catálogo completo reutilizando `ItemListContainer`.
- `src/pages/ProductoDetalle.jsx` — Busca el producto por `:id` de la URL y muestra `ItemDetail`.
- `src/pages/Carrito.jsx` — Página del carrito: lista de items, cantidades, subtotales, total y finalización simulada con confirmación.
- `src/pages/GestionCupones.jsx` — CRUD administrativo de cupones (código, porcentaje, vencimiento y estado).
- `src/pages/Login.jsx` — Formulario de inicio de sesión con Firebase Auth.
- `src/pages/Registro.jsx` — Formulario de registro que crea el usuario y su documento en Firestore con rol `user`.
- `src/pages/Perfil.jsx` — Datos de la cuenta y cierre de sesión; muestra el rol y enlace al panel si es admin.
- `src/pages/Panel.jsx` — Panel de administración: CRUD de productos, carga inicial desde `productos.json`, editar/eliminar productos.
- `src/pages/GestionCupones.jsx` — CRUD de cupones (solo admin): crear, editar, ver y eliminar cupones en Firestore.
- `src/pages/NotFound.jsx` — Página 404 para cualquier ruta inexistente.
- `src/services/productosService.js` — Centraliza las operaciones CRUD sobre la colección `productos` de Firestore (leer, crear, actualizar, eliminar, cargar iniciales).
- `src/services/equipoService.js` — Lectura de la colección `equipo` de Firestore.
- `src/services/cuponesService.js` — CRUD de la colección `cupones` de Firestore (usando transacciones para evitar códigos duplicados).
- `src/utils/errores.js` — Traduce códigos de error de Firebase a mensajes claros en español.
- `src/firebase/config.js` — Inicializa Firebase (Auth + Firestore) leyendo variables de entorno `VITE_FIREBASE_*`.
- `public/productos.json` — Datos estáticos de los 12 productos (nombre, precio, stock, imagen...); sirve de respaldo y para la carga inicial.
- `public/verduras/` — Carpeta con imágenes locales de cada verdura (en `productos.json` se referencian sin barra inicial: `verduras/tomate.jpg`).
- `src/**/*.css` — Estilos particulares de cada componente (organizados en la misma carpeta del componente).
- `CHECKLIST_PRUEBAS.md` — Checklist de pruebas manuales para verificar antes de la entrega.
- `vercel.json` / `.github/workflows/deploy.yml` — Configuración de despliegue en Vercel y GitHub Pages.

## Comandos

```
npm install     -> instala las dependencias
npm run dev     -> levanta el servidor de desarrollo (http://localhost:5173)
npm run build   -> genera la versión de producción en la carpeta dist/
npm run preview -> previsualiza la compilación de producción localmente
```

## Conceptos clave que se ven en este proyecto

1. **Componentes funcionales** — Cada archivo `.jsx` exporta una función que devuelve JSX; React lo convierte en HTML. Los componentes reciben datos por props del padre.
2. **Props** — Datos que viajan de un componente padre a un hijo (ej. `producto` que recibe `Item`). Los props son de solo lectura.
3. **Estado con `useState`** — Permite que un componente "recuerde" cosas y se vuelva a dibujar cuando cambian (ej. `cargando`, `cantidad`, `carrito`, `usuario`).
4. **`useEffect`** — Ejecuta efectos secundarios; se usa para cargar productos y equipo desde Firestore al montar sus vistas, y para suscribirse a cambios.
5. **Context API (`createContext` + `useContext`)** — Comparte el carrito y la sesión/rol entre TODOS los componentes sin pasar props de mano en mano (global state).
6. **React Router DOM** — `BrowserRouter`, `Routes`, `Route`, `NavLink`, `Link`, `useParams` y `Outlet` para navegar sin recargar la página. El `basename` del router debe coincidir con el `base` de Vite.
7. **`.map()` con `key`** — Se usa para convertir un array de productos en una lista de componentes; `key` ayuda a React a identificar cada uno de forma única y eficiente.
8. **Firestore y respaldo JSON** — El catálogo principal se lee de Firestore; `public/productos.json` sirve como respaldo y para la carga inicial. La URL del JSON la arma `rutaPublica('productos.json')`.
9. **`import.meta.env.BASE_URL` y el prefijo de rutas** — El proyecto se publica en GitHub Pages dentro de la subcarpeta `/huerta_ali_tovar/`, así que una ruta escrita con `/` inicial se resuelve desde la raíz del DOMINIO y da 404. Vite publica el `base` de `vite.config.js` en `import.meta.env.BASE_URL` (`/` en desarrollo, `/huerta_ali_tavar/` en la build) y el helper `rutaPublica()` le antepone ese prefijo a los archivos de `public/`. Como el `BrowserRouter` recibe ese mismo valor en su prop `basename`, React Router compara las rutas de la app contra la URL correcta y no muestra el 404 en todas las páginas.
10. **Grilla React-Bootstrap y `flexbox`** — `Row` y `Col` arman la grilla responsive del catálogo; el resto del layout combina CSS Grid y Flexbox.
11. **Variables CSS (`:root`)** — Centralizan colores y fuentes para mantener una paleta consistente en toda la app (`src/index.css`).
12. **`styled-components`** — La tarjeta del equipo del footer se estiliza como componente modular, usando las variables globales de color y espaciado. Los estilos van dentro del archivo `.jsx`/`.js` junto con el componente.
13. **Rutas protegidas** — `RutaProtegida` verifica que haya sesión (`usuario`) y, si hay `rolesPermitidos`, que el rol del usuario esté en esa lista. Si no pasa, redirige a `/login` y guarda la ruta origen en `state` para volverla a intentar después.
14. **Control de stock** — El límite por producto se define en `productos.json` (`stock`) y se respeta en `CartContext`, `ItemDetail` y `Carrito`.
15. **Simulaciones front-end** — El newsletter y la finalización de compra son demostraciones: no envían datos a un servidor ni procesan pagos reales.

## Árbol de dependencias

```
index.html
  └─ src/main.jsx                          ✅ punto de entrada
       ├─ src/index.css                    ✅ estilos globales aplicados
       ├─ src/context/CartContext.jsx      ✅ proveedor global del carrito
       │    └─ consumido por: CartWidget, Item, ItemDetail, Carrito
       ├─ src/context/AuthContext.jsx      ✅ proveedor de sesión y rol
       ├─ src/App.jsx                      ✅ configura las rutas
       │    ├─ src/components/Layout/Layout.jsx   ✅ (Layout.css ✅)
       │    │    ├─ Header/Header.jsx             ✅ (Header.css ✅)
       │    │    ├─ NavBar/NavBar.jsx             ✅ (NavBar.css ✅; links admin)
       │    │    │    └─ CartWidget/CartWidget.jsx ✅ (CartWidget.css ✅)
       │    │    └─ Footer/Footer.jsx             ✅ (Footer.css ✅)
       │    └─ <Outlet/> → páginas
       │         ├─ Home.jsx + Home.css              ✅
       │         │    └─ ItemListContainer.jsx       ✅ (ItemListContainer.css ✅)
       │         │         └─ Item/Item.jsx          ✅ (Item.css ✅)
       │         ├─ Productos.jsx                    ✅
       │         │    └─ ItemListContainer.jsx       ✅ (reutilizado)
       │         ├─ ProductoDetalle.jsx              ✅
       │         │    └─ ItemDetail/ItemDetail.jsx   ✅ (ItemDetail.css ✅)
       │         ├─ Carrito.jsx + Carrito.css        ✅ (confirmación de compra)
       │         ├─ Login.jsx y Registro.jsx          ✅
       │         ├─ Perfil.jsx                       ✅ (ruta protegida)
       │         ├─ Panel.jsx + Panel.css             ✅ (CRUD de productos)
       │         ├─ GestionCupones.jsx + CSS          ✅ (CRUD admin de cupones)
       │         └─ NotFound.jsx                     ✅
       ├─ src/services/                           ✅
       │    ├─ productosService.js  ✅ CRUD y carga inicial de productos
       │    ├─ equipoService.js     ✅ lectura del equipo
       │    └─ cuponesService.js    ✅ CRUD de cupones
       └─ src/utils/                              ✅
            ├─ rutasPublicas.js    ✅ arma las rutas de los archivos de public/
            └─ errores.js          ✅ traduce códigos de error Firebase
public/
  ├─ productos.json    ✅ datos del catálogo (se lee con fetch)
  └─ verduras/         ✅ imágenes locales
dist/                  ⚙️ carpeta generada por npm run build (no se toca a mano)
node_modules/          ⚙️ dependencias instaladas por npm (no se toca a mano)
```

> **Nota importante:** todos los CSS del proyecto están importados y aplicados. No hay hojas de estilo huérfanas (salvo `Auth.css` que es opcional por página). ✅

## Paleta

Variables definidas en `src/index.css` (modo oscuro con acentos pastel):

| Variable | Valor | Uso |
| --- | --- | --- |
| `--color-bg` | `#252a27` | Fondo general de la app |
| `--color-bg-soft` | `#343b35` | Fondo de secciones/hero/resumen |
| `--color-card` | `#303733` | Fondo de tarjetas (productos, equipo, detalle) |
| `--color-primary` | `#86a98b` | Verde principal (NavBar, botones primarios) |
| `--color-primary-dark` | `#b2d0b0` | Verde claro para textos destacados |
| `--color-secondary` | `#e8c09d` | Color de apoyo (botón secundario, avatar) |
| `--color-accent` | `#e5a8a8` | Acento (badge del carrito, botón quitar) |
| `--color-text` | `#f5f0e7` | Texto principal |
| `--color-text-soft` | `#c7c4b9` | Texto secundario / descripciones |
| `--color-border` | `#59635a` | Bordes y separadores |
| `--font-display` | `'Quicksand', sans-serif` | Títulos (h1–h4) |
| `--font-body` | `'Nunito Sans', sans-serif` | Texto general |
| `--radius-sm/md/lg` | `10px / 18px / 28px` | Bordes redondeados |
| `--shadow-soft` | `0 8px 24px rgba(0,0,0,0.22)` | Sombra de tarjetas |

## Cómo cambiar...

- **Colores del sitio** — Edita las variables `--color-*` en `src/index.css` (`:root`). Un solo cambio se refleja en toda la app.
- **Catálogo de productos** — Agrega, quita o modifica objetos en `public/productos.json` (respeta `id` únicos). Las imágenes van en `public/verduras/`. Ojo con el campo `imagen`: se escribe RELATIVO a `public/` y SIN barra inicial (`verduras/tomate.jpg`); con una barra inicial el navegador la busca en la raíz del dominio y da 404 en el sitio publicado.
- **Carpeta donde se publica el sitio** — Está en el `base` de `vite.config.js`. Si el proyecto pasa a servirse en otra subcarpeta (o en la raíz del dominio), cambiá ese valor: `rutaPublica()` y el `basename` del `BrowserRouter` se ajustan solos, sin tocar los componentes ni el JSON.
- **Rutas** — Agrega un `<Route>` en `src/App.jsx` y crea la página correspondiente en `src/pages/`.
- **Datos del emprendimiento** — Email, teléfono, Instagram y sede están en `src/components/Footer/Footer.jsx`. El equipo se lee de la colección Firestore `equipo` (campos `nombre`, `rol`, `frase`, `inicial`) y usa los datos locales como respaldo.
- **Cupones** — Se administran en `/admin/cupones`; la colección `cupones` está restringida a administradores. El alcance actual no valida ni aplica cupones durante el checkout.
- **Control de stock** — El límite por producto se define en `productos.json` (`stock`) y se respeta en `CartContext`, `ItemDetail` y `Carrito`.

## Notas

- El newsletter y la finalización de compra son **simulaciones front-end**: no envían datos a ningún servidor ni procesan pagos reales.
- ⚠️ Dato a revisar: el producto con `id: 11` en `productos.json` se llama "Banana" pero usa imagen/descripción de berenjena (parece un error de copiado del catálogo).
- El proyecto usa `type: "module"` en `package.json`, por lo que las importaciones usan la sintaxis `import ... from '...'` sin necesidad de configuraciones extra en el navegador moderno.
- Firebase solo está configurado si el archivo `.env` tiene todas las `VITE_FIREBASE_*`. Si falta, la app arranca mostrando el catálogo inicial desde `public/productos.json` y muestra avisos indicando configurar Firebase.

---

*Documentado por Ali Valentin Tovar Morales*