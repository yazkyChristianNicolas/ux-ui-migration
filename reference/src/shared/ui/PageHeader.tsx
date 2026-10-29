import { SidebarToggle } from "./navigation/SidebarToggle";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  /** Miga arriba del título: link a la pantalla padre + separador. Las pantallas raíz del menú no la llevan. */
  breadcrumb?: React.ReactNode;
  actions?: React.ReactNode;
};

/** Topbar de cada pantalla, fija al scrollear: botón del sidebar, título y acción principal. */
export function PageHeader({ title, subtitle, breadcrumb, actions }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-topbar shrink-0 items-center gap-3 border-b border-line bg-surface-card px-header">
      <SidebarToggle />
      {/* En pantallas angostas el título se corta con "…" antes que empujar las acciones. */}
      <div className="min-w-0">
        {breadcrumb && <div className="flex gap-1.5 text-xs text-fg-muted">{breadcrumb}</div>}
        <h1 className="truncate text-base leading-tight font-semibold">{title}</h1>
        {subtitle && <p className="truncate text-xs text-fg-muted">{subtitle}</p>}
      </div>
      <div className="flex-1" />
      {actions}
    </header>
  );
}
