// ============================================================
// rutasPublicas.js — constructor de rutas hacia los archivos de public/
// ============================================================
//
// PROBLEMA QUE RESUELVE
// El proyecto se publica en GitHub Pages como proyecto (no como sitio de usuario),
// o sea en la SUBCARPETA https://avtovar.github.io/la-huerta-de-ali/ y no en la
// raíz del dominio. Si escribimos una ruta que empiece con "/", el navegador la
// resuelve desde la RAÍZ del dominio y no desde la carpeta del proyecto:
//   '/productos.json'  ->  https://avtovar.github.io/productos.json      (404)
//   '/verduras/tomate.jpg' -> https://avtovar.github.io/verduras/tomate.jpg (404)
// Las dos cosas están dentro de la subcarpeta del proyecto, así que hay que
// anteponer SIEMPRE el prefijo '/la-huerta-de-ali/'.
//
// CÓMO LO SABEMOS SIN HARD-CODEAR A MANO
// Vite inyecta el valor de `base` (el de vite.config.js) en la variable
// `import.meta.env.BASE_URL` cuando compila:
//   - npm run dev  ->  import.meta.env.BASE_URL === '/'
//   - npm run build ->  import.meta.env.BASE_URL === '/la-huerta-de-ali/'
// OJO: Vite reemplaza `import.meta.env.BASE_URL` por una constante en el build,
// así que el prefijo queda escrito en el bundle final y no se resuelve en
// tiempo de ejecución (no hace falta ninguna variable de entorno ni .env).
//
// POR QUÉ UN SOLO ARCHIVO
// Centralizar la construcción de rutas acá evita repetir el `+ '/la-huerta-de-ali'`
// en cada componente y, sobre todo, evita que alguien se olvide del prefijo y
// rompa otra vez el sitio publicado. Si algún día el proyecto pasa a servirse en
// la raíz del dominio, alcanza con cambiar `base` en vite.config.js: este helper
// sigue funcionando sin tocar ni el JSON ni los componentes.

/**
 * Devuelve la URL absoluta de un archivo que vive en la carpeta `public/`.
 *
 * @param {string} relativa - Ruta RELATIVA dentro de `public/`, sin barra inicial.
 *                            Ejemplos: 'productos.json', 'verduras/tomate.jpg'
 * @returns {string} La ruta con el prefijo del proyecto ya puesto.
 *                    Ej: '/productos.json' en dev, '/la-huerta-de-ali/productos.json' en la build.
 */
export function rutaPublica(relativa) {
  // ↑ Si la imagen es una URL completa (cargada desde el Panel), se usa tal cual
  if (/^https?:\/\//i.test(relativa)) return relativa
  // ↑ BASE_URL siempre termina en '/', por eso alcanza con concatenar sin otra barra
  return `${import.meta.env.BASE_URL}${relativa}`
  // ↑ Template string: arma la ruta final, ej. '/la-huerta-de-ali/' + 'verduras/tomate.jpg'
}
