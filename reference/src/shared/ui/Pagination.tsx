"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { cn } from "@/shared/lib/cn";
import { DEFAULT_PAGE_SIZE, pageItems, PAGE_SIZES } from "@/shared/lib/pagination";

import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

type PaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  /** Sustantivo en plural: "284 registros". */
  noun: string;
  /** Pantalla y resto de su query (filtros), sin `page` ni `size`. */
  path: string;
  query?: string;
  /**
   * Control del tamaño de página. Por defecto un <select> nativo; pasá el Select
   * de tu design system (recibe el valor actual y `onChange(valor)`).
   */
  renderPageSize?: (args: { value: number; options: number[]; onChange: (value: number) => void }) => React.ReactNode;
  labels?: { previous: string; next: string; pageSize: string; perPage: (size: number) => string };
};

const DEFAULT_LABELS = {
  previous: "Página anterior",
  next: "Página siguiente",
  pageSize: "Registros por página",
  perPage: (size: number) => `${size} / página`,
};

/**
 * Paginación alineada a la derecha: `284 registros  ‹ 1 2 3 4 5 … 29 ›  [10 / página]`.
 * En mobile: `‹ 3 / 29 ›`. Página y tamaño viajan en la URL (`page`, `size`), como los filtros.
 */
export function Pagination({ page, totalPages, total, pageSize, noun, path, query = "", renderPageSize, labels }: PaginationProps) {
  const router = useRouter();
  const text = { ...DEFAULT_LABELS, ...labels };
  const count = Math.max(totalPages, 1);

  function href(target: number, size = pageSize): string {
    const params = new URLSearchParams(query);
    params.delete("page");
    params.delete("size");
    if (target > 1) params.set("page", String(target));
    if (size !== DEFAULT_PAGE_SIZE) params.set("size", String(size));
    const qs = params.toString();
    return qs ? `${path}?${qs}` : path;
  }

  // Cambiar el tamaño vuelve a la página 1.
  const changeSize = (size: number) => router.push(href(1, size));

  return (
    <nav aria-label="Paginación" className="flex flex-wrap items-center justify-end gap-x-1 gap-y-2 py-1">
      <span className="mr-3 text-[13px] whitespace-nowrap text-fg-muted">
        <span className="font-mono tabular-nums">{total}</span> {noun}
      </span>
      <span className="flex items-center gap-0.5">
        <Arrow href={href(page - 1)} disabled={page <= 1} label={text.previous}>
          <ChevronLeftIcon />
        </Arrow>
        {/* Desktop: números con elipsis. */}
        <span className="hidden items-center gap-0.5 md:flex">
          {pageItems(page, count).map((item) =>
            item.kind === "page" ? (
              <Link
                key={item.page}
                href={href(item.page)}
                aria-current={item.page === page ? "page" : undefined}
                className={cn(
                  "flex h-8 min-w-8 items-center justify-center rounded-md border px-1.5 text-sm tabular-nums transition-colors duration-[120ms] hover:text-accent-hover",
                  item.page === page ? "border-accent font-semibold text-accent-hover" : "border-transparent text-fg-secondary",
                )}
              >
                {item.page}
              </Link>
            ) : (
              <Link
                key={item.side}
                href={href(item.target)}
                aria-label={item.side === "left" ? "5 páginas atrás" : "5 páginas adelante"}
                className="flex h-8 min-w-8 items-center justify-center rounded-md text-sm text-fg-muted hover:text-accent-hover"
              >
                …
              </Link>
            ),
          )}
        </span>
        {/* Mobile: "3 / 29". */}
        <span className="px-1.5 text-[13px] text-fg-secondary tabular-nums md:hidden">
          {page} / {count}
        </span>
        <Arrow href={href(page + 1)} disabled={page >= count} label={text.next}>
          <ChevronRightIcon />
        </Arrow>
      </span>
      <span className="ml-2">
        {renderPageSize ? (
          renderPageSize({ value: pageSize, options: PAGE_SIZES, onChange: changeSize })
        ) : (
          <select
            aria-label={text.pageSize}
            value={pageSize}
            onChange={(event) => changeSize(Number(event.target.value))}
            className="h-8 rounded-md border border-line-strong bg-surface-card px-2 text-[13px]"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {text.perPage(size)}
              </option>
            ))}
          </select>
        )}
      </span>
    </nav>
  );
}

function Arrow({ href, disabled, label, children }: { href: string; disabled: boolean; label: string; children: React.ReactNode }) {
  const className = "flex size-8 items-center justify-center rounded-md text-fg-secondary transition-colors duration-[120ms] [&>svg]:size-4";
  if (disabled) {
    return (
      <span role="link" aria-disabled="true" aria-label={label} title={label} className={cn(className, "opacity-40")}>
        {children}
      </span>
    );
  }
  return (
    <Link href={href} aria-label={label} title={label} className={cn(className, "hover:bg-surface-hover hover:text-fg")}>
      {children}
    </Link>
  );
}
