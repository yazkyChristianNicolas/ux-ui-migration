import { StatusBadge } from "@/shared/ui/StatusBadge";

import { ENTRY_STATUS } from "../lib/status";
import type { Entry } from "../types";

export function EntryStatusBadge({ status, size }: { status: Entry["status"]; size?: "sm" | "md" }) {
  const { label, tone } = ENTRY_STATUS[status];
  return (
    <StatusBadge tone={tone} size={size}>
      {label}
    </StatusBadge>
  );
}
