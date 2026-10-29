import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { requireSession } from "@/features/auth/session";
import { HomeIcon, SettingsIcon } from "@/shared/ui/icons";
import { AppShell } from "@/shared/ui/navigation/AppShell";
import type { NavItem } from "@/shared/ui/navigation/Sidebar";

// Una sola fuente de verdad: el sidebar y la barra inferior se arman a partir de acá.
// Los íconos van ya renderizados (Server → Client).
const NAV = {
  entries: { label: "Registros", icon: <HomeIcon />, href: "/entries" },
  settings: { label: "Configuración", shortLabel: "Config.", icon: <SettingsIcon />, href: "/settings" },
} satisfies Record<string, NavItem & { href: string }>;

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireSession();

  return (
    <AppShell
      logo={<span className="text-lg font-semibold text-on-nav">Logo</span>}
      collapsedLogo={<span className="text-lg font-semibold text-on-nav">L</span>}
      items={[NAV.entries, NAV.settings]}
      // Mobile: hasta 4 pantallas en la barra; el resto, en "Más".
      mobile={{ primary: [NAV.entries, NAV.settings], more: [] }}
      footer={
        <div className="border-t border-on-nav/10 pt-3">
          <LogoutButton />
        </div>
      }
      moreFooter={<LogoutButton variant="sheet" />}
    >
      {children}
    </AppShell>
  );
}
