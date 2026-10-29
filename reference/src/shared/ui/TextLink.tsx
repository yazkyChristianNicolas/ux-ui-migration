import Link from "next/link";

import { cn } from "@/shared/lib/cn";

export function TextLink({ className, ...props }: React.ComponentProps<typeof Link>) {
  return <Link className={cn("text-[13px] font-medium text-accent hover:underline", className)} {...props} />;
}
