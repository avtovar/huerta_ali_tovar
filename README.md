# La Huerta de Ali

[![CI](https://github.com/avtovar/huerta_ali_tovar/actions/workflows/ci.yml/badge.svg)](https://github.com/avtovar/huerta_ali_tovar/actions/workflows/ci.yml) [![GitHub Pages](https://github.com/avtovar/huerta_ali_tovar/actions/workflows/deploy.yml/badge.svg)](https://avtovar.github.io/huerta_ali_tovar/)

Entrega Final de React JS, realizada por Ali Tovar.

La Huerta de Ali es una verdulería online: catálogo con búsqueda y paginación,
detalle de producto, carrito, registro e inicio de sesión, y un panel de
administración para gestionar los productos (CRUD) sobre Firebase.

## Tecnologías utilizadas

- React 18 + Vite
- React Router DOM 6 (rutas y rutas protegidas)
- Context API (`CartContext` y `AuthContext`)
- Firebase Authentication y Cloud Firestore
- React-Bootstrap / Bootstrap 5 (grilla responsive, Modal, Spinner)
- CSS propio por componente (sin estilos en línea ni styled-components)
- React Icons, React Toastify y React Helmet Async

## Funcionalidades

- **Carrito (Context API):** agregar, eliminar, incrementar/decrementar cantidad (con tope de stock) y vaciar. Se guarda en `localStorage`.
- **Autenticación (Context API + Firebase Auth):** formularios controlados de login y registro, sesión persistente, cierre de sesión y página `/perfil`.
- **Roles:** `admin` o `user`. El rol se lee del documento `usuarios/{uid}` de Firestore (sin documento = usuario común).
- **Rutas protegidas:** `/perfil` exige sesión; `/panel` exige sesión y rol `admin`. Sin sesión redirige a `/login` y vuelve a la ruta pedida al ingresar.
- **Panel de administración (`/panel`):** alta, edición (reutiliza el mismo formulario), eliminación con modal de confirmación, validaciones, spinner de carga, mensajes de error y avisos con toasts.
- **Búsqueda y paginación:** búsqueda en tiempo real (ignora tildes), filtro por categoría y paginador (8 productos por página).
- **Diseño responsivo** (móvil, tablet y escritorio) y SEO por página con React Helmet.

## Rutas

| Ruta | Descripción | Acceso |
| --- | --- | --- |
| `/` | Inicio | Público |
| `/productos` | Catálogo con búsqueda y paginador | Público |
| `/producto/:id` | Detalle de un producto | Público |
| `/carrito` | Carrito de compras | Público |
| `/login`, `/registro` | Acceso y alta de cuenta | Público |
| `/perfil` | Datos de la cuenta y cierre de sesión | Usuarios logueados |
| `/panel` | CRUD de productos | Solo administradores |

## Instalación y ejecución local

Requisitos: Node.js 18 o superior y npm.

```bash
npm install
cp .env.example .env      # y completar con los datos de tu proyecto Firebase
npm run dev               # http://localhost:5173
```

Otros comandos: `npm run build` (genera `dist/`) y `npm run preview`.

## Configuración de Firebase (una sola vez)

1. En la [consola de Firebase](https://console.firebase.google.com) crear un proyecto y registrar una **app web**; copiar sus credenciales al archivo `.env` (las variables están en `.env.example`).
2. **Authentication → Método de acceso:** habilitar *Correo electrónico y contraseña*.
3. **Firestore Database:** crear la base y, en la pestaña *Reglas*, pegar el contenido de [`firestore.rules`](./firestore.rules) y publicar.
4. **Crear el administrador:** registrar una cuenta desde `/registro`, copiar su UID (Authentication → Users) y en Firestore editar/crear el documento `usuarios/<UID>` con el campo `rol` = `admin`.
5. Iniciar sesión con esa cuenta, entrar a `/panel` y usar el botón **"Cargar los 12 productos iniciales"** (copia `public/productos.json` a la colección `productos`).
6. Al publicar el sitio, agregar el dominio (por ejemplo `avtovar.github.io`) en *Authentication → Configuración → Dominios autorizados*.

## Despliegue

**GitHub Pages:** la primera vez, habilitarlo en *Settings → Pages → Build and deployment → Source: GitHub Actions*. Después, el workflow `.github/workflows/deploy.yml` compila y publica en cada push a `main`. Cargar las seis variables `VITE_FIREBASE_*` como *Secrets* en *Settings → Secrets and variables → Actions*. El `base` es `/huerta_ali_tovar/`.

**Netlify o Vercel:** importar el repositorio, comando `npm run build`, directorio `dist`, y definir las variables de entorno `VITE_FIREBASE_*` más `VITE_BASE=/` (el sitio queda en la raíz del dominio). Las redirecciones de la SPA ya están incluidas (`public/_redirects` para Netlify y `vercel.json` para Vercel).

## Estructura principal

```
src/
├── firebase/config.js        # inicialización de Firebase (lee el .env)
├── services/productosService.js  # CRUD de Firestore
├── context/                  # AuthContext y CartContext
├── hooks/useProductos.js     # carga del catálogo (cargando / error)
├── components/               # NavBar, Item, ItemListContainer, SearchBar, Paginador,
│                             # ProductoForm, ModalConfirmar, RutaProtegida, Seo, ...
├── pages/                    # Home, Productos, ProductoDetalle, Carrito,
│                             # Login, Registro, Perfil, Panel, NotFound
└── utils/                    # rutasPublicas.js y errores.js
```

## Documentación del código

Para la explicación línea por línea del código (qué hace cada archivo, cada hook,
cada clase CSS y los conceptos de React que se usan), ver
[`DOCUMENTACION.md`](./DOCUMENTACION.md).

## Datos del emprendimiento

- Nombre: La Huerta de Ali
- Responsable: Ali Tovar
- Slogan: Somos los mejores en calidad y productos frescos.
- Email: huertaali@gmail.com
- Teléfono/WhatsApp: +54 9 12345678
- Instagram: @huertaali
- Sede: Av. Siempre Verde 1234, Buenos Aires

## Autor

| Dato | Información |
| --- | --- |
| Nombre | Ali Tovar |
| Rol | Autor y desarrollador del proyecto |
| Cursada | Entrega Final · React JS |
| Email del emprendimiento | [huertaali@gmail.com](mailto:huertaali@gmail.com) |
| Teléfono/WhatsApp | +54 9 12345678 |
| Instagram | @huertaali |
| Sede | Av. Siempre Verde 1234, Buenos Aires |
| Código | [github.com/avtovar/huerta_ali_tovar](https://github.com/avtovar/huerta_ali_tovar) |
| Sitio publicado | [avtovar.github.io/huerta_ali_tovar](https://avtovar.github.io/huerta_ali_tovar/) |

> **La Huerta de Ali** · Somos los mejores en calidad y productos frescos.
> Entrega Final de React JS. Proyecto realizado por **Ali Tovar**.

## Notas

El newsletter y la finalización de compra son demostraciones front-end. No
envían datos a un servidor ni procesan pagos reales.
