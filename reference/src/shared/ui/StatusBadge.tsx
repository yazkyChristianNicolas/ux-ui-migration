import { cn } from "@/shared/lib/cn";

import type { IconComponent } from "./icons";

export type StatusTone = "neutral" | "info" | "success" | "warning" | "danger";

const TONES: Record<StatusTone, string> = {
  neutral: "bg-neutral-bg text-fg-muted",
  info: "bg-info-bg text-info",
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  danger: "bg-danger-bg text-danger",
};

const SIZES = {
  sm: "h-[22px] px-2 text-[11px] [&_svg]:size-3",
  md: "h-[26px] px-2.5 text-xs [&_svg]:size-3.5",
};

type StatusBadgeProps = {
  tone: StatusTone;
  size?: keyof typeof SIZES;
  /** Ícono opcional: sumalo para que el estado no dependa solo del color. */
  icon?: IconComponent;
  className?: string;
  children: React.ReactNode;
};

/**
 * Pill de estado: tono + ícono + texto. El texto siempre va en el idioma del
 * usuario (mapeá el valor de la API en un diccionario, no lo muestres crudo) y el
 * color nunca es lo único que lo distingue.
 */
export function StatusBadge({ tone, size = "md", icon: Icon, className, children }: StatusBadgeProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap", TONES[tone], SIZES[size], className)}>
      {Icon && <Icon />}
      {children}
    </span>
  );
}
