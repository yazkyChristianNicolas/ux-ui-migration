import Link from "next/link";

import { cn } from "@/shared/lib/cn";

/**
 * Listados en mobile (<768px): cada tabla se reemplaza por una lista de filas
 * de dos líneas; tocar una abre una hoja con el detalle (ver `DetailFields`) o
 * va directo a su pantalla (`href`). La tabla de escritorio va con `tableContainer`
 * (oculta en mobile); las dos versiones conviven en el DOM y se alternan con CSS.
 */
export function MobileList({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <ul aria-label={label} className={cn("overflow-hidden rounded-lg border border-line bg-surface-card md:hidden", className)}>
      {children}
    </ul>
  );
}

type MobileListRowProps = {
  /** Primera línea: [izquierda, derecha]. */
  top: [React.ReactNode, React.ReactNode?];
  /** Segunda línea, en texto chico y apagado. */
  bottom: [React.ReactNode, React.ReactNode?];
  /** Tercera línea opcional, también apagada. */
  extra?: React.ReactNode;
  /** La fila es un botón (abre una hoja de detalle)… */
  onSelect?: () => void;
  /** …o un link (va directo a otra pantalla). */
  href?: string;
  /** Nombre accesible del botón o link. */
  label?: string;
};

export function MobileListRow({ top, bottom, extra, onSelect, href, label }: MobileListRowProps) {
  const content = (
    <>
      <span className="flex w-full min-w-0 items-center justify-between gap-3">
        <span className="min-w-0 truncate">{top[0]}</span>
        {top[1] !== undefined && <span className="shrink-0">{top[1]}</span>}
      </span>
      <span className="flex w-full min-w-0 items-center justify-between gap-3 text-xs text-fg-muted">
        <span className="min-w-0 truncate">{bottom[0]}</span>
        {bottom[1] !== undefined && <span className="shrink-0">{bottom[1]}</span>}
      </span>
      {extra !== undefined && <span className="w-full min-w-0 truncate text-xs text-fg-muted">{extra}</span>}
    </>
  );
  const interactive = "transition-colors duration-[120ms] ease-standard hover:bg-surface-hover";
  const rowClass = "flex min-h-16 w-full flex-col justify-center gap-1 px-4 py-3 text-left";

  return (
    <li className="border-t border-line first:border-t-0">
      {href ? (
        <Link href={href} prefetch={false} aria-label={label} className={cn(rowClass, interactive)}>
          {content}
        </Link>
      ) : onSelect ? (
        <button type="button" aria-label={label} onClick={onSelect} className={cn(rowClass, interactive)}>
          {content}
        </button>
      ) : (
        <div className={rowClass}>{content}</div>
      )}
    </li>
  );
}

export type DetailField = { label: string; value: React.ReactNode; mono?: boolean };

/** Pares etiqueta/valor de la hoja de detalle de un ítem de lista. */
export function DetailFields({ fields }: { fields: DetailField[] }) {
  return (
    <dl className="flex flex-col">
      {fields.map((field) => (
        <div key={field.label} className="flex items-baseline justify-between gap-4 border-b border-line py-3">
          <dt className="shrink-0 text-[13px] text-fg-muted">{field.label}</dt>
          <dd className={cn("min-w-0 text-right text-sm [overflow-wrap:anywhere]", field.mono && "font-mono tabular-nums")}>{field.value}</dd>
        </div>
      ))}
    </dl>
  );
}
