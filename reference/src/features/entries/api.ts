// Stub de la capa de datos (server-only). En el proyecto real: llamadas al backend con
// el token de sesión, desde Server Components / Server Actions / Route Handlers.
import type { EntryFilters } from "./lib/filters";
import type { EntrySearchResponse } from "./types";

export async function searchEntries(_filters: EntryFilters): Promise<EntrySearchResponse> {
  return { data: [], meta: { current_page: 1, total_pages: 1, total_elements: 0 } };
}
