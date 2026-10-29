import { DEFAULT_PAGE_SIZE, parsePageSize } from "@/shared/lib/pagination";

/**
 * Filtros del listado. Viven en la URL con los mismos nombres y valores que los
 * query params de la API: la URL se comparte y se pasa tal cual al backend.
 */
export type EntryFilters = {
  page: number;
  size: number;
  q?: string;
  status?: "ACTIVE" | "PENDING" | "CLOSED";
  date_from?: string;
  date_to?: string;
  category?: string;
  owner?: string;
};

const STATUSES = ["ACTIVE", "PENDING", "CLOSED"] as const;

type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  const single = Array.isArray(value) ? value[0] : value;
  return single?.trim() || undefined;
}

function positiveInt(value: string | undefined): number | undefined {
  if (!value || !/^\d+$/.test(value)) return undefined;
  const parsed = Number(value);
  return parsed > 0 ? parsed : undefined;
}

function isoDate(value: string | undefined): string | undefined {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : undefined;
}

/** Lee los filtros de la URL descartando valores inválidos (nunca rompe la pantalla). */
export function parseEntryFilters(params: RawSearchParams): EntryFilters {
  const status = first(params.status);
  return {
    page: positiveInt(first(params.page)) ?? 1,
    size: parsePageSize(first(params.size)),
    q: first(params.q),
    status: STATUSES.find((s) => s === status),
    date_from: isoDate(first(params.date_from)),
    date_to: isoDate(first(params.date_to)),
    category: first(params.category),
    owner: first(params.owner),
  };
}

/** Query string sin valores vacíos. `page=1` y el tamaño por defecto se omiten para que la URL quede limpia. */
export function toSearchParams(filters: Partial<EntryFilters>): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === "") continue;
    if (key === "page" && value === 1) continue;
    if (key === "size" && value === DEFAULT_PAGE_SIZE) continue;
    params.set(key, String(value));
  }
  return params;
}

export function entriesHref(filters: Partial<EntryFilters>): string {
  const query = toSearchParams(filters).toString();
  return query ? `/entries?${query}` : "/entries";
}

/** Filtros del drawer (el estado y el buscador van en la barra). */
export const DRAWER_FILTERS = ["date_from", "date_to", "category", "owner"] as const;
export type DrawerFilter = (typeof DRAWER_FILTERS)[number];

export function activeDrawerFilters(filters: EntryFilters): DrawerFilter[] {
  return DRAWER_FILTERS.filter((key) => filters[key] !== undefined);
}

export function isFiltered(filters: EntryFilters): boolean {
  return Object.entries(filters).some(([key, value]) => key !== "page" && key !== "size" && value !== undefined);
}
