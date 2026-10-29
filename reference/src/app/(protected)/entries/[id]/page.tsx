import { PageHeader } from "@/shared/ui/PageHeader";
import { TextLink } from "@/shared/ui/TextLink";

/**
 * Pantalla de detalle: el breadcrumb no es un componente genérico. Cada
 * sub-pantalla pasa un fragmento con el link a su pantalla padre y un separador.
 */
export default async function EntryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <>
      <PageHeader
        title={`Registro ${id}`}
        breadcrumb={
          <>
            <TextLink href="/entries" className="font-normal text-fg-muted">
              Registros
            </TextLink>
            <span aria-hidden>/</span>
          </>
        }
      />
      <div className="mx-auto w-full max-w-content px-page py-page">{/* contenido del detalle */}</div>
    </>
  );
}
