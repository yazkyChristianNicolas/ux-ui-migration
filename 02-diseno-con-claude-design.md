# Prompt: rediseño de una pantalla con Claude Design

Se pega junto con el inventario de la pantalla (`docs/inventario/<pantalla>.md`, resultado de [01-inventario-pantalla.md](01-inventario-pantalla.md)). Si la herramienta puede leer links, sumar también este repo.

Antes de usarlo, cerrar las dudas de la sección 12 del inventario ("observaciones"): son las que el diseño va a querer resolver.

---

# Rediseño de pantalla: <nombre, ej. Búsqueda de cardholders>

## Contexto
Estoy migrando un backoffice de Ant Design a una arquitectura por features, con una UX/UI más cuidada.
Adjunto dos insumos:

1. **Inventario funcional** de la pantalla actual (filtros, validaciones, columnas, formatos, endpoint, contrato, estados, comportamiento). Es el contrato funcional: **no se puede perder nada de lo que dice**.
2. **Referencia de UX y componentes**: https://github.com/yazkyChristianNicolas/ux-ui-migration (carpeta `reference/`). Define el shell, la navegación, las tablas, los filtros, el mobile y los componentes base. Es la fuente de patrones de UX.

## Qué quiero que diseñes
La pantalla completa, **en desktop y en mobile (<768px)**, usando los componentes y patrones de la referencia:

- **Shell:** sidebar retráctil (248px / 72px), topbar con `PageHeader` y breadcrumb. En mobile, `BottomNav` con "Más" en una hoja.
- **Filtros:**
  - Buscador y filtros rápidos en la barra.
  - El resto de los filtros en un `Drawer` que edita un borrador y se aplica con "Aplicar".
  - Los filtros aplicados se muestran como pills, con "Limpiar todo".
  - Cualquier cambio de filtro vuelve a la página 1.
- **Resultados:**
  - Tabla en desktop, con el scroll horizontal contenido.
  - Lista de dos líneas (`MobileList`) en mobile, con `DetailFields` en la hoja de detalle.
  - Paginación con total, números con elipsis y selector de tamaño.
- **Estados** (cada uno diseñado, no solo el feliz):
  - Cargando.
  - Vacío sin filtros y vacío con filtros (distintos, el segundo con "Limpiar filtros").
  - Error, con `Alert` inline y acción de reintentar.
  - Sin permisos.
  - Un estado por cada caso borde que figure en el inventario.
- **Feedback:** inline con `Alert` y `Button loading`. Sin toasts.
- **Acciones destructivas o irreversibles:** `Dialog` con confirmación explícita.

## Reglas
- **Cobertura del inventario:** por cada filtro, columna y acción del inventario tiene que haber un elemento en el diseño. Si algo no entra tal cual, decime por qué y qué proponés. No lo elimines en silencio.
- **Validaciones:** mostralas como error inline en el campo, con el texto exacto del inventario. Marcá cuáles bloquean "Aplicar" y cuáles no.
- **Columnas:**
  - Respetá el orden del inventario.
  - Aplicá los formatos del inventario (fechas, montos, documentos, enums) con su alineación: los números a la derecha y en fuente monoespaciada tabular.
  - Los enums de la API nunca se muestran crudos: usá `StatusBadge` (tono + texto) con el rótulo del inventario.
- **Estado en la URL:** los filtros, la página y el tamaño viajan en la URL con los mismos nombres que los parámetros del endpoint.
- **Mobile:** son dos versiones del mismo contenido, no una tabla encogida. Indicá qué columnas pasan a la fila y cuáles a la hoja de detalle.
- **Design system:** usá solo los tokens semánticos (superficies, texto, acento, estados, radios, sombras). Sin colores sueltos. El diseño tiene que poder cambiar de design system tocando solo los tokens.
- **Accesibilidad:** foco visible, targets táctiles ≥ 44px en mobile, contraste AA, y el estado nunca solo por color.
- **Textos:** español rioplatense, sentence case, sin emoji.

## Entregables
1. **Pantalla desktop** con datos, y la misma pantalla con el drawer de filtros abierto.
2. **Pantalla mobile**: lista, drawer de filtros como hoja y hoja de detalle.
3. **Todos los estados** listados arriba.
4. **Tabla de trazabilidad** *inventario → elemento del diseño* (filtro, columna o acción → componente). Marcá las filas sin equivalente.
5. **Lista de componentes**: cuáles de la referencia usaste y cuáles faltan. Para los que faltan, el comportamiento y los estados que necesitan.
6. **Decisiones y dudas**: todo lo que cambiaste respecto de la pantalla actual y todo lo que el inventario deja ambiguo.

No inventes campos, filtros, acciones ni textos que no estén en el inventario. Si algo te parece que falta, listalo en "Decisiones y dudas".
