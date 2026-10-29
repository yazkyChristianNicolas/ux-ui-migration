"use client";

import { useRouter } from "next/navigation";

import { formatDate } from "@/shared/lib/format";
import { FilterBar } from "@/shared/ui/FilterBar";

import { activeDrawerFilters, DRAWER_FILTERS, entriesHref, type DrawerFilter, type EntryFilters as Filters } from "../lib/filters";

type Draft = Partial<Pick<Filters, DrawerFilter>>;

const LABELS: Record<DrawerFilter, string> = { date_from: "Desde", date_to: "Hasta", category: "Categoría" };

function display(key: DrawerFilter, filters: Filters): string {
  const value = filters[key];
  // Siempre el texto del usuario, nunca el valor crudo de la API.
  return key === "category" ? `Categoría ${value}` : formatDate(String(value));
}

/**
 * Filtros del listado: la URL es la fuente de verdad. Cualquier cambio navega y
 * vuelve a la página 1. En el drawer, usá los campos de tu design system; acá van
 * inputs simples para mostrar el patrón (un <select> nativo se reemplaza por tu Select).
 */
export function EntryFilters({ filters }: { filters: Filters }) {
  const router = useRouter();
  const base = { ...filters, page: 1 };
  const active = activeDrawerFilters(filters);

  return (
    <FilterBar<Draft>
      search={{
        label: "Buscar registros",
        placeholder: "Buscá por referencia",
        defaultValue: filters.q ?? "",
        onSubmit: (text) => router.push(entriesHref({ ...base, q: text.trim() || undefined })),
      }}
      applied={active.map((key) => ({
        key,
        label: LABELS[key],
        value: display(key, filters),
        removeHref: entriesHref({ ...base, [key]: undefined }),
      }))}
      clearAllHref={entriesHref({ ...base, ...Object.fromEntries(active.map((key) => [key, undefined])) })}
      committed={Object.fromEntries(active.map((key) => [key, filters[key]])) as Draft}
      onApply={(draft) => router.push(entriesHref({ ...base, ...Object.fromEntries(DRAWER_FILTERS.map((key) => [key, draft[key]])) }))}
    >
      {(draft, patch) => (
        <>
          <fieldset className="grid grid-cols-2 gap-3">
            <legend className="mb-2 text-[13px] font-medium">Fecha</legend>
            <input
              type="date"
              aria-label="Desde"
              value={draft.date_from ?? ""}
              onChange={(e) => patch({ date_from: e.target.value || undefined })}
              className="h-10 rounded-md border border-line-strong bg-surface-card px-3 text-sm"
            />
            <input
              type="date"
              aria-label="Hasta"
              value={draft.date_to ?? ""}
              onChange={(e) => patch({ date_to: e.target.value || undefined })}
              className="h-10 rounded-md border border-line-strong bg-surface-card px-3 text-sm"
            />
          </fieldset>
          <label className="flex flex-col gap-1.5 text-[13px] font-medium">
            Categoría
            <select
              value={draft.category ?? ""}
              onChange={(e) => patch({ category: e.target.value || undefined })}
              className="h-10 rounded-md border border-line-strong bg-surface-card px-3 text-sm font-normal"
            >
              <option value="">Todas</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </label>
        </>
      )}
    </FilterBar>
  );
}
