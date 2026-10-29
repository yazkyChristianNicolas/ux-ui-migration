"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "./Button";
import { Drawer } from "./Drawer";
import { ListFilterIcon, SearchIcon, XIcon } from "./icons";

export type AppliedFilter = {
  key: string;
  /** Etiqueta en el idioma del usuario ("Desde"). */
  label: string;
  /** Valor legible, nunca el crudo de la API. */
  value: string;
  /** URL con este filtro quitado. */
  removeHref: string;
};

type FilterBarProps<TDraft extends object> = {
  search: {
    label: string;
    placeholder: string;
    defaultValue?: string;
    onSubmit: (text: string) => void;
  };
  /** Controles rápidos a la derecha del buscador (ej. un select de estado que aplica al cambiar). */
  toolbar?: React.ReactNode;
  /** Filtros del drawer hoy aplicados (se muestran como pills y alimentan el contador). */
  applied: AppliedFilter[];
  clearAllHref: string;
  /** Valores del drawer hoy aplicados: el borrador arranca de acá cada vez que se abre. */
  committed: TDraft;
  /** Se llama al confirmar con "Aplicar": navegar a la URL nueva (siempre a la página 1). */
  onApply: (draft: TDraft) => void;
  /** Campos del drawer. Editan el borrador, no la URL. */
  children: (draft: TDraft, patch: (change: Partial<TDraft>) => void) => React.ReactNode;
  labels?: { filters: string; apply: string; clear: string; clearAll: string; applied: string; remove: (label: string) => string };
};

const DEFAULT_LABELS = {
  filters: "Filtros",
  apply: "Aplicar filtros",
  clear: "Limpiar",
  clearAll: "Limpiar todo",
  applied: "Filtros aplicados",
  remove: (label: string) => `Quitar filtro ${label}`,
};

/**
 * Barra de filtros de un listado: buscador + controles rápidos + botón "Filtros"
 * (drawer) + pills de los filtros aplicados.
 *
 * Reglas de UX:
 * - Los filtros viven en la URL (la barra no guarda estado propio salvo el borrador del drawer).
 * - El drawer edita un **borrador**: recién se aplica con "Aplicar"; cerrarlo lo descarta.
 * - El botón "Filtros" muestra cuántos hay activos; cada pill se quita sola y hay "Limpiar todo".
 */
export function FilterBar<TDraft extends object>({
  search,
  toolbar,
  applied,
  clearAllHref,
  committed,
  onApply,
  children,
  labels,
}: FilterBarProps<TDraft>) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<TDraft>(committed);

  function openDrawer() {
    setDraft(committed);
    setOpen(true);
  }

  return (
    <div className="flex flex-col gap-3">
      <form
        role="search"
        aria-label={search.label}
        className="flex flex-wrap items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          search.onSubmit(String(new FormData(event.currentTarget).get("search") ?? ""));
        }}
      >
        <label className="flex h-10 min-w-0 flex-[1_1_280px] items-center gap-2 rounded-md border border-line-strong bg-surface-card px-3 focus-within:shadow-focus">
          <SearchIcon className="size-4 shrink-0 text-fg-muted" />
          <input
            name="search"
            type="search"
            aria-label={search.label}
            placeholder={search.placeholder}
            defaultValue={search.defaultValue}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none focus-visible:shadow-none"
          />
        </label>
        {toolbar}
        <Button variant="secondary" aria-haspopup="dialog" onClick={openDrawer} className="shrink-0">
          <ListFilterIcon className="size-4" />
          {text.filters}
          {applied.length > 0 && (
            <span
              aria-label={`${applied.length} activos`}
              className="flex h-5 min-w-5 items-center justify-center rounded-full bg-surface-nav px-1.5 font-mono text-[11px] text-on-nav tabular-nums"
            >
              {applied.length}
            </span>
          )}
        </Button>
      </form>

      {applied.length > 0 && (
        <ul aria-label={text.applied} className="flex flex-wrap items-center gap-1.5">
          {applied.map((filter) => (
            <li
              key={filter.key}
              className="flex h-7 items-center gap-1 rounded-full border border-line bg-surface-card pr-1 pl-2.5 text-xs text-fg-secondary"
            >
              <span>{filter.label}:</span>
              <span className="font-medium text-fg">{filter.value}</span>
              <Link
                href={filter.removeHref}
                aria-label={text.remove(filter.label)}
                className="flex size-5 items-center justify-center rounded-full text-fg-muted hover:bg-surface-hover hover:text-fg"
              >
                <XIcon className="size-3.5" />
              </Link>
            </li>
          ))}
          <li>
            <Link href={clearAllHref} className="flex h-7 items-center px-2 text-xs font-medium text-fg-secondary hover:text-fg hover:underline">
              {text.clearAll}
            </Link>
          </li>
        </ul>
      )}

      <Drawer open={open} title={text.filters} size="sm" onClose={() => setOpen(false)}>
        <div className="flex flex-col gap-6">
          {children(draft, (change) => setDraft((current) => ({ ...current, ...change })))}
          <div className="flex justify-end gap-2 border-t border-line pt-4">
            <Button variant="ghost" onClick={() => setDraft({} as TDraft)}>
              {text.clear}
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
                onApply(draft);
              }}
            >
              {text.apply}
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
