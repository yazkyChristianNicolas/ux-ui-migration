# UX/UI Migration

Prompts para migrar un backoffice de Ant Design a una arquitectura feature based con un sistema de componentes propio.

Flujo de trabajo:

1. **[01-inventario-pantalla.md](01-inventario-pantalla.md)**: prompt de solo lectura que se corre en el proyecto a migrar. Documenta una pantalla real (filtros, validaciones, tabla, endpoint y contrato, formatos, estados, mobile).
2. **[02-diseno-con-claude-design.md](02-diseno-con-claude-design.md)**: prompt para la herramienta de diseño. Se pega junto con el inventario y produce el diseño nuevo de la pantalla (desktop, mobile, estados y tabla de trazabilidad inventario → diseño). El inventario manda en datos, contrato, validaciones y formatos; la referencia manda en estructura, layout y UX.
3. **[03-estructura-componentes-y-migracion.md](03-estructura-componentes-y-migracion.md)**: patrón de referencia (layout, sidebar, breadcrumbs, logout, tablas con paginado en la URL, filtros en drawer, mobile) y estrategia de migración incremental. Se usa con el inventario y el diseño como entrada para hacer el refactor.

El código de los componentes, abstracto y sin dependencia de un design system concreto, está en [`reference/`](reference/README.md).
