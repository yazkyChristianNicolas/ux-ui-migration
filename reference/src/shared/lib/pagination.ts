// Sin "use client": lo usan tanto el servidor (leer `size` de la URL) como la paginación.
export const PAGE_SIZES = [10, 20, 50, 100];
export const DEFAULT_PAGE_SIZE = 10;

/** Cuántas páginas salta el "…". */
const ELLIPSIS_JUMP = 5;

export type PageItem = { kind: "page"; page: number } | { kind: "ellipsis"; side: "left" | "right"; target: number };

/**
 * Páginas a mostrar: hasta 7, todas; si hay más, `1 2 3 4 5 … N` al principio,
 * `1 … N-4 … N` al final y `1 … p-1 p p+1 … N` en el medio.
 */
export function pageItems(page: number, count: number): PageItem[] {
  const at = (n: number): PageItem => ({ kind: "page", page: n });
  const range = (from: number, to: number): PageItem[] => Array.from({ length: to - from + 1 }, (_, i) => at(from + i));
  const left: PageItem = { kind: "ellipsis", side: "left", target: Math.max(1, page - ELLIPSIS_JUMP) };
  const right: PageItem = { kind: "ellipsis", side: "right", target: Math.min(count, page + ELLIPSIS_JUMP) };

  if (count <= 7) return range(1, count);
  if (page <= 4) return [...range(1, 5), right, at(count)];
  if (page >= count - 3) return [at(1), left, ...range(count - 4, count)];
  return [at(1), left, at(page - 1), at(page), at(page + 1), right, at(count)];
}

/** `size` de la URL, solo si es uno de los tamaños ofrecidos. */
export function parsePageSize(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  return PAGE_SIZES.includes(parsed) ? parsed : DEFAULT_PAGE_SIZE;
}

/** `page` de la URL: entero positivo, o 1. */
export function parsePage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}
