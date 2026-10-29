# Inventario de una pantalla (solo lectura)

Quiero que documentes en detalle cómo funciona HOY la pantalla **[Búsqueda de cardholders — indicá la ruta o el componente principal]**. Este documento va a ser la entrada para rediseñar la pantalla y migrarla de Ant Design a otra arquitectura, así que necesito fidelidad: describí lo que el código hace, no lo que debería hacer.

## Reglas
- **No modifiques ningún archivo.** Es solo análisis.
- Cada afirmación lleva su evidencia como `ruta/archivo.tsx:línea`.
- Si algo no se puede determinar leyendo el código (por ejemplo, un comportamiento que depende del backend), escribí "No determinado" y decí qué habría que probar. No inventes ni asumas.
- Donde puedas, mostrá el fragmento real de código (reglas de validación, funciones de formateo, el request) en lugar de parafrasearlo.
- Mantené separados los **hechos** (secciones 1 a 11) de tus **observaciones** (sección 12).

## 1. Mapa de la pantalla
- Ruta/URL y cómo se llega (menú, links, permisos o roles necesarios para verla).
- Árbol de componentes: archivo de la página → contenedores → componentes hijos, indicando cuáles son de Ant Design y cuáles propios.
- Hooks, stores o contextos que usa, y dónde vive cada estado (local, global, URL, caché de data fetching).

## 2. Filtros
Una tabla con una fila por filtro:

| Filtro | Etiqueta visible | Componente (antd o propio) | Tipo de dato | Valor por defecto | Obligatorio | Validaciones | Opciones (si es select) y de dónde salen | Query param/campo del request | Transformación antes de enviarse |

Además:
- Reglas entre filtros (dependencias, mutua exclusión, "al menos uno requerido").
- Validaciones: **cuándo** corren (al escribir, al blur, al submit), el texto exacto de cada mensaje de error y dónde se muestra.
- Cómo se aplica la búsqueda (botón, Enter, debounce, automática) y qué hacen los botones "Limpiar"/"Reset".
- Si los filtros se reflejan en la URL o solo en estado local, y si se recuerdan al volver a la pantalla.
- Qué pasa con el estado de la tabla (página, orden) al cambiar un filtro.

## 3. Tabla
- Una tabla con una fila por columna, **en el orden exacto en que se muestran**:

| # | Header (texto exacto) | Campo del dato | Render/formateo (fecha, moneda, enmascarado, badge, link, truncado…) | Alineación | Ancho | ¿Ordenable? | ¿Filtrable en la columna? | ¿Visible siempre o configurable? | Valor cuando está vacío o null |

- Columnas fijas (`fixed`), scroll horizontal, tamaño de la tabla, filas expandibles, selección de filas, `rowKey`.
- Acciones por fila (botones, menús, links): qué hacen, a dónde navegan o qué endpoint llaman, y condiciones para mostrarlas u ocultarlas.
- Acciones masivas o de toolbar (exportar, crear, etc.).
- Cada formateador: pegá el código o indicá la función y su salida para 2 o 3 ejemplos.

## 4. Paginación y orden
- Paginación del lado del servidor o del cliente; parámetros que se envían (nombres y base 0 o 1); tamaños de página disponibles y el default; si se muestra el total.
- Orden: del lado del servidor o del cliente; con qué parámetros; orden por defecto; si hay multi-orden.
- Si la página y el tamaño están en la URL o en estado local.

## 5. Endpoint(s) consumido(s)
Por cada endpoint que usa la pantalla (búsqueda, catálogos de selects, acciones de fila, exportación):
- Método y URL, cliente HTTP usado, headers relevantes (auth, idioma, etc.).
- **Contrato del request:** query params o body con tipo, obligatoriedad y ejemplo real armado desde el código.
- **Contrato del response:** forma exacta (con un ejemplo JSON), campos que usa la pantalla y campos que ignora, estructura de paginación (`total`, `page`, etc.), convención de nombres (snake_case o camelCase) y tipo de los montos y las fechas.
- Si existe, enlazá el OpenAPI/Swagger o los tipos TypeScript del contrato y decí si coinciden con lo que el código realmente usa.
- **Errores:** formato del error, qué códigos o mensajes maneja la pantalla y cómo los muestra al usuario.
- Cuándo se llama (al montar, al cambiar filtros, al paginar), cancelación de requests, reintentos, caché, y si hay llamadas en paralelo.

## 6. Transformaciones de datos
- **Antes de enviar:** normalización de filtros (trim, mayúsculas, quitar guiones o máscaras, conversión de fechas y zonas horarias, números a string, descarte de vacíos).
- **Al recibir:** mapeos, renombres de campos, conversión de enums o códigos a texto legible, formateo de fechas, montos y documentos, defaults para nulos.
- Dónde vive cada transformación (componente, util, interceptor, adapter) y si hay tests.
- Cualquier valor crudo de la API que hoy se muestra sin traducir.

## 7. Estados de la pantalla
Comportamiento y texto exacto de: carga inicial, cargando al refiltrar o paginar, sin resultados (¿distingue "sin filtros" de "con filtros"?), error de red o de servidor, error de validación, sin permisos, y estado inicial antes de buscar (¿se busca al entrar o solo al enviar?).

## 8. Comportamiento de cada componente
Para cada componente interactivo (inputs, selects, date pickers, botones, modales, drawers, tooltips): qué hace, qué eventos maneja, props de Ant Design no triviales que usa (`showSearch`, `allowClear`, `format`, `presets`, `mode`, etc.), y comportamientos que dependen de la librería y habría que reproducir a mano (por ejemplo, el filtrado interno de un Select o el comportamiento del RangePicker).

## 9. Navegación y acciones
Desde esta pantalla: a dónde se puede ir (detalle, edición, creación), qué datos viajan (id en la ruta, state, query), breadcrumbs o título de página que se muestran, y qué pasa al volver.

## 10. Mobile y responsive
Qué pasa hoy por debajo de ~768px: breakpoints usados (`Grid`, `useBreakpoint`, media queries), qué se oculta o se reordena, si la tabla hace scroll horizontal o tiene versión alternativa. Si no hay nada, decilo explícitamente.

## 11. Textos, permisos y accesibilidad
- Todos los textos visibles (labels, placeholders, headers, botones, mensajes, tooltips, vacíos) y si vienen de un i18n o están hardcodeados.
- Permisos o roles que condicionan filtros, columnas o acciones.
- Etiquetas ARIA, manejo de teclado y foco que existan hoy.

## 12. Observaciones (separadas de los hechos)
Deuda técnica, inconsistencias, validaciones faltantes, formatos incoherentes entre columnas, lógica duplicada, partes difíciles de migrar y riesgos. Marcá cuáles son un bug evidente y cuáles son decisiones de producto que habría que confirmar.

## Formato de entrega
Un único documento en Markdown, con estas 12 secciones en ese orden, tablas donde se indica y un resumen de 10 líneas al principio. Guardalo en `docs/inventario/<nombre-de-la-pantalla>.md`. Al final, listá los archivos leídos.
