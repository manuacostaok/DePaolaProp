"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { importPropertiesFromCsv, type ImportSummary } from "@/app/admin/(dashboard)/properties/import-actions";

export function PropertyImportForm() {
  const [csvText, setCsvText] = useState("");
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleFile(file: File) {
    const text = await file.text();
    setCsvText(text);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSummary(null);
    startTransition(async () => {
      try {
        const result = await importPropertiesFromCsv(csvText);
        setSummary(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido al importar.");
      }
    });
  }

  return (
    <div className="grid gap-5">
      <div className="rounded-control border border-line bg-bg-alt p-4 text-sm text-ink-soft">
        <p className="mb-2 font-medium text-ink">Columnas esperadas (nombres flexibles, sin importar tildes/mayúsculas):</p>
        <p>
          título, operación (venta/alquiler), tipo, precio, moneda, zona o dirección, ambientes, dormitorios, baños,
          superficie, url de la publicación original, urls de fotos (separadas por espacio, &quot;|&quot; o &quot;;&quot;).
        </p>
        <p className="mt-2">
          Cada fila importada queda cargada con <strong>needsReview</strong> activo — no hace falta que quede
          perfecto, el objetivo es bajar el trabajo a &quot;revisar propiedades ya cargadas&quot;. Las filas que no se
          puedan interpretar (zona sin coincidencia, tipo desconocido, etc.) se listan abajo para cargarlas a mano.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Archivo CSV</label>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            className="block w-full text-sm text-ink-soft file:mr-3 file:rounded-pill file:border-0 file:bg-brand file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
          />
        </div>

        <Textarea
          label="O pegá el contenido CSV directamente"
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          rows={10}
          placeholder="título,operación,tipo,precio,moneda,zona,ambientes,dormitorios,baños,superficie,url..."
        />

        <div>
          <Button type="submit" disabled={isPending || !csvText.trim()}>
            {isPending ? "Importando…" : "Importar propiedades"}
          </Button>
        </div>
      </form>

      {error && <p className="text-sm text-alert">{error}</p>}

      {summary && (
        <div className="rounded-control border border-line bg-white p-4">
          <p className="mb-3 font-medium text-ink">
            {summary.created} de {summary.total} propiedades importadas correctamente
            {summary.skipped > 0 && ` · ${summary.skipped} necesitan carga manual`}.
          </p>
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-ink-soft">
                <tr>
                  <th className="py-1.5 pr-3">Fila</th>
                  <th className="py-1.5 pr-3">Título</th>
                  <th className="py-1.5 pr-3">Resultado</th>
                  <th className="py-1.5">Detalle</th>
                </tr>
              </thead>
              <tbody>
                {summary.results.map((result) => (
                  <tr key={result.row} className="border-t border-line">
                    <td className="py-1.5 pr-3 text-ink-soft">{result.row}</td>
                    <td className="py-1.5 pr-3 text-ink">{result.title}</td>
                    <td className={`py-1.5 pr-3 ${result.status === "created" ? "text-brand-dark" : "text-alert"}`}>
                      {result.status === "created" ? "Importada" : "Omitida"}
                    </td>
                    <td className="py-1.5 text-ink-soft">{result.reason ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
