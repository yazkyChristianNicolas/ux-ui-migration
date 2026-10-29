import { formatDate, formatMoney } from "@/shared/lib/format";
import { cn } from "@/shared/lib/cn";
import { tableActionsColumn, tableBodyRow, tableContainer, tableHeadRow } from "@/shared/ui/table";
import { TextLink } from "@/shared/ui/TextLink";

import type { Entry } from "../types";

/** Anchos de columna: la suma tiene que entrar en el ancho de contenido para no generar scroll horizontal. */
const COLUMN_WIDTHS = [180, 120, 140, 160, 120];

/** Tabla de escritorio (oculta en mobile, donde va `EntryMobileList`). */
export function EntryTable({ entries }: { entries: Entry[] }) {
  return (
    <div className={tableContainer}>
      <table className="w-full min-w-[720px] table-fixed border-collapse">
        <colgroup>
          {COLUMN_WIDTHS.map((width, index) => (
            <col key={index} style={{ width }} />
          ))}
        </colgroup>
        <thead className="bg-surface-sunken text-xs text-fg-muted">
          <tr className={cn(tableHeadRow, tableActionsColumn)}>
            <th>Referencia</th>
            <th>Fecha</th>
            <th>Monto</th>
            <th>Estado</th>
            <th>
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className={cn(tableBodyRow, tableActionsColumn, "h-[52px]")}>
              {/* Montos, fechas e identificadores: monoespaciado y cifras tabulares. */}
              <td className="font-mono text-[13px] font-medium tabular-nums">{entry.reference}</td>
              <td className="font-mono text-xs text-fg-muted">{formatDate(entry.date)}</td>
              <td className="font-mono text-sm font-medium tabular-nums">{formatMoney(entry.amount)}</td>
              <td className="text-[13px]">{entry.status}</td>
              <td className="text-[13px]">
                {/* Sin prefetch: serían N consultas del detalle por cada página del listado. */}
                <TextLink href={`/entries/${entry.id}`} prefetch={false} aria-label={`Ver detalle de ${entry.reference}`}>
                  Ver detalle
                </TextLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
