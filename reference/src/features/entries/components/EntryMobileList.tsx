import { formatDate, formatMoney } from "@/shared/lib/format";
import { MobileList, MobileListRow } from "@/shared/ui/MobileList";

import type { Entry } from "../types";
import { EntryStatusBadge } from "./EntryStatusBadge";

/** Lista de mobile: referencia y monto arriba; fecha y estado abajo. Tocar una fila abre su detalle. */
export function EntryMobileList({ entries }: { entries: Entry[] }) {
  return (
    <MobileList label="Registros">
      {entries.map((entry) => (
        <MobileListRow
          key={entry.id}
          href={`/entries/${entry.id}`}
          label={`Ver detalle de ${entry.reference}`}
          top={[
            <span key="r" className="font-mono text-[13px] font-medium tabular-nums">
              {entry.reference}
            </span>,
            <span key="m" className="font-mono text-sm font-semibold tabular-nums">
              {formatMoney(entry.amount)}
            </span>,
          ]}
          bottom={[formatDate(entry.date), <EntryStatusBadge key="s" status={entry.status} size="sm" />]}
        />
      ))}
    </MobileList>
  );
}
