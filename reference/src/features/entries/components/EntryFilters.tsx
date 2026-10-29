"use client";

import { useRouter } from "next/navigation";

import { formatDate } from "@/shared/lib/format";
import { Combobox } from "@/shared/ui/Combobox";
import { DateField, SelectField } from "@/shared/ui/Field";
import { FilterBar } from "@/shared/ui/FilterBar";

import { activeDrawerFilters, DRAWER_FILTERS, entriesHref, type DrawerFilter, type EntryFilters as Filters } from "../lib/filters";

type Draft = Partial<Pick<Filters, DrawerFilter>>;

const LABELS: Record<DrawerFilter, string> = { date_from: "Desde", date_to: "Hasta", category: "Categoría", owner: "Responsable" };

// En la app real estas opciones llegan de la API (catálogos), ya traducidas.
const CATEGORIES = [
  { value: "A", label: "Categoría A" },
  { value: "B", label: "Categoría B" },
  { value: "C", label: "Categoría C" },
];
const OWNERS = [
  { value: "u1", label: "Ana Pérez" },
  { value: "u2", label: "Bruno Díaz" },
  { value: "u3", label: "Carla Gómez" },
];

function display(key: DrawerFilter, filters: Filters): string {
  const value = filters[key];
  // Siempre el texto del usuario, nunca el valor crudo de la API.
  if (key === "category") return CATEGORIES.find((option) => option.value === value)?.label ?? String(value);
  if (key === "owner") return OWNERS.find((option) => option.value === value)?.label ?? String(value);
  return formatDate(String(value));
}

/**
 * Filtros del listado: la URL es la fuente de verdad. Cualquier cambio navega y
 * vuelve a la página 1.
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
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-[13px] font-medium">Fecha</legend>
            <div className="grid grid-cols-2 gap-3">
              <DateField
                id="filter-date-from"
                label="Desde"
                value={draft.date_from ?? ""}
                onChange={(event) => patch({ date_from: event.target.value || undefined })}
              />
              <DateField
                id="filter-date-to"
                label="Hasta"
                value={draft.date_to ?? ""}
                onChange={(event) => patch({ date_to: event.target.value || undefined })}
              />
            </div>
          </fieldset>
          {/* Lista corta: Select. */}
          <SelectField
            id="filter-category"
            label="Categoría"
            options={[{ value: "", label: "Todas" }, ...CATEGORIES]}
            value={draft.category ?? ""}
            onChange={(value) => patch({ category: value || undefined })}
          />
          {/* Lista larga (clientes, productos…): Combobox con buscador. */}
          <Combobox
            id="filter-owner"
            label="Responsable"
            placeholder="Todos"
            emptyMessage="Ningún responsable coincide."
            options={[{ value: "", label: "Todos" }, ...OWNERS]}
            value={draft.owner ?? ""}
            onChange={(value) => patch({ owner: value || undefined })}
          />
        </>
      )}
    </FilterBar>
  );
}
