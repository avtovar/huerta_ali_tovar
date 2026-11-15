# Checklist de pruebas manuales

Marcar cada punto después de probarlo en el navegador. Para las pruebas de administración, configurar Firebase, publicar `firestore.rules` y entrar con una cuenta cuyo rol sea `admin`.

## Preparación

- [ ] `npm run build` finaliza sin errores.
- [ ] Abrir el sitio publicado en Chrome o Edge, Firefox y un navegador móvil.
- [ ] Verificar que la consola del navegador no muestre errores de carga o rutas.

## Catálogo y navegación

- [ ] Inicio, catálogo, detalle y carrito cargan desde sus rutas y al refrescarlas.
- [ ] Las imágenes locales cargan en GitHub Pages.
- [ ] La búsqueda filtra mientras se escribe, ignora mayúsculas y tildes, y admite filtros por categoría.
- [ ] La paginación cambia de página y vuelve a la primera al cambiar filtros.
- [ ] El catálogo se adapta a móvil, tablet y escritorio sin desbordamientos.

## Carrito y compra simulada

- [ ] Agregar un producto actualiza el contador y conserva el carrito tras recargar.
- [ ] Aumentar y reducir cantidades respeta el stock; los subtotales y el total se actualizan.
- [ ] Quitar un producto y vaciar el carrito funcionan.
- [ ] **Finalizar compra** abre una confirmación; cancelar mantiene el carrito intacto.
- [ ] Confirmar muestra el agradecimiento y vacía el carrito. No se procesa ningún pago.

## Autenticación y permisos

- [ ] El registro valida nombre, email, longitud de contraseña y coincidencia de contraseñas.
- [ ] Login correcto inicia sesión; credenciales inválidas muestran un mensaje comprensible.
- [ ] `/perfil` requiere sesión; el cierre de sesión vuelve al inicio.
- [ ] Una cuenta común no puede acceder a `/panel` ni `/admin/cupones`.
- [ ] Una cuenta admin puede acceder a ambas rutas.

## Productos y equipo en Firestore

- [ ] Con `productos` vacío, el panel muestra el aviso y no permite editar el catálogo de respaldo.
- [ ] **Cargar los 12 productos iniciales** crea los documentos; al recargar, aparecen las acciones CRUD.
- [ ] Editar un producto actualiza sus datos y persiste tras recargar.
- [ ] Crear un producto lo agrega al listado; eliminar requiere confirmación y persiste.
- [ ] Al cancelar la eliminación, el producto permanece.
- [ ] Si `equipo` contiene documentos con `nombre`, `rol`, `frase` e `inicial`, el footer los muestra.
- [ ] Si `equipo` está vacío o Firebase no está configurado, el footer conserva el equipo de respaldo.

## Cupones

- [ ] Crear un código válido guarda el descuento, el estado y la fecha opcional.
- [ ] Un código duplicado se rechaza; descuento vacío, menor o igual a 0 y mayor a 100 se validan.
- [ ] Editar conserva el código y actualiza el resto de los campos.
- [ ] Eliminar requiere confirmación; cancelar conserva el cupón.
- [ ] La colección `cupones` no es legible ni modificable por usuarios comunes.

> El alcance actual administra cupones; no los valida ni aplica en el carrito.
