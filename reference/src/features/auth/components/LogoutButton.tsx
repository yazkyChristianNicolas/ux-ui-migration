import { cn } from "@/shared/lib/cn";
import { buttonVariants } from "@/shared/ui/Button";
import { LogOutIcon } from "@/shared/ui/icons";

import { logout } from "../actions";

/**
 * "Cerrar sesión": un <form> con server action (funciona sin JS). Al pie del
 * sidebar (con el sidebar contraído queda solo el ícono, con el texto en el
 * tooltip) o, en mobile, como botón secundario de ancho completo en la hoja "Más".
 */
export function LogoutButton({ variant = "sidebar", label = "Cerrar sesión" }: { variant?: "sidebar" | "sheet"; label?: string }) {
  return (
    <form action={logout}>
      {variant === "sidebar" ? (
        <>
          <button
            type="submit"
            className="mt-2 w-full rounded-md px-3 py-2 text-left text-[13px] font-medium text-on-nav/70 transition-colors duration-[120ms] hover:bg-on-nav/8 hover:text-on-nav sidebar-collapsed:hidden"
          >
            {label}
          </button>
          <button
            type="submit"
            title={label}
            aria-label={label}
            className="mt-2 hidden h-10 w-full items-center justify-center rounded-md text-on-nav/70 transition-colors duration-[120ms] hover:bg-on-nav/8 hover:text-on-nav sidebar-collapsed:flex"
          >
            <LogOutIcon className="size-[18px]" />
          </button>
        </>
      ) : (
        <button type="submit" className={cn(buttonVariants({ variant: "secondary" }), "w-full")}>
          {label}
        </button>
      )}
    </form>
  );
}
