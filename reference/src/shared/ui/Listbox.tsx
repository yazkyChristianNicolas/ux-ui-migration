"use client";

import { useEffect } from "react";

import { cn } from "@/shared/lib/cn";

import { CheckIcon } from "./icons";

/** `placeholder`: la opción vacía de un select ("Elegí una opción"): se ve apagada y sin tilde. */
export type ListOption = { value: string; label: string; placeholder?: boolean };
export type Placement = "bottom" | "top";

/** Espacio que necesita la lista abierta; si no entra abajo, se abre hacia arriba. */
const LIST_HEIGHT = 288;

export function placementFor(trigger: HTMLElement | null): Placement {
  if (!trigger) return "bottom";
  const rect = trigger.getBoundingClientRect();
  const below = window.innerHeight - rect.bottom;
  return below < LIST_HEIGHT && rect.top > below ? "top" : "bottom";
}

type ListboxProps = {
  id: string;
  label?: string;
  options: readonly ListOption[];
  selected: string;
  /** Índice de la opción resaltada (teclado o mouse). */
  active: number;
  placement: Placement;
  emptyMessage?: string;
  optionId: (index: number) => string;
  onChoose: (option: ListOption) => void;
  onHover: (index: number) => void;
};

/** Lista desplegable compartida por Select y Combobox: una sola apariencia y un solo comportamiento. */
export function Listbox({ id, label, options, selected, active, placement, emptyMessage, optionId, onChoose, onHover }: ListboxProps) {
  // La opción activa siempre queda a la vista al navegar con el teclado.
  useEffect(() => {
    document.getElementById(optionId(active))?.scrollIntoView({ block: "nearest" });
  }, [active, optionId]);

  return (
    <ul
      id={id}
      role="listbox"
      aria-label={label}
      className={cn(
        "absolute left-0 z-30 max-h-72 w-full overflow-y-auto rounded-md border border-line bg-surface-card py-1 shadow-md",
        placement === "top" ? "bottom-full mb-1" : "top-full mt-1",
      )}
    >
      {options.length === 0 && emptyMessage && <li className="px-3 py-2 text-[13px] text-fg-muted">{emptyMessage}</li>}
      {options.map((option, index) => (
        <li
          key={option.value}
          id={optionId(index)}
          role="option"
          aria-selected={option.value === selected}
          data-value={option.value}
          // mousedown en vez de click: elegir no le saca el foco al control.
          onMouseDown={(event) => {
            event.preventDefault();
            onChoose(option);
          }}
          onMouseEnter={() => onHover(index)}
          className={cn(
            "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-fg",
            index === active && "bg-surface-hover",
            option.placeholder ? "text-fg-muted" : option.value === selected && "font-medium",
          )}
        >
          <span className="min-w-0 flex-1 truncate">{option.label}</span>
          {option.value === selected && !option.placeholder && <CheckIcon className="size-4 shrink-0 text-accent" />}
        </li>
      ))}
    </ul>
  );
}
