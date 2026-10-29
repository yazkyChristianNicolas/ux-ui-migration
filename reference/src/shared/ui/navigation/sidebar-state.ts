/**
 * Sidebar contraído/expandido (escritorio). El estado vive en `localStorage` y se
 * refleja como `<html data-sidebar="collapsed">`; el sidebar responde a ese
 * atributo con la variante CSS `sidebar-collapsed:` (tokens.css). Así no depende
 * de React y no parpadea al cargar: el script de abajo lo aplica antes de pintar.
 */
export const SIDEBAR_STORAGE_KEY = "app.sidebar.collapsed";

/** Se emite al alternar (en esta pestaña; las otras se enteran por el evento `storage`). */
export const SIDEBAR_CHANGE_EVENT = "app:sidebar";

export function readSidebarCollapsed(): boolean {
  try {
    return localStorage.getItem(SIDEBAR_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/** Para `useSyncExternalStore`. */
export function subscribeSidebar(onChange: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== SIDEBAR_STORAGE_KEY) return;
    applySidebarCollapsed(readSidebarCollapsed());
    onChange();
  };
  window.addEventListener(SIDEBAR_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(SIDEBAR_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function applySidebarCollapsed(collapsed: boolean) {
  if (collapsed) document.documentElement.dataset.sidebar = "collapsed";
  else delete document.documentElement.dataset.sidebar;
}

/** Corre inline en el <head> del layout raíz, antes de pintar. */
export const SIDEBAR_INIT_SCRIPT = `(function(){try{if(localStorage.getItem(${JSON.stringify(SIDEBAR_STORAGE_KEY)})==="1")document.documentElement.dataset.sidebar="collapsed"}catch(e){}})()`;
