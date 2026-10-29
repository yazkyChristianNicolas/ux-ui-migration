"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";

import { PanelLeftIcon } from "../icons";
import {
  applySidebarCollapsed,
  readSidebarCollapsed,
  SIDEBAR_CHANGE_EVENT,
  SIDEBAR_STORAGE_KEY,
  subscribeSidebar,
} from "./sidebar-state";

/**
 * Botón de la topbar (a la izquierda del título) que contrae o expande el
 * sidebar, con su divisor. Solo escritorio: en mobile está la barra inferior.
 */
export function SidebarToggle({ labels = { collapse: "Contraer menú", expand: "Expandir menú" } }) {
  // En el servidor no hay localStorage: hidrata expandido y enseguida toma el valor real.
  const collapsed = useSyncExternalStore(subscribeSidebar, readSidebarCollapsed, () => false);

  // En desarrollo, Strict Mode remonta <html> y le borra el atributo que puso el script del <head>.
  useLayoutEffect(() => applySidebarCollapsed(readSidebarCollapsed()), []);

  function toggle() {
    const next = !collapsed;
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, next ? "1" : "0");
    } catch {
      // Sin localStorage (modo privado): igual se aplica en esta pantalla.
    }
    applySidebarCollapsed(next);
    window.dispatchEvent(new Event(SIDEBAR_CHANGE_EVENT));
  }

  const label = collapsed ? labels.expand : labels.collapse;
  return (
    <>
      <button
        type="button"
        onClick={toggle}
        title={label}
        aria-label={label}
        aria-expanded={!collapsed}
        className="-ml-2 hidden size-9 shrink-0 items-center justify-center rounded-md text-fg-secondary transition-colors duration-[120ms] hover:bg-surface-hover hover:text-fg md:flex [&>svg]:size-[18px]"
      >
        <PanelLeftIcon />
      </button>
      <span aria-hidden className="hidden h-5 w-px shrink-0 bg-line md:block" />
    </>
  );
}
