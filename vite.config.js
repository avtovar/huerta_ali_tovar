import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ↑ La configuración de Vite puede ser un OBJETO o una FUNCIÓN.
// ↑ Si es una función, Vite le pasa el contexto de la ejecución:
// ↑ { command, mode, isSsrBuild, isPreview }.
// ↑ `command` vale 'serve' cuando levantamos el servidor (npm run dev / npm run preview)
// ↑ y 'build' cuando compilamos para publicar (npm run build).
// ↑ Lo usamos para que el `base` sea distinto en desarrollo y en producción.

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // ↑ base: es el PREFIJO con el que se van a pedir los recursos (JS, CSS, imágenes)
  // ↑ y los archivos de la carpeta public/. GitHub Pages publica este repo como un
  // ↑ proyecto DENTRO de la cuenta del usuario, o sea en la SUBCARPETA
  // ↑ /la-huerta-de-ali/ y no en la raíz del dominio. Por eso el base lleva ese prefijo.
  base: command === 'serve' ? '/' : process.env.VITE_BASE || '/la-huerta-de-ali/',
  // ↑ VITE_BASE permite cambiar el base sin tocar el código: en Netlify/Vercel se define VITE_BASE=/ (sitio en la raíz del dominio).
  // ↑ En DESARROLLO ('serve') el servidor de Vite sirve el proyecto en la raíz
  // ↑ (http://localhost:5173), así que dejamos base '/' y rutas como
  // ↑ /productos.json funcionan tal cual.
  // ↑ En PRODUCCIÓN ('build') usamos un base ABSOLUTO con el prefijo de Pages:
  // ↑ los recursos se piden en /la-huerta-de-ali/assets/index-xxxx.js.
  // ↑
  // ↑ ¿Por qué NO './' (relativas, que era la versión anterior)?
  // ↑ Con './' el sitio abre bien en la home, porque './assets/...' se resuelve a
  // ↑ /la-huerta-de-ali/assets/... PERO en una ruta profunda de la SPA, como
  // ↑ /la-huerta-de-ali/producto/1, el navegador resuelve './assets/...' respecto de
  // ↑ /la-huerta-de-ali/producto/ y pide /la-huerta-de-ali/producto/assets/index-xxxx.js,
  // ↑ que no existe: la página queda en blanco. Con base ABSOLUTO los assets se piden
  // ↑ siempre desde /la-huerta-de-ali/assets/, sin importar en qué carpeta esté la URL.
  // ↑
  // ↑ OJO: `command === 'serve'` también es true en `npm run preview`, así que el
  // ↑ preview sirve la build en la raíz. Para probar la build tal como queda en Pages
  // ↑ hay que copiar `dist/` dentro de una carpeta llamada `la-huerta-de-ali` y
  // ↑ servir el PADRE de esa carpeta.
  // ↑
  // ↑ Este mismo valor es el que Vite publica como `import.meta.env.BASE_URL`
  // ↑ ('/' en desarrollo, '/la-huerta-de-ali/' en la build) y el que usa
  // ↑ `src/utils/rutasPublicas.js` para armar las rutas de productos.json y de las imágenes.
}))
