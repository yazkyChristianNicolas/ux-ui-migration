"use client";

import { useEffect, useId, useRef } from "react";

import { cn } from "@/shared/lib/cn";

import { XIcon } from "./icons";

type DialogProps = {
  open: boolean;
  title: string;
  subtitle?: string;
  /** Se llama al cerrar con Esc, con la X o haciendo click afuera. */
  onClose: () => void;
  /** Acciones (Cancelar / Confirmar). En mobile se reparten el ancho en columnas iguales. */
  footer?: React.ReactNode;
  closeLabel?: string;
  children: React.ReactNode;
};

/**
 * Modal sobre `<dialog>` nativo: foco atrapado, Esc y `aria-modal` los resuelve el
 * navegador. En mobile se vuelve una hoja que sube desde abajo.
 *
 * Reglas de UX: un dialog es para una decisión o un formulario corto; los errores
 * del envío van adentro con `Alert` (no se cierra solo), y la acción destructiva
 * usa el botón `danger` a la derecha del footer.
 */
export function Dialog({ open, title, subtitle, onClose, footer, closeLabel = "Cerrar", children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
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
        "m-auto w-[calc(100%-48px)] max-w-[520px] overflow-visible rounded-lg border border-line bg-surface-card p-0 text-fg shadow-lg backdrop:bg-overlay backdrop:backdrop-blur-[2px]",
        // Mobile: hoja que sube desde abajo.
        "max-md:mb-0 max-md:max-h-[92vh] max-md:w-full max-md:max-w-full max-md:overflow-y-auto max-md:rounded-b-none max-md:border-x-0 max-md:border-b-0 max-md:pb-[env(safe-area-inset-bottom)]",
      )}
    >
      <div className="flex items-start gap-4 px-5 pt-5">
        <div className="flex-1">
          <h2 id={titleId} className="text-lg font-semibold">
            {title}
          </h2>
          {subtitle && <p className="mt-1 text-sm text-fg-muted">{subtitle}</p>}
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
      <div className="px-5 pt-4 pb-5">{children}</div>
      {footer && (
        <div className="flex justify-end gap-2 rounded-b-lg border-t border-line bg-surface-sunken px-5 py-3.5 max-md:grid max-md:auto-cols-fr max-md:grid-flow-col max-md:rounded-b-none">
          {footer}
        </div>
      )}
    </dialog>
  );
}
