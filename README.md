# UX/UI Migration

Prompts para migrar un backoffice de Ant Design a una arquitectura feature based con un sistema de componentes propio.

Flujo de trabajo:

1. **[01-inventario-pantalla.md](01-inventario-pantalla.md)**: prompt de solo lectura que se corre en el proyecto a migrar. Documenta una pantalla real (filtros, validaciones, tabla, endpoint y contrato, formatos, estados, mobile).
2. **[02-estructura-componentes-y-migracion.md](02-estructura-componentes-y-migracion.md)**: patrón de referencia (layout, sidebar, breadcrumbs, logout, tablas con paginado en la URL, filtros en drawer, mobile) y estrategia de migración incremental.
3. Se combinan ambos en la herramienta de diseño para obtener el diseño nuevo de la pantalla (el inventario manda en datos, contrato, validaciones y formatos; el patrón manda en estructura, layout y UX).
4. Con ese diseño como fuente de verdad se hace el refactor de la pantalla.

El código de los componentes, abstracto y sin dependencia de un design system concreto, está en [`reference/`](reference/README.md).
