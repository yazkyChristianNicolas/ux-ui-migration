import { SIDEBAR_INIT_SCRIPT } from "@/shared/ui/navigation/sidebar-state";

import "../../tokens.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: el script del <head> puede marcar `data-sidebar` antes de hidratar.
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SIDEBAR_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
