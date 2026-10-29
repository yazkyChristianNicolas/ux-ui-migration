# Código de referencia

Componentes y estructura del patrón descrito en [`../03-estructura-componentes-y-migracion.md`](../03-estructura-componentes-y-migracion.md). Es código de lectura para adaptar (no un paquete instalable) y está pensado para **no depender del negocio ni de un design system concreto**.

- **Stack**: Next.js App Router, React, TypeScript, Tailwind v4, `lucide-react`, `clsx` + `tailwind-merge`.
- **Typecheck**: el código compila en modo `strict` con estas dependencias.

## Cómo se desacopla del design system

Los componentes no usan colores, radios ni sombras concretos: solo **tokens semánticos** (`bg-surface-card`, `text-fg-muted`, `border-line`, `bg-accent`, `bg-surface-nav`, `text-on-nav`…). [`tokens.css`](tokens.css) es el contrato: para usar otro design system, mapeá cada token a un valor del tuyo y no toques los componentes.

| Grupo | Tokens |
|---|---|
| Superficies | `surface-app`, `surface-card`, `surface-sunken`, `surface-hover`, `surface-nav` |
| Texto | `fg`, `fg-secondary`, `fg-muted`, `on-nav`, `on-accent` |
| Acción y bordes | `accent`, `accent-hover`, `line`, `line-strong`, `overlay` |
| Estados (texto + fondo suave) | `danger`, `success`, `warning`, `info` (+ `-bg` de cada uno) y `neutral-bg` |
| Forma | `radius-sm/md/lg`, `shadow-lg`, `shadow-focus`, `ease-standard` |
| Layout | `sidebar`, `sidebar-collapsed`, `topbar`, `content` |

Dos cosas más que el design system debe proveer: la variante `sidebar-collapsed:` y las utilidades de márgenes fluidos `px-page`, `py-page`, `px-header` y `p-card` (ya definidas en `tokens.css`).

El dominio ("entries") y los textos son de ejemplo; los textos fijos de los componentes se pueden sobrescribir con la prop `labels`.

## Estructura

```
reference/
  tokens.css                      # contrato de tokens + variante sidebar-collapsed + utilidades de márgenes
  src/
    app/
      layout.tsx                  # <html> con el script que aplica data-sidebar antes de pintar
      (protected)/
        layout.tsx                # requireSession + NAV (una sola fuente) + AppShell
        entries/page.tsx          # listado: filtros → fetch → tabla + lista mobile + paginación / vacíos
        entries/[id]/page.tsx     # detalle con breadcrumb como slot del PageHeader
    features/
      auth/                       # logout (server action) y LogoutButton (sidebar / hoja "Más")
      entries/                    # feature de referencia: api, types, lib/filters, components
        lib/filters.ts            # filtros ⇄ URL: parse, href, activos, isFiltered (lógica pura)
        lib/status.ts             # diccionario valor de la API → texto + tono
        components/               # EntryFilters, EntryTable, EntryMobileList, EntryStatusBadge, CloseEntryDialog
    shared/
      lib/                        # cn, format, pagination (lógica pura, sin "use client")
      ui/
        navigation/               # AppShell, Sidebar, SidebarToggle, BottomNav, sidebar-state
        PageHeader, Drawer, Dialog, Pagination, FilterBar, MobileList, table, EmptyState,
        Field (TextField, DateField, MoneyField, TextArea, FileDrop), Select, Combobox, Listbox,
        Choice (Checkbox, RadioGroup, Switch),
        Button (con loading), Alert, StatusBadge, TextLink, icons
```

## Decisiones de UX que los componentes implementan

- **Shell**: sidebar fijo de escritorio (ancho completo o solo íconos con tooltip) y, en mobile, `BottomNav` con 4 pantallas + "Más". Todo con CSS, sin detectar el ancho en JS.
- **Sidebar retráctil sin parpadeo**: el estado vive en `localStorage` y se refleja como `<html data-sidebar="collapsed">`; un script inline en el `<head>` lo aplica antes de pintar.
- **Topbar** (`PageHeader`): botón del sidebar, breadcrumb (slot), título que se corta con "…", acciones a la derecha.
- **Estado en la URL**: filtros, página y tamaño viajan en la query con los nombres de la API; son compartibles y funcionan con "atrás". Cualquier cambio vuelve a la página 1.
- **Filtros**: buscador + controles rápidos + botón "Filtros" con contador. El drawer edita un **borrador** que recién se aplica con "Aplicar"; los aplicados quedan como pills quitables, con "Limpiar todo".
- **Tablas**: estilos compartidos (primera columna a la izquierda, resto centradas, acciones a la derecha), anchos fijos que no generan scroll horizontal, cifras en monoespaciado. El contenedor lleva `relative` para que los `sr-only` no ensanchen la página en mobile.
- **Paginación**: números con elipsis en escritorio, `‹ 3 / 29 ›` en mobile, tamaño de página elegible.
- **Mobile**: cada tabla tiene su lista de dos líneas (`MobileList`) y los Drawer/Dialog se vuelven hojas desde abajo.
- **Estados vacíos distintos**: "sin resultados con estos filtros" (con "Limpiar filtros") frente a "todavía no hay datos" (con la acción principal).
- **Cerrar sesión**: `<form>` con server action; en el sidebar contraído queda solo el ícono, y en mobile es un botón de ancho completo en "Más".
- **Feedback sin toasts**: los mensajes van en línea, pegados a la acción que los causó, con `Alert` (error y warning = `role="alert"`; success e info = `role="status"`). No desaparecen solos y se leen donde el usuario estaba mirando. Las acciones puntuales se confirman en el propio control (el botón "Copiar" pasa a un check por un instante) y los botones muestran `loading` (spinner + `aria-busy` + deshabilitado, sin cambiar el texto para que el ancho no salte).
- **Estados**: `StatusBadge` combina tono, texto e ícono opcional (el color nunca es lo único que distingue); el valor de la API se traduce siempre con un diccionario, nunca se muestra crudo.
- **Diálogos**: `Dialog` para una decisión o un formulario corto; los errores del envío vuelven adentro con `Alert` y la acción destructiva usa `Button variant="danger"` a la derecha del footer (ver `CloseEntryDialog`). En mobile se vuelve una hoja inferior. Cada Drawer/Dialog usa un `id` propio (`useId`) para poder convivir varios en la misma pantalla.
- **Formularios**: `Field` envuelve todo control con el label siempre visible arriba (nunca el placeholder como label) y, abajo, el error (con ícono, reemplaza a la ayuda) o la ayuda, enlazados por `aria-describedby`. `TextField` admite ícono, prefijo y sufijo; los importes y fechas van en monoespaciado.
- **Selects propios, nunca el nativo**: `SelectField` (lista corta) y `Combobox` (lista larga, con buscador) comparten `Listbox`, así que se ven y se comportan igual. Ambos siguen los patrones ARIA de combobox: flechas, Home/End, Enter/Espacio, Esc y, en el Select, escribir salta a la opción. La lista se abre hacia arriba si no entra abajo. `onChange` recibe el valor, no el evento, y con `name` el valor viaja en un input oculto, así que sirven en formularios no controlados. El Combobox filtra sin distinguir mayúsculas ni acentos, y también por dígitos (útil para identificadores con guiones).
- **Controles de elección**: `Checkbox`, `RadioGroup` y `Switch` usan el `<input>` nativo (invisible o con `appearance-none`) y dibujan encima su apariencia, así conservan teclado, foco, formularios y lectores de pantalla. El foco solo se ve con teclado (`focus-visible`). `RadioGroup` va en un `<fieldset>` con `<legend>` siempre visible y su `onChange` recibe el valor. Elegí `Switch` para un ajuste que se aplica al instante y `Checkbox` para lo que se confirma al enviar el formulario.
