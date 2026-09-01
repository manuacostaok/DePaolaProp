import { PropertyImportForm } from "@/components/admin/property-import-form";

export default function ImportPropertiesPage() {
  return (
    <div className="max-w-4xl rounded-card border border-line bg-white p-6">
      <h1 className="mb-6 text-2xl">Importar propiedades (CSV)</h1>
      <PropertyImportForm />
    </div>
  );
}
