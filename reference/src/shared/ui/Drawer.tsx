"use client";

import { useEffect, useId, useRef } from "react";

import { cn } from "@/shared/lib/cn";

import { XIcon } from "./icons";

type DrawerProps = {
  open: boolean;
  title: string;
  subtitle?: string;
  /** "md": 620px (default). "sm": 420px (ej. filtros). En mobile siempre es una hoja a lo ancho. */
  size?: "md" | "sm";
  closeLabel?: string;
  onClose: () => void;
  children: React.ReactNode;
};

/**
 * Panel lateral (desde la derecha; en mobile, hoja desde abajo) sobre `<dialog>`
 * nativo: foco atrapado y Esc los resuelve el navegador.
 */
export function Drawer({ open, title, subtitle, size = "md", closeLabel = "Cerrar", onClose, children }: DrawerProps) {
  const ref = useRef<HTMLDialogElement>(null);
  // Id único: puede haber más de un Drawer en la misma pantalla (filtros + "Más" de mobile).
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        // Click en el backdrop (el propio <dialog>) cierra.
        if (event.target === event.currentTarget) onClose();
      }}
      className={cn(
        "fixed inset-y-0 right-0 left-auto m-0 h-full max-h-none max-w-none border-0 border-l border-line bg-surface-app p-0 text-fg shadow-lg backdrop:bg-overlay",
        size === "md" ? "w-[min(620px,100%)]" : "w-[min(420px,100%)]",
        // Mobile: hoja que sube desde abajo, del alto de su contenido.
        "max-md:top-auto max-md:bottom-0 max-md:left-0 max-md:h-auto max-md:max-h-[92vh] max-md:w-full max-md:rounded-t-lg max-md:border-t max-md:border-l-0 max-md:bg-surface-card max-md:pb-[env(safe-area-inset-bottom)]",
      )}
    >
      <div className="flex h-full flex-col max-md:max-h-[92vh]">
        <div className="flex items-start gap-3 border-b border-line bg-surface-card px-5 py-4">
          <div className="flex-1">
            <h2 id={titleId} className="text-base font-semibold">
              {title}
            </h2>
            {subtitle && <p className="text-xs text-fg-muted">{subtitle}</p>}
          </div>
          <button
            type="button"
            aria-label={closeLabel}
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-md hover:bg-surface-hover"
          >
            <XIcon className="size-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </dialog>
  );
}
