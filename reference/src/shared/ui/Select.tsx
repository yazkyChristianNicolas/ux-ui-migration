"use client";

import { useCallback, useId, useRef, useState } from "react";

import { cn } from "@/shared/lib/cn";

import { Field, fieldBox, fieldBoxError } from "./Field";
import { ChevronDownIcon } from "./icons";
import { Listbox, placementFor, type ListOption, type Placement } from "./Listbox";

export type SelectFieldProps = {
  id: string;
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  options: readonly { value: string | number; label: string }[];
  /** Controlado. Si no se pasa, se usa `defaultValue` (no controlado, para forms con `name`). */
  value?: string | number;
  defaultValue?: string | number;
  /** Recibe el valor elegido, no el evento. */
  onChange?: (value: string) => void;
  /** Opción vacía al principio (ej. "Elegí una opción"); también sirve para limpiar. */
  placeholder?: string;
  /** Para formularios: el valor viaja en un input oculto con este nombre. */
  name?: string;
  className?: string;
  /** Nombre accesible cuando no hay label visible (ej. un selector de la barra de filtros). */
  "aria-label"?: string;
  /** 32px de alto y texto chico (ej. registros por página). */
  compact?: boolean;
};

const TYPEAHEAD_RESET_MS = 600;

/**
 * Select propio (patrón "select-only combobox" de ARIA): un botón que abre la
 * lista. Nunca un `<select>` nativo: su lista la dibuja el sistema operativo y
 * no respeta el diseño. Flechas, Home/End, Enter o Espacio eligen, Esc cierra y
 * escribir salta a la opción que empieza con esas letras.
 */
export function SelectField({
  id,
  label,
  hint,
  error,
  required,
  disabled,
  options: rawOptions,
  value: controlled,
  defaultValue,
  onChange,
  placeholder,
  name,
  className,
  "aria-label": ariaLabel,
  compact,
}: SelectFieldProps) {
  const listboxId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const typeahead = useRef({ text: "", at: 0 });
  const [uncontrolled, setUncontrolled] = useState(String(defaultValue ?? ""));
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [placement, setPlacement] = useState<Placement>("bottom");

  const value = controlled !== undefined ? String(controlled) : uncontrolled;
  const options: ListOption[] = [
    ...(placeholder !== undefined ? [{ value: "", label: placeholder, placeholder: true }] : []),
    ...rawOptions.map((option) => ({ value: String(option.value), label: option.label })),
  ];
  const selected = options.find((option) => option.value === value);
  const optionId = useCallback((index: number) => `${id}-option-${index}`, [id]);

  function openList() {
    setActive(Math.max(options.findIndex((option) => option.value === value), 0));
    setPlacement(placementFor(triggerRef.current));
    setOpen(true);
  }

  function choose(option: ListOption | undefined) {
    if (!option) return;
    setOpen(false);
    if (option.value === value) return;
    if (controlled === undefined) setUncontrolled(option.value);
    onChange?.(option.value);
  }

  /** Salta a la próxima opción que empieza con lo que se viene escribiendo. */
  function jumpTo(char: string, now: number) {
    const state = typeahead.current;
    state.text = now - state.at > TYPEAHEAD_RESET_MS ? char : state.text + char;
    state.at = now;
    const text = state.text.toLowerCase();
    const index = options.findIndex((option) => option.label.toLowerCase().startsWith(text));
    if (index < 0) return;
    if (open) setActive(index);
    else choose(options[index]);
  }

  return (
    <Field id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <div className="relative">
        <button
          ref={triggerRef}
          id={id}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={open ? optionId(active) : undefined}
          aria-required={required}
          aria-label={label ? undefined : ariaLabel}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? `${id}-message` : undefined}
          disabled={disabled}
          onClick={() => (open ? setOpen(false) : openList())}
          onBlur={() => setOpen(false)}
          onKeyDown={(event) => {
            const key = event.key;
            if (key === "ArrowDown" || key === "ArrowUp") {
              event.preventDefault();
              if (!open) return openList();
              setActive((index) => Math.min(Math.max(index + (key === "ArrowDown" ? 1 : -1), 0), options.length - 1));
            } else if ((key === "Home" || key === "End") && open) {
              event.preventDefault();
              setActive(key === "Home" ? 0 : options.length - 1);
            } else if (key === "Enter" || key === " ") {
              event.preventDefault();
              if (open) choose(options[active]);
              else openList();
            } else if (key === "Escape" && open) {
              event.preventDefault();
              setOpen(false);
            } else if (key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
              jumpTo(key, event.timeStamp);
            }
          }}
          className={cn(
            fieldBox,
            "relative w-full cursor-pointer pr-9 pl-3 text-left text-sm text-fg disabled:cursor-not-allowed disabled:text-fg-muted",
            compact && "h-8 pr-8 text-[13px]",
            error && fieldBoxError,
          )}
        >
          <span className={cn("min-w-0 flex-1 truncate", (!selected || selected.placeholder) && "text-fg-muted")}>
            {selected?.label ?? placeholder ?? ""}
          </span>
          <ChevronDownIcon className="pointer-events-none absolute right-2.5 size-[18px] text-fg-muted" />
        </button>
        {name && <input type="hidden" name={name} value={value} />}
        {open && (
          <Listbox
            id={listboxId}
            label={label ?? ariaLabel}
            options={options}
            selected={value}
            active={active}
            placement={placement}
            optionId={optionId}
            onChoose={choose}
            onHover={setActive}
          />
        )}
      </div>
    </Field>
  );
}
