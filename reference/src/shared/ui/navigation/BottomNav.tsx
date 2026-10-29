"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { cn } from "@/shared/lib/cn";

import { Drawer } from "../Drawer";
import { MoreHorizontalIcon } from "../icons";
import { isActive, type NavItem } from "./Sidebar";

type BottomNavProps = {
  /** Las cuatro pantallas de la barra; el resto va en "Más". */
  items: (NavItem & { href: string })[];
  more: (NavItem & { href: string })[];
  /** Al pie de "Más" (ej. cerrar sesión). */
  moreFooter?: React.ReactNode;
  /** Pantallas que usan ese lugar para su propia barra de acción (ej. un formulario largo). */
  hideOn?: string[];
  moreLabel?: string;
};

/**
 * Navegación de mobile (<768px): barra fija abajo con cuatro pantallas y "Más",
 * que abre una hoja con el resto. Reemplaza al sidebar.
 */
export function BottomNav({ items, more, moreFooter, hideOn = [], moreLabel = "Más" }: BottomNavProps) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const inMore = more.some((item) => isActive(pathname, item.href));

  if (hideOn.includes(pathname)) return null;

  return (
    <>
      {/* Lugar para que la barra no tape el final de la pantalla. */}
      <div aria-hidden className="h-[88px] shrink-0 md:hidden" />
      <nav
        aria-label="Navegación principal"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 gap-0.5 border-t border-line bg-surface-card px-1 pt-1 pb-[calc(4px+env(safe-area-inset-bottom))] md:hidden"
      >
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={tabClass(active)}>
              {item.icon}
              {item.shortLabel ?? item.label}
            </Link>
          );
        })}
        <button type="button" aria-haspopup="dialog" onClick={() => setMoreOpen(true)} className={tabClass(inMore)}>
          <MoreHorizontalIcon />
          {moreLabel}
        </button>
      </nav>

      <Drawer open={moreOpen} title={moreLabel} onClose={() => setMoreOpen(false)}>
        <div className="flex flex-col gap-4">
          <nav aria-label={moreLabel} className="-mx-2 -mt-1 flex flex-col">
            {more.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMoreOpen(false)}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                className="flex min-h-12 items-center gap-3 rounded-md px-2 text-[15px] font-medium hover:bg-surface-hover aria-[current=page]:bg-surface-hover [&>svg]:size-5 [&>svg]:text-fg-muted"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
          {moreFooter && <div className="border-t border-line pt-3">{moreFooter}</div>}
        </div>
      </Drawer>
    </>
  );
}

function tabClass(active: boolean): string {
  return cn(
    "flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-md text-[11px] [&>svg]:size-[22px]",
    active ? "font-semibold text-fg [&>svg]:text-accent" : "font-medium text-fg-muted",
  );
}
