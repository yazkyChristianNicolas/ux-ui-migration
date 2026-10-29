"use client";

import { useCallback, useId, useMemo, useRef, useState } from "react";

import { cn } from "@/shared/lib/cn";

import { Field, fieldBox } from "./Field";
import { ChevronDownIcon } from "./icons";
import { Listbox, placementFor, type ListOption, type Placement } from "./Listbox";

export type ComboboxOption = ListOption;

type ComboboxProps = {
  id: string;
  label?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  options: readonly ComboboxOption[];
  value: string;
  /** Recibe el valor elegido, no el evento. */
  onChange: (value: string) => void;
  /** Para formularios: se envía el valor elegido en un input oculto con este nombre. */
  name?: string;
  emptyMessage?: string;
  className?: string;
};

function normalize(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/**
 * Coincide por texto (sin mayúsculas ni acentos) o por dígitos: "30712" encuentra
 * "30-71234567-1". Útil para identificadores con guiones o puntos; si no los tenés,
 * se puede dejar solo la parte de texto.
 */
export function matchesQuery(option: ComboboxOption, query: string): boolean {
  const text = normalize(query.trim());
  if (!text) return true;
  if (normalize(option.label).includes(text)) return true;
  const digits = text.replace(/\D/g, "");
  return digits.length >= 2 && option.label.replace(/\D/g, "").includes(digits);
}

/**
 * Select con buscador (patrón combobox de ARIA): se escribe para filtrar, se
 * navega con las flechas, Enter elige y Esc cierra. Usarlo en lugar de
 * `SelectField` cuando la lista es larga y conviene buscar.
 */
export function Combobox({
  id,
  label,
  hint,
  required,
  disabled,
  placeholder = "Buscá o elegí",
  options,
  value,
  onChange,
  name,
  emptyMessage = "No hay coincidencias.",
  className,
}: ComboboxProps) {
  const listboxId = useId();
  const boxRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [placement, setPlacement] = useState<Placement>("bottom");

  const selected = options.find((option) => option.value === value);
  const filtered = useMemo(() => options.filter((option) => matchesQuery(option, query)), [options, query]);
  const optionId = useCallback((index: number) => `${id}-option-${index}`, [id]);

  function openList() {
    setQuery("");
    setActive(Math.max(options.findIndex((option) => option.value === value), 0));
    setPlacement(placementFor(boxRef.current));
    setOpen(true);
  }

  function choose(option: ComboboxOption | undefined) {
    if (!option) return;
    setOpen(false);
    setQuery("");
    if (option.value !== value) onChange(option.value);
  }

  return (
    <Field id={id} label={label} hint={hint} required={required} className={className}>
      <div className="relative">
        <div ref={boxRef} className={cn(fieldBox, "relative px-3")}>
          <input
            id={id}
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={open && filtered[active] ? optionId(active) : undefined}
            aria-required={required}
            autoComplete="off"
            disabled={disabled}
            // Cerrado se ve la opción elegida; abierto, lo que se escribe (y la elegida queda de placeholder).
            placeholder={selected ? selected.label : placeholder}
            value={open ? query : (selected?.label ?? "")}
            onFocus={openList}
            onClick={() => !open && openList()}
            onBlur={() => setOpen(false)}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
              setOpen(true);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                if (!open) return openList();
                setActive((index) => Math.min(index + 1, filtered.length - 1));
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActive((index) => Math.max(index - 1, 0));
              } else if (event.key === "Enter" && open) {
                event.preventDefault();
                choose(filtered[active]);
              } else if (event.key === "Escape" && open) {
                event.preventDefault();
                setOpen(false);
              }
            }}
            className="h-full min-w-0 flex-1 truncate bg-transparent pr-6 text-sm text-fg outline-none placeholder:text-fg-muted disabled:cursor-not-allowed disabled:text-fg-muted"
          />
          <ChevronDownIcon className="pointer-events-none absolute right-2.5 size-[18px] text-fg-muted" />
        </div>
        {name && <input type="hidden" name={name} value={value} />}
        {open && (
          <Listbox
            id={listboxId}
            label={label}
            options={filtered}
            selected={value}
            active={active}
            placement={placement}
            emptyMessage={emptyMessage}
            optionId={optionId}
            onChoose={choose}
            onHover={setActive}
          />
        )}
      </div>
    </Field>
  );
}
