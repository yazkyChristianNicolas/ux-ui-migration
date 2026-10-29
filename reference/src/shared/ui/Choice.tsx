"use client";

import { useId } from "react";

import { cn } from "@/shared/lib/cn";

import { CheckIcon } from "./icons";

/*
 * Controles de elección. Los tres usan el <input> nativo (invisible o con
 * `appearance-none`) y dibujan encima su apariencia, así conservan teclado, foco,
 * formularios y lectores de pantalla sin código extra. El estado se pinta con
 * `peer-checked:` / `checked:`; el foco, con `focus-visible` (solo teclado).
 */

type CheckboxProps = Omit<React.ComponentProps<"input">, "type" | "id"> & { id: string; label: string; hint?: string };

/** Checkbox de 18px: color de acción cuando está marcado. */
export function Checkbox({ id, label, hint, className, ...props }: CheckboxProps) {
  return (
    <label htmlFor={id} className={cn("flex cursor-pointer items-start gap-2.5 has-disabled:cursor-not-allowed has-disabled:opacity-60", className)}>
      <span className="relative mt-0.5 flex size-[18px] shrink-0">
        <input id={id} type="checkbox" className="peer absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed" {...props} />
        <span
          aria-hidden
          className="pointer-events-none flex size-[18px] items-center justify-center rounded-sm border border-line-strong bg-surface-card text-on-accent transition-colors duration-[120ms] peer-checked:border-accent peer-checked:bg-accent peer-focus-visible:shadow-focus [&>svg]:invisible peer-checked:[&>svg]:visible"
        >
          <CheckIcon className="size-3.5" strokeWidth={2.5} />
        </span>
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-sm">{label}</span>
        {hint && <span className="text-xs text-fg-muted">{hint}</span>}
      </span>
    </label>
  );
}

type RadioGroupProps = {
  /** Agrupa los radios (y viaja en el form). */
  name: string;
  /** Leyenda del grupo, siempre visible. */
  label: string;
  value: string;
  options: readonly { value: string | number; label: string; disabled?: boolean }[];
  /** Recibe el valor elegido, no el evento. */
  onChange: (value: string) => void;
  /** "row": en línea y con salto (pocas opciones cortas). "column": una por línea. */
  direction?: "row" | "column";
  className?: string;
};

/** Grupo de radios (anillo de 5px del color de acción en el elegido) dentro de un `<fieldset>` con `<legend>`. */
export function RadioGroup({ name, label, value, options, onChange, direction = "row", className }: RadioGroupProps) {
  // Prefijo único: dos grupos con el mismo `name` en la misma pantalla no comparten ids.
  const prefix = useId();
  return (
    <fieldset className={cn("flex flex-col gap-2", className)}>
      <legend className="mb-2 text-[13px] font-medium">{label}</legend>
      <div className={cn("flex", direction === "row" ? "flex-wrap gap-x-5 gap-y-2" : "flex-col gap-2.5")}>
        {options.map((option) => {
          const id = `${prefix}-${option.value}`;
          return (
            <label key={option.value} htmlFor={id} className="flex cursor-pointer items-center gap-2.5 text-sm has-disabled:cursor-not-allowed has-disabled:opacity-60">
              <input
                id={id}
                type="radio"
                name={name}
                value={option.value}
                disabled={option.disabled}
                checked={String(option.value) === value}
                onChange={(event) => onChange(event.target.value)}
                className="size-[18px] shrink-0 cursor-pointer appearance-none rounded-full border border-line-strong bg-surface-card transition-[border-width] duration-[120ms] checked:border-[5px] checked:border-accent focus-visible:shadow-focus disabled:cursor-not-allowed"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

type SwitchProps = Omit<React.ComponentProps<"input">, "type" | "id" | "role"> & { id: string; label: string; hint?: string };

/**
 * Interruptor de 40×24 para un ajuste que se aplica al instante (a diferencia de
 * un checkbox, que se confirma al enviar el formulario). Es un checkbox con `role="switch"`.
 */
export function Switch({ id, label, hint, className, ...props }: SwitchProps) {
  return (
    <label htmlFor={id} className={cn("flex cursor-pointer items-start gap-3 has-disabled:cursor-not-allowed", className)}>
      <span className="relative mt-px flex h-6 w-10 shrink-0">
        <input id={id} type="checkbox" role="switch" className="peer absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed" {...props} />
        <span
          aria-hidden
          className="pointer-events-none h-6 w-10 rounded-full bg-line-strong transition-colors duration-[180ms] ease-standard peer-checked:bg-accent peer-focus-visible:shadow-focus peer-disabled:opacity-50"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute top-[3px] left-[3px] size-[18px] rounded-full bg-on-accent transition-transform duration-[180ms] ease-standard peer-checked:translate-x-4"
        />
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-sm">{label}</span>
        {hint && <span className="text-xs text-fg-muted">{hint}</span>}
      </span>
    </label>
  );
}
