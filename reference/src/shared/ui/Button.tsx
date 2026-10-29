import { cn } from "@/shared/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

export function buttonVariants({ variant = "primary", size = "md" }: { variant?: Variant; size?: Size } = {}): string {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-colors duration-[120ms] ease-standard disabled:cursor-not-allowed disabled:opacity-50",
    size === "md" ? "h-10 px-4 text-sm" : "h-8 px-3 text-[13px]",
    variant === "primary" && "bg-accent text-on-accent hover:bg-accent-hover",
    variant === "secondary" && "border border-line-strong bg-surface-card text-fg hover:bg-surface-hover",
    variant === "ghost" && "text-fg-secondary hover:bg-surface-hover hover:text-fg",
    variant === "danger" && "bg-danger text-on-accent hover:opacity-90",
  );
}

type ButtonProps = React.ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
  /** Acción en curso: muestra un spinner, deshabilita el botón y marca `aria-busy`. */
  loading?: boolean;
};

/**
 * Botón. Reglas de UX: el primario no lleva ícono si el texto alcanza; los íconos
 * son para navegación, convenciones (descargar), feedback (copiar) y "+ Agregar".
 * Mientras `loading` el texto se mantiene (no se reemplaza) para que el ancho no salte.
 */
export function Button({ variant, size, className, type = "button", loading, disabled, children, ...props }: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

/** Anillo de 2px de currentColor: hereda el color del texto del botón. */
export function Spinner({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("size-[18px] shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent", className)} />
  );
}
