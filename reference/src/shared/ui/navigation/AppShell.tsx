import { BottomNav } from "./BottomNav";
import { Sidebar, type NavItem } from "./Sidebar";

type AppShellProps = {
  logo: React.ReactNode;
  collapsedLogo: React.ReactNode;
  /** Todas las pantallas del menú (sidebar de escritorio). */
  items: NavItem[];
  /** Mobile: cuatro pantallas en la barra y el resto en "Más". */
  mobile: { primary: (NavItem & { href: string })[]; more: (NavItem & { href: string })[]; hideOn?: string[] };
  /** Pie del sidebar (cerrar sesión). */
  footer?: React.ReactNode;
  /** Pie de la hoja "Más" (cerrar sesión, versión mobile). */
  moreFooter?: React.ReactNode;
  children: React.ReactNode;
};

/**
 * Shell de la app autenticada: sidebar a la izquierda (escritorio), contenido a
 * la derecha y barra inferior (mobile). No conoce el dominio: todo llega por props.
 */
export function AppShell({ logo, collapsedLogo, items, mobile, footer, moreFooter, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar logo={logo} collapsedLogo={collapsedLogo} items={items} footer={footer} />
      <div className="flex min-w-0 flex-1 flex-col">
        {children}
        <BottomNav items={mobile.primary} more={mobile.more} moreFooter={moreFooter} hideOn={mobile.hideOn} />
      </div>
    </div>
  );
}
