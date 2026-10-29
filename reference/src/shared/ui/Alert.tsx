import { cn } from "@/shared/lib/cn";

import { AlertCircleIcon, CheckCircleIcon, InfoIcon } from "./icons";

export type AlertTone = "error" | "warning" | "success" | "info";

const TONES: Record<AlertTone, { box: string; icon: React.ReactNode }> = {
  error: { box: "bg-danger-bg text-danger", icon: <AlertCircleIcon /> },
  warning: { box: "bg-warning-bg text-warning", icon: <AlertCircleIcon /> },
  success: { box: "bg-success-bg text-success", icon: <CheckCircleIcon /> },
  info: { box: "bg-info-bg text-info", icon: <InfoIcon /> },
};

type AlertProps = {
  tone?: AlertTone;
  title?: string;
  /** Acción a la derecha o debajo (ej. "Reintentar"). */
  action?: React.ReactNode;
  /** Sin ícono (para errores de formulario, donde el texto solo alcanza). */
  hideIcon?: boolean;
  className?: string;
  children?: React.ReactNode;
};

/**
 * Mensaje en línea, pegado a la acción que lo causó (formulario, dialog, sección).
 * Reemplaza a los toasts: el mensaje no desaparece solo y el usuario lo lee donde miraba.
 *
 * Accesibilidad: error y warning son `role="alert"` (se anuncian ya); success e info
 * son `role="status"` (se anuncian sin interrumpir).
 */
export function Alert({ tone = "error", title, action, hideIcon, className, children }: AlertProps) {
  const { box, icon } = TONES[tone];
  return (
    <div
      role={tone === "error" || tone === "warning" ? "alert" : "status"}
      className={cn("flex items-start gap-2.5 rounded-md px-3.5 py-3 text-[13px]", box, className)}
    >
      {!hideIcon && <span className="mt-0.5 shrink-0 [&>svg]:size-4">{icon}</span>}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div>{children}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
