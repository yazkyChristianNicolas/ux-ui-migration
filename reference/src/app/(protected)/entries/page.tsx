import type { Metadata } from "next";
import Link from "next/link";

import { searchEntries } from "@/features/entries/api";
import { EntryFilters } from "@/features/entries/components/EntryFilters";
import { EntryMobileList } from "@/features/entries/components/EntryMobileList";
import { EntryTable } from "@/features/entries/components/EntryTable";
import { entriesHref, isFiltered, parseEntryFilters, toSearchParams } from "@/features/entries/lib/filters";
import { buttonVariants } from "@/shared/ui/Button";
import { EmptyState } from "@/shared/ui/EmptyState";
import { SearchXIcon } from "@/shared/ui/icons";
import { PageHeader } from "@/shared/ui/PageHeader";
import { Pagination } from "@/shared/ui/Pagination";
import { TextLink } from "@/shared/ui/TextLink";

export const metadata: Metadata = { title: "Registros" };

/**
 * Página de listado = composición, sin lógica: filtros (URL) → fetch → tabla +
 * lista mobile + paginación, o el estado vacío que corresponda.
 */
export default async function EntriesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const filters = parseEntryFilters(await searchParams);
  const { data: entries, meta } = await searchEntries(filters);

  return (
    <>
      <PageHeader
        title="Registros"
        actions={
          <Link href="/entries/new" className={buttonVariants({ variant: "primary" })}>
            Nuevo registro
          </Link>
        }
      />
      <div className="mx-auto flex w-full max-w-content flex-1 flex-col gap-5 px-page py-page">
        <EntryFilters
          // Remonta la barra al cambiar la URL para que los campos reflejen los filtros actuales.
          key={entriesHref({ ...filters, page: 1 })}
          filters={filters}
        />

        {entries.length > 0 ? (
          <>
            <EntryTable entries={entries} />
            <EntryMobileList entries={entries} />
            <Pagination
              page={meta.current_page}
              totalPages={meta.total_pages}
              total={meta.total_elements}
              pageSize={filters.size}
              noun="registros"
              path="/entries"
              query={toSearchParams({ ...filters, page: undefined, size: undefined }).toString()}
            />
          </>
        ) : isFiltered(filters) ? (
          <EmptyState
            icon={<SearchXIcon />}
            title="No hay registros con estos filtros"
            body="Probá con otras fechas u otra categoría."
            action={<TextLink href="/entries">Limpiar filtros</TextLink>}
          />
        ) : (
          <EmptyState title="Todavía no hay registros" body="Cuando crees el primero, lo vas a ver acá." />
        )}
      </div>
    </>
  );
}
