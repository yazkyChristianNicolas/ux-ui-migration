import type { StatusTone } from "@/shared/ui/StatusBadge";

import type { Entry } from "../types";

/** Diccionario valor de la API → texto del usuario + tono. La UI nunca muestra el valor crudo. */
export const ENTRY_STATUS: Record<Entry["status"], { label: string; tone: StatusTone }> = {
  ACTIVE: { label: "Activo", tone: "success" },
  PENDING: { label: "Pendiente", tone: "warning" },
  CLOSED: { label: "Cerrado", tone: "neutral" },
};
