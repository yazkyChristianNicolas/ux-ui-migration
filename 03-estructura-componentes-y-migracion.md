# Migración del backoffice de Ant Design a una arquitectura feature based

## Contexto y objetivo

Este backoffice hoy está construido con Ant Design (antd). Quiero migrarlo de forma **incremental** a:
1. Una estructura **feature based** más limpia (secciones 1 y 2).
2. Un sistema de componentes propio y una UX más cuidada, basados en el patrón de una webapp de referencia que te describo abajo (secciones 3 a 9: sidebar retráctil, breadcrumbs en la topbar, cerrar sesión, tablas con paginado en la URL, filtros en drawer con pills, y versión mobile con BottomNav y listas).

No es un big-bang: la app tiene que seguir funcionando y desplegable después de cada etapa. Antd y los componentes nuevos van a convivir hasta migrar la última pantalla.

Los nombres y rutas de ejemplo (`/entries`, `EntryTable`) son genéricos: adaptalos al dominio de este proyecto. El código de referencia está en [`reference/`](reference/README.md).

## 0. Antes de escribir código: diagnóstico

Inspeccioná y reportame:
- Framework y router (Next App Router / Pages / Vite + React Router), versión de React y de antd, TypeScript sí/no, gestor de estado y data fetching actuales.
- Cómo se usa antd hoy: qué componentes (`Layout`/`Sider`, `Menu`, `Breadcrumb`, `Table`, `Form`, `Select`, `DatePicker`, `Drawer`, `Modal`, `Pagination`, `message`/`notification`…), si hay `ConfigProvider`/tema custom, `@ant-design/icons`, y si hay Less/CSS overrides.
- Mapa de pantallas, con cuántos componentes de antd usa cada una (para elegir la piloto y el orden).
- Dónde viven hoy los filtros y la paginación de las tablas (estado local, store, URL) y cómo se resuelve mobile (o si no se resuelve).
- Estructura actual de carpetas y qué se comparte entre pantallas.

## Estrategia de migración (strangler)

1. **Estilos sin conflicto.** Decidí y justificame cómo conviven los estilos nuevos (Tailwind v4 con tokens en `@theme`, o CSS modules) con el CSS-in-JS de antd: orden de capas, el reset (el preflight de Tailwind puede pisar estilos de antd; usar `@layer` o limitar su alcance), y que antd siga con su `ConfigProvider` hasta el final. Los tokens (colores, radios, sombras, espaciados de sidebar/topbar) se definen una sola vez; si antd tiene un tema, alinealo a los mismos tokens para que las pantallas no migradas no desentonen.
2. **Primero `shared/ui`, después pantallas.** Construí los primitivos (Button, Field/Select/Combobox/DateField, Drawer, Dialog, Pagination, PageHeader, EmptyState, MobileList, helpers de tabla) **sin tocar pantallas**, cada uno con su test. Equivalencias:

   | Antd | Reemplazo |
   |---|---|
   | `Layout` + `Sider` + `Menu` | `Sidebar` + `BottomNav` (mobile) alimentados por un `NAV_ITEMS` |
   | `Layout.Header` + `Breadcrumb` + `PageHeader` | `PageHeader` con slot `breadcrumb` (link al padre + `/`) |
   | `Table` (con su `pagination`, `filters`, `sorter`) | `<table>` con clases compartidas + `Pagination` propia + `MobileList` |
   | `Pagination` / `Table.pagination` en estado local | `Pagination` con `page` y `size` en la URL |
   | `Drawer` / `Modal` | `Drawer` / `Dialog` sobre `<dialog>` nativo (hoja inferior en mobile) |
   | `Select` / `AutoComplete` | `SelectField` / `Combobox` (`onChange` recibe el valor) |
   | `Form` + `Form.Item` | Campos controlados o `name` + `defaultValue`; validación en `lib/` pura con tests |
   | `Dropdown` de usuario / logout | `LogoutButton` (form + server action o handler de signOut) en el footer del sidebar y de "Más" |
   | `@ant-design/icons` | `shared/ui/icons.tsx` (un solo set, trazo uniforme) |

   Si algún componente de antd es caro de reemplazar (DatePicker avanzado, Upload, Tree), **dejalo** y envolvelo en `shared/ui` con la interfaz nueva, así se puede cambiar después sin tocar las pantallas.
3. **Layout primero.** Migrá el shell (Sidebar, PageHeader, BottomNav, logout) antes que las pantallas internas: así toda pantalla nueva o migrada ya vive en el layout definitivo. Mientras haya pantallas sin migrar, aceptá que algunas se rendericen dentro del shell nuevo con su contenido antd.
4. **Pantalla piloto.** Elegí la pantalla con tabla + filtros + paginación más representativa y migrala completa (tabla, filtros en drawer, paginación en la URL, lista mobile, empty states, tests). Pará y mostrámela antes de seguir.
5. **Resto por feature.** Cada pantalla se migra moviendo su código a `features/<feature>/{api,components,lib,types.ts}` en el mismo cambio, un feature por PR. Al terminar un feature no debería quedar ningún import de antd en él.
6. **Cierre.** Cuando no queden imports de antd: sacá `ConfigProvider`, el tema, `@ant-design/icons` y la dependencia, y borrá los overrides de CSS. Agregá una regla de ESLint (`no-restricted-imports`) contra `antd` desde la etapa 5 en los features ya migrados, para que no vuelva a entrar.

## UX a mejorar en el camino (no solo cambiar de librería)

- Filtros y paginación en la URL (compartibles, funcionan con "atrás"), en vez de estado local.
- Filtros del drawer con borrador + "Aplicar", pills de filtros activos y "Limpiar todo".
- Estados vacíos distintos para "sin resultados con estos filtros" y "todavía no hay datos".
- Versión mobile real (BottomNav + listas de dos líneas + hojas inferiores), no solo la tabla con scroll.
- Sidebar retráctil que recuerda el estado sin parpadear.
- Accesibilidad: `aria-current`, `aria-label` en acciones de tabla, foco y Esc en drawers, textos en el idioma del usuario (nunca valores crudos de la API).

---

## 1. Organización de carpetas (feature based)

```
src/
  app/                  # Solo routing: páginas/layouts finos que componen features. Sin lógica.
    (protected)/        # Todo lo que requiere sesión; su layout.tsx llama a requireSession()
  features/<feature>/   # Todo lo de un dominio vive junto
    api/  components/  lib/  mocks/  types.ts
  shared/               # Transversal, sin dominio
    lib/                # utilidades puras (cn, formatos, pagination.ts)
    ui/                 # sistema de diseño: Button, Field, Select, Drawer, Dialog, Pagination,
                        # PageHeader, MobileList, EmptyState, table.ts, icons.tsx
    ui/navigation/      # Sidebar, SidebarToggle, BottomNav, sidebar-state.ts
```

Reglas:
- `shared/` nunca importa de `features/` (validarlo con ESLint).
- Un feature no importa internals de otro (excepción: `features/auth`).
- Server Components por defecto; `"use client"` solo donde hay interacción.
- Los tests van al lado del archivo (`Foo.tsx` → `Foo.test.tsx`).
- Íconos solo desde `shared/ui/icons.tsx`. Nunca pasar un componente de ícono de Server a Client: pasarlo ya renderizado (`<FileTextIcon />`).

## 2. Layout protegido

`app/(protected)/layout.tsx` (Server Component, async):
1. `await requireSession()`.
2. Define un objeto `NAV_ITEMS` (label, `shortLabel` opcional para mobile, icon ya renderizado, href) y arma las listas de sidebar y de bottom nav a partir de él (una sola fuente de verdad).
3. Renderiza `<div className="flex min-h-screen">` con `<Sidebar logo collapsedLogo items footer={<LogoutButton/>}/>` y una columna `flex min-w-0 flex-1 flex-col` que contiene `{children}` y `<BottomNav items more moreFooter={<LogoutButton variant="sheet"/>}/>`.

## 3. Sidebar (escritorio, ≥768px)

- `shared/ui/navigation/Sidebar.tsx`, Client Component. Recibe `logo`, `collapsedLogo`, `items`, `footer` por props (no conoce el dominio).
- `<aside>` `sticky top-0 hidden h-screen shrink-0 flex-col md:flex`, ancho 248px expandido / 72px contraído (tokens `--spacing-sidebar` y `--spacing-sidebar-collapsed`), con transición de ancho.
- Ítem activo: `pathname === href || pathname.startsWith(href + "/")` → fila tintada + barra de acento de 3px a la izquierda + `aria-current="page"`.
- Ítem sin `href` = pantalla que aún no existe: se muestra deshabilitado (`aria-disabled`, title "Próximamente"), no se inventa.
- Contraído: solo ícono, el nombre queda en `title`/`aria-label`.
- Estado contraído: **sin React ni parpadeo**. Vive en `localStorage` y se refleja como `<html data-sidebar="collapsed">`.
  - `sidebar-state.ts` exporta: la key, el evento de cambio, `readSidebarCollapsed`, `subscribeSidebar` (para `useSyncExternalStore`, escucha el evento propio y `storage` para otras pestañas), `applySidebarCollapsed` y `SIDEBAR_INIT_SCRIPT`.
  - Ese script se inyecta inline en el `<head>` del layout raíz (con `suppressHydrationWarning` en `<html>`) y aplica el atributo antes de pintar.
  - En CSS: `@custom-variant sidebar-collapsed (:where([data-sidebar="collapsed"]) &);` y se usa como `sidebar-collapsed:w-sidebar-collapsed`, `sidebar-collapsed:hidden`, etc.
  - Todos los accesos a `localStorage` van en try/catch.
- `SidebarToggle.tsx`: botón con ícono de panel, a la izquierda del título dentro del `PageHeader`, solo escritorio (`hidden md:flex`), con `aria-expanded` y label "Contraer menú" / "Expandir menú", más un divisor vertical. Usa `useSyncExternalStore(subscribe, read, () => false)` y un `useLayoutEffect` que reaplica el atributo (Strict Mode en dev lo borra al remontar `<html>`).

## 4. Topbar y breadcrumbs: `PageHeader`

`shared/ui/PageHeader.tsx` (Server Component), props: `title`, `subtitle?`, `breadcrumb?: ReactNode`, `actions?: ReactNode`.
- `<header>` `sticky top-0 z-10`, alto fijo (token `--spacing-topbar`: 64px), borde inferior, fondo de card, `px-header`.
- Contenido: `SidebarToggle`, bloque `min-w-0` con el breadcrumb (arriba, texto chico y apagado), `<h1 className="truncate">` y subtítulo opcional, un `flex-1` y las `actions` a la derecha. El título se corta con "…" antes de empujar las acciones.
- **El breadcrumb no es un componente genérico**: cada página de detalle o sub-pantalla pasa un fragmento con link a la pantalla padre y un separador:
  ```tsx
  breadcrumb={<><TextLink href="/entries" className="font-normal text-muted">Registros</TextLink><span aria-hidden>/</span></>}
  ```
  Las pantallas raíz del menú no llevan breadcrumb.
- Cada página arma `<> <PageHeader .../> <div className="mx-auto flex w-full max-w-content flex-1 flex-col gap-5 px-page py-page">…</div> </>`.

## 5. Cerrar sesión

- `features/auth/actions.ts` (`"use server"`): `logout()` → `signOut({ redirectTo: "/login" })`.
- `features/auth/components/LogoutButton.tsx`: un `<form action={logout}>` (funciona sin JS) con prop `variant`:
  - `"sidebar"` (default): al pie del sidebar, separado por un borde superior. Renderiza dos botones submit: uno con texto (`sidebar-collapsed:hidden`) y otro solo con ícono + `title`/`aria-label` (`hidden sidebar-collapsed:flex`).
  - `"sheet"`: botón secundario de ancho completo, para el pie de la hoja "Más" en mobile.
- Se pasa como `footer` del Sidebar y como `moreFooter` del BottomNav desde el layout. Ni el Sidebar ni el BottomNav importan de `features/auth`.

## 6. Tablas + paginación

**Estilos compartidos** en `shared/ui/table.ts`: exporta `tableHeadRow`, `tableBodyRow`, `tableRowHover` y `tableActionsColumn` (strings de clases). Convención: primera columna a la izquierda, el resto centradas, 16px contra los bordes, última columna de acciones alineada a la derecha. Las celdas con flex deben centrar ellas mismas (`justify-center`).

**Cada tabla** (ej. `EntryTable`):
- Contenedor `relative hidden overflow-x-auto rounded-lg border md:block` (el `relative` es obligatorio: sin él, los `sr-only` absolutos de los `<th>` ensanchan la página en mobile).
- `<table className="w-full min-w-[Npx] table-fixed border-collapse">` con `<colgroup>` y un array `COLUMN_WIDTHS` cuya suma entre en el ancho de contenido para no generar scroll horizontal.
- `thead` con fondo "sunken"; `<th>` de acciones con `<span className="sr-only">Acciones</span>`.
- Montos, fechas, documentos y identificadores con helpers de `shared/lib/format.ts` y `font-mono tabular-nums`.
- Links de "Ver detalle" con `prefetch={false}` y `aria-label` descriptivo.

**Paginación** (`shared/ui/Pagination.tsx`, Client Component) + lógica pura en `shared/lib/pagination.ts` (sin `"use client"`, porque la usan servidor y cliente: importar constantes de un módulo `"use client"` desde el servidor llega como referencia de cliente):
- `PAGE_SIZES = [10, 20, 50, 100]`, `DEFAULT_PAGE_SIZE = 10`, `parsePage`, `parsePageSize` (valida contra la lista) y `pageItems(page, count)` (≤7 páginas: todas; si no `1 2 3 4 5 … N` / `1 … N-4..N` / `1 … p-1 p p+1 … N`; la elipsis salta 5 páginas).
- Props: `page`, `totalPages`, `total`, `pageSize`, `noun` (plural: "284 registros"), `path`, `query` (resto de filtros sin `page`/`size`).
- Página y tamaño viajan **en la URL** (`page`, `size`); los links son `<Link>` armados con `URLSearchParams` (se omiten `page=1` y el `size` por defecto). Cambiar el tamaño vuelve a la página 1.
- Desktop: `total noun ‹ 1 2 3 … N › [10 / página]` (selector con `SelectField`). Mobile: `‹ 3 / 29 ›`. Ambas versiones con clases `hidden md:flex` / `md:hidden`.
- Flechas deshabilitadas como `<span aria-disabled>` con opacidad reducida.

**La página (Server Component)** hace: `parseXFilters(await searchParams)` → fetch en paralelo de datos + opciones de filtros → renderiza `Filters`, `Table`, `MobileList` y `Pagination` si hay datos; si no, `EmptyState` distinto para "no hay resultados con estos filtros" (con link "Limpiar filtros") y "todavía no hay nada" (con la acción principal).

## 7. Filtros en Drawer

**Drawer** (`shared/ui/Drawer.tsx`, Client Component): `<dialog>` nativo con `showModal()/close()` en un `useEffect` según `open` (foco atrapado y Esc los resuelve el navegador; `onCancel` hace `preventDefault` y llama `onClose`; click en el backdrop cierra). Props: `open`, `title`, `subtitle?`, `size: "md" (620px) | "sm" (420px)`, `onClose`, `children`. Header con título y botón X; cuerpo con `overflow-y-auto`. En mobile (`max-md:`) se convierte en hoja desde abajo (`bottom-0`, ancho completo, `max-h-[92vh]`, esquinas superiores redondeadas, `pb-[env(safe-area-inset-bottom)]`).

**Barra de filtros del listado** (`features/<x>/components/XFilters.tsx`, Client Component):
- Fila `flex flex-wrap`: buscador (form `role="search"`, submit con Enter), `SelectField` de estado (la opción elegida lleva el prefijo "Estado: …") y botón secundario "Filtros" con un contador (badge) de filtros del drawer activos.
- **Los filtros viven en la URL con los mismos nombres que los query params de la API.** Cualquier cambio navega con `router.push(xHref({...filters, page: 1}))` (siempre vuelve a la página 1).
- El **drawer edita un borrador** (`useState<Draft>`): se inicializa con los filtros activos al abrir; "Aplicar filtros" cierra y navega; cerrar sin aplicar lo descarta; "Limpiar" vacía el borrador.
- Los filtros aplicados del drawer se muestran debajo como **pills** (`<ul aria-label="Filtros aplicados">`): "Etiqueta: valor legible" + link ✕ ("Quitar filtro …") + link "Limpiar todo". Los valores se muestran en el idioma del usuario, nunca el valor crudo de la API.
- Dentro del drawer, nunca `<select>` nativo: `SelectField` o, si la lista es larga, `Combobox` (comparten `Listbox`; `onChange` recibe el valor, no el evento).
- La página pone `key={xHref({...filters, page: 1})}` en el componente para remontarlo cuando cambia la URL y que los campos reflejen el estado actual.
- Lógica pura en `features/<x>/lib/filters.ts` (con tests): tipo `XFilters`, `DRAWER_FILTERS` (qué claves van en el drawer), `parseXFilters(searchParams)` (descarta valores inválidos, nunca rompe la pantalla), `toSearchParams`, `xHref`, `activeDrawerFilters`, `isFiltered`.

## 8. Mobile (<768px, breakpoint `md`)

Todo con CSS (`hidden md:block`, `md:hidden`), **sin detectar el ancho en JS**. Consecuencia: en el DOM y en jsdom conviven las dos versiones; en tests buscar por rol (ignora lo oculto) o filtrar `{ visible: true }`.

- **Sidebar → `BottomNav`** (`shared/ui/navigation/BottomNav.tsx`, Client Component): barra `fixed inset-x-0 bottom-0 md:hidden`, `grid-cols-5` con 4 pantallas (ícono + `shortLabel ?? label`, activo con `aria-current`) y un botón "Más" que abre un `Drawer` (hoja inferior) con el resto de los ítems y `moreFooter` (cerrar sesión). Si la ruta activa está en "Más", ese botón se marca activo. Incluye un espaciador `h-[88px] md:hidden` para que la barra no tape el final de la pantalla y respeta `safe-area-inset-bottom`. Se oculta (`return null`) en pantallas que usan ese lugar para su propia barra de acción (ej. un formulario largo).
- **Tabla → `MobileList`** (`shared/ui/MobileList.tsx`): `MobileList` (`<ul md:hidden>` con `aria-label`), `MobileListRow` con `top: [izq, der?]`, `bottom: [izq, der?]`, `extra?`, y `href` (link directo) **o** `onSelect` (abre una hoja de detalle); alto mínimo 64px. `DetailFields` renderiza pares etiqueta/valor (`<dl>`) para la hoja de detalle. Cada feature tiene su `XMobileList.tsx` al lado de su `XTable.tsx`, y ambos se renderizan en la página; la tabla va con `hidden md:block` (exportar la constante `tableDesktopOnly`).
- **Dialog y Drawer** se vuelven hojas desde abajo.
- **Márgenes fluidos** con utilidades en `globals.css`: `px-page`, `py-page`, `pt-page` (`clamp(16px, 4vw, 32px/24px)`), `px-header` y `p-card`.
- Los E2E de mobile van en `*.mobile.spec.ts` (proyecto `mobile` de Playwright).

## 9. Tokens y estilos

Los colores, radios, sombras y espaciados (`sidebar`, `sidebar-collapsed`, `topbar`, `content`) se definen una sola vez en `@theme` de `globals.css`. No usar valores sueltos fuera de esos tokens. Transiciones de 120ms (hover) / 180ms (ancho del sidebar) con un easing común.

---

## Cómo quiero que trabajes

1. Hacé el diagnóstico de la sección 0 y mostrámelo con las diferencias respecto del patrón. No toques código todavía.
2. Proponé un plan en etapas chicas, cada una desplegable por separado, con la pantalla piloto elegida y por qué. Esperá mi aprobación.
3. Una etapa por vez, cada una en su commit o PR. Después de cada etapa corré lint, typecheck y tests, y verificá en el navegador que las pantallas antd restantes no se rompieron (reset de CSS, fuentes, z-index de modales).
4. Si algo del patrón no encaja con este proyecto, decímelo y proponé una alternativa en vez de forzarlo.
5. No uses `git add -A`; agregá rutas explícitas.
