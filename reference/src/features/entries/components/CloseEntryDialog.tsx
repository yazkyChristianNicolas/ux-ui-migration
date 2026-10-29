"use client";

import { useState, useTransition } from "react";

import { Alert } from "@/shared/ui/Alert";
import { Button } from "@/shared/ui/Button";
import { Dialog } from "@/shared/ui/Dialog";

type Props = {
  reference: string;
  /** Devuelve un mensaje de error en el idioma del usuario, o null si salió bien. */
  onConfirm: () => Promise<string | null>;
};

/**
 * Ejemplo de confirmación de una acción destructiva: el error vuelve adentro del
 * dialog (no se cierra solo), el botón muestra `loading` y se bloquea el doble click.
 */
export function CloseEntryDialog({ reference, onConfirm }: Props) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function confirm() {
    setError(null);
    startTransition(async () => {
      const message = await onConfirm();
      if (message) setError(message);
      else setOpen(false);
    });
  }

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Cerrar registro
      </Button>
      <Dialog
        open={open}
        title="Cerrar registro"
        subtitle={reference}
        onClose={() => !pending && setOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
              Cancelar
            </Button>
            <Button variant="danger" loading={pending} onClick={confirm}>
              Cerrar registro
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <p className="text-sm">Una vez cerrado, no se puede volver a editar.</p>
          {error && <Alert tone="error">{error}</Alert>}
        </div>
      </Dialog>
    </>
  );
}
