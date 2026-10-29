/** Hover de las filas de datos. */
export const tableRowHover = "transition-colors duration-[120ms] ease-standard hover:bg-surface-hover";

/*
 * Alineación de todas las tablas: la primera columna a la izquierda, el resto
 * centradas, 16px contra los bordes. Si la última columna son acciones
 * ("Ver detalle", editar), sumar `tableActionsColumn` a las dos filas para
 * alinearla a la derecha.
 *
 * Las celdas que envuelven su contenido en un flex tienen que centrarlo ellas
 * (`justify-center` / `items-center`): `text-center` no mueve elementos flex.
 */
export const tableHeadRow =
  "border-b border-line [&>th]:px-3 [&>th]:py-2.5 [&>th]:text-center [&>th]:font-medium [&>th:first-child]:pl-4 [&>th:first-child]:text-left [&>th:last-child]:pr-4";

export const tableBodyRow = `border-b border-line last:border-b-0 [&>td]:px-3 [&>td]:text-center [&>td:first-child]:pl-4 [&>td:first-child]:text-left [&>td:last-child]:pr-4 ${tableRowHover}`;

export const tableActionsColumn = "[&>th:last-child]:text-right [&>td:last-child]:text-right";

/** Contenedor de la tabla de escritorio. El `relative` es obligatorio: sin él, los `sr-only` (absolutos) de los <th> ensanchan la página en mobile. */
export const tableContainer = "relative hidden overflow-x-auto rounded-lg border border-line bg-surface-card md:block";
