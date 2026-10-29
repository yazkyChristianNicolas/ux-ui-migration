import { cn } from "@/shared/lib/cn";

import { AlertCircleIcon, CalendarIcon, FileCheckIcon, UploadIcon, type IconComponent } from "./icons";

/** Caja de un control de formulario (input, select, combobox): alto, borde, foco y estados. */
export const fieldBox = [
  "flex h-10 items-center gap-2 rounded-md border border-line bg-surface-card shadow-field",
  "transition-[border-color,box-shadow] duration-[120ms] ease-standard",
  "focus-within:border-accent focus-within:shadow-focus",
  "has-disabled:bg-surface-sunken has-[input:read-only]:bg-surface-sunken",
];
export const fieldBoxError = "border-danger focus-within:border-danger focus-within:shadow-none";

type FieldProps = {
  label?: string;
  id: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
};

/**
 * Envoltorio de todo control: label SIEMPRE visible arriba (nunca el placeholder
 * como label) y, abajo, el error o la ayuda. El control referencia ese mensaje
 * con `aria-describedby={`${id}-message`}`. El error reemplaza a la ayuda y
 * lleva ícono, para que no dependa solo del color.
 */
export function Field({ label, id, hint, error, required, className, children }: FieldProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={id} className="text-[13px] font-medium text-fg">
          {label}
          {required && (
            <span aria-hidden className="text-accent">
              {" "}
              *
            </span>
          )}
        </label>
      )}
      {children}
      {error ? (
        <span id={`${id}-message`} className="flex items-center gap-1.5 text-xs text-danger">
          <AlertCircleIcon className="size-3.5 shrink-0" />
          {error}
        </span>
      ) : (
        hint && (
          <span id={`${id}-message`} className="text-xs text-fg-muted">
            {hint}
          </span>
        )
      )}
    </div>
  );
}

type TextFieldProps = Omit<React.ComponentProps<"input">, "id" | "prefix"> & {
  id: string;
  label?: string;
  hint?: string;
  error?: string;
  icon?: IconComponent;
  prefix?: string;
  suffix?: string;
  /** Monoespaciado y cifras tabulares (importes, fechas, códigos). */
  mono?: boolean;
  align?: "left" | "right";
  /** Clases extra para la caja (no para el `<input>`). */
  fieldClassName?: string;
};

export function TextField({
  id,
  label,
  hint,
  error,
  required,
  icon: Icon,
  prefix,
  suffix,
  mono,
  align = "left",
  className,
  fieldClassName,
  ...props
}: TextFieldProps) {
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <div className={cn(fieldBox, "px-3", error && fieldBoxError, fieldClassName)}>
        {Icon && <Icon className="size-[18px] shrink-0 text-fg-muted" />}
        {prefix && <span className="font-mono text-sm text-fg-muted">{prefix}</span>}
        <input
          id={id}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? `${id}-message` : undefined}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-fg-muted disabled:text-fg-muted",
            mono && "font-mono tabular-nums",
            align === "right" && "text-right",
          )}
          {...props}
        />
        {suffix && <span className="text-[13px] text-fg-muted">{suffix}</span>}
      </div>
    </Field>
  );
}

export function DateField(props: Omit<TextFieldProps, "type" | "icon" | "mono">) {
  return <TextField type="date" icon={CalendarIcon} mono {...props} />;
}

/** Importe: símbolo adelante, alineado a la derecha, monoespaciado. */
export function MoneyField({
  symbol = "$",
  currency,
  ...props
}: Omit<TextFieldProps, "prefix" | "suffix" | "mono" | "align" | "inputMode"> & { symbol?: string; currency?: string }) {
  return (
    <TextField
      prefix={symbol}
      suffix={currency}
      placeholder="0,00"
      inputMode="decimal"
      autoComplete="off"
      mono
      align="right"
      {...props}
    />
  );
}

type TextAreaProps = Omit<React.ComponentProps<"textarea">, "id"> & { id: string; label?: string; hint?: string; error?: string };

export function TextArea({ id, label, hint, error, required, className, ...props }: TextAreaProps) {
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <textarea
        id={id}
        required={required}
        rows={3}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? `${id}-message` : undefined}
        className={cn(
          "resize-y rounded-md border border-line bg-surface-card px-3 py-2.5 text-sm text-fg shadow-field outline-none placeholder:text-fg-muted",
          "transition-[border-color,box-shadow] duration-[120ms] ease-standard focus:border-accent focus:shadow-focus disabled:bg-surface-sunken",
          error && fieldBoxError,
        )}
        {...props}
      />
    </Field>
  );
}

type FileDropProps = {
  id: string;
  label?: string;
  hint?: string;
  error?: string;
  /** Extensiones aceptadas (ej. ".pdf,.png"). También se muestran como ayuda. */
  accept?: string;
  fileName?: string;
  onFile: (file: File) => void;
};

/** Zona punteada para subir un archivo: click o arrastrar y soltar. */
export function FileDrop({ id, label, hint = "Arrastrá el archivo o hacé clic para elegirlo", error, accept, fileName, onFile }: FileDropProps) {
  return (
    <Field id={id} label={label} error={error}>
      <label
        htmlFor={id}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          const file = event.dataTransfer.files[0];
          if (file) onFile(file);
        }}
        className={cn(
          "flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-line-strong bg-surface-sunken px-4 py-3.5",
          "transition-colors duration-[180ms] ease-standard focus-within:shadow-focus hover:border-accent hover:bg-accent-soft",
          error && "border-danger",
        )}
      >
        {fileName ? <FileCheckIcon className="size-5 shrink-0 text-success" /> : <UploadIcon className="size-5 shrink-0 text-fg-muted" />}
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-sm">{fileName || hint}</span>
          {accept && <span className="text-xs text-fg-muted">{accept}</span>}
        </span>
        <input
          id={id}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onFile(file);
          }}
        />
      </label>
    </Field>
  );
}

// El select vive en su propio módulo (es un Client Component); se reexporta para importar todo desde Field.
export { SelectField } from "./Select";
