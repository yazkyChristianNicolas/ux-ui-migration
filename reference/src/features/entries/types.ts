/** Registro de ejemplo; reemplazalo por la entidad de tu dominio. */
export type Entry = {
  id: string;
  reference: string;
  category: "A" | "B" | "C";
  status: "ACTIVE" | "PENDING" | "CLOSED";
  date: string; // ISO yyyy-mm-dd
  amount: number; // centavos
};

export type EntrySearchResponse = {
  data: Entry[];
  meta: { current_page: number; total_pages: number; total_elements: number };
};
