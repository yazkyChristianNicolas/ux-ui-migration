/** Formatos de ejemplo; reemplazalos por los de tu producto. */
export function formatDate(iso: string, locale = "es-AR"): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: "short", timeZone: "UTC" }).format(new Date(iso));
}

export function formatMoney(cents: number, currency = "ARS", locale = "es-AR"): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(cents / 100);
}
