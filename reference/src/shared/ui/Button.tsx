import { cn } from "@/shared/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

export function buttonVariants({ variant = "primary" }: { variant?: Variant } = {}): string {
  return cn(
    "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium whitespace-nowrap transition-colors duration-[120ms] ease-standard disabled:cursor-not-allowed disabled:opacity-50",
    variant === "primary" && "bg-accent text-on-accent hover:bg-accent-hover",
    variant === "secondary" && "border border-line-strong bg-surface-card text-fg hover:bg-surface-hover",
    variant === "ghost" && "text-fg-secondary hover:bg-surface-hover hover:text-fg",
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

export function Button({ variant, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ variant }), className)} {...props} />;
}
