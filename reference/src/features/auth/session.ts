// Stub: tiene que redirigir al login si no hay sesión. La validación real vive acá
// (layouts, páginas y server actions); el middleware/proxy es solo un chequeo optimista.
export async function requireSession(): Promise<void> {}
