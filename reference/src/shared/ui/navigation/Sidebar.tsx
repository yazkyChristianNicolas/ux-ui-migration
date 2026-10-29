"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/shared/lib/cn";

export type NavItem = {
  label: string;
  /** Nombre corto para la barra inferior de mobile. */
  shortLabel?: string;
  /** Ya renderizado (ej. `<HomeIcon />`): un componente no puede pasar de servidor a cliente. */
  icon: React.ReactNode;
  /** Sin href: la pantalla todavía no existe y el ítem se muestra deshabilitado. */
  href?: string;
};

export function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

type SidebarProps = {
  logo: React.ReactNode;
  /** Logo del sidebar contraído (isotipo). */
  collapsedLogo: React.ReactNode;
  items: NavItem[];
  footer?: React.ReactNode;
  soonLabel?: string;
};

/**
 * Sidebar: ancho completo (logo + ícono + nombre) o contraído (isotipo + íconos,
 * con el nombre en el tooltip). Lo alterna `SidebarToggle` desde la topbar.
 * Activo = marca de acento + fila tintada.
 */
export function Sidebar({ logo, collapsedLogo, items, footer, soonLabel = "Próximamente" }: SidebarProps) {
  const pathname = usePathname();

  return (
    // En mobile (<768px) lo reemplaza la barra inferior (BottomNav).
    <aside className="sticky top-0 hidden h-screen w-sidebar shrink-0 flex-col bg-surface-nav px-3 pt-5 pb-4 transition-[width] duration-[180ms] ease-standard md:flex sidebar-collapsed:w-sidebar-collapsed">
      <div className="px-2 pb-5 sidebar-collapsed:hidden">{logo}</div>
      <div className="hidden justify-center pb-5 sidebar-collapsed:flex">{collapsedLogo}</div>
      <nav aria-label="Principal" className="flex flex-col gap-0.5">
        {items.map((item) => (
          <SidebarItem key={item.label} item={item} active={!!item.href && isActive(pathname, item.href)} soonLabel={soonLabel} />
        ))}
      </nav>
      <div className="flex-1" />
      {footer}
    </aside>
  );
}

function SidebarItem({ item, active, soonLabel }: { item: NavItem; active: boolean; soonLabel: string }) {
  const { icon, label, href } = item;
  const className = cn(
    "relative flex h-10 w-full items-center gap-2.5 rounded-md pr-3 pl-3.5 text-left text-sm [&_svg]:size-[18px] [&_svg]:shrink-0",
    // Contraído: solo el ícono; el nombre queda en el tooltip.
    "sidebar-collapsed:pr-0 sidebar-collapsed:pl-[15px]",
    "transition-colors duration-[120ms] ease-standard",
    active ? "bg-on-nav/8 font-medium text-on-nav [&_svg]:text-accent" : "text-on-nav/70",
    !active && href && "hover:bg-on-nav/5",
    !href && "cursor-not-allowed text-on-nav/40",
  );
  const content = (
    <>
      {active && <span className="absolute top-2.5 bottom-2.5 left-0 w-[3px] rounded-full bg-accent" />}
      {icon}
      <span className="flex-1 truncate sidebar-collapsed:hidden">{label}</span>
    </>
  );

  if (!href) {
    return (
      <span aria-disabled="true" title={`${label} · ${soonLabel}`} className={className}>
        {content}
      </span>
    );
  }
  return (
    <Link href={href} title={label} aria-label={label} aria-current={active ? "page" : undefined} className={className}>
      {content}
    </Link>
  );
}
