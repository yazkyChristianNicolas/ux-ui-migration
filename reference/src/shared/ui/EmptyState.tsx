type EmptyStateProps = {
  /** Ya renderizado. */
  icon?: React.ReactNode;
  title: string;
  body?: string;
  action?: React.ReactNode;
};

/** Estado vacío. Usar uno distinto para "no hay resultados con estos filtros" y "todavía no hay datos". */
export function EmptyState({ icon, title, body, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-line bg-surface-card px-6 py-12 text-center">
      {icon && <div className="text-fg-muted [&>svg]:size-8">{icon}</div>}
      <h2 className="text-base font-semibold">{title}</h2>
      {body && <p className="max-w-sm text-sm text-fg-muted">{body}</p>}
      {action}
    </div>
  );
}
