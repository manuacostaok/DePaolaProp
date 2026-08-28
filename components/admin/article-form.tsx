"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createArticle, updateArticle, deleteArticle, type ArticleFormInput } from "@/app/admin/(dashboard)/insights/actions";
import { CATEGORIES_REQUIRING_ZONE } from "@/lib/insights";

export function ArticleForm({
  articleId,
  initial,
  categoryOptions,
  neighborhoodOptions,
  canPublish,
  isPublished,
}: {
  articleId?: string;
  initial: ArticleFormInput;
  categoryOptions: { value: string; label: string; slug: string }[];
  neighborhoodOptions: { value: string; label: string }[];
  canPublish: boolean;
  isPublished: boolean;
}) {
  const [form, setForm] = useState<ArticleFormInput>(initial);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function update<K extends keyof ArticleFormInput>(key: K, value: ArticleFormInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const zoneRequired = CATEGORIES_REQUIRING_ZONE.includes(form.categorySlug);

  function handleSubmit(publish: boolean) {
    setError("");
    if (!form.categoryId) {
      setError("La categoría es obligatoria.");
      return;
    }
    if (zoneRequired && !form.neighborhoodId) {
      setError("Esta categoría requiere una zona relacionada antes de publicar.");
      return;
    }

    const payload = { ...form, publish };
    startTransition(async () => {
      if (articleId) {
        await updateArticle(articleId, payload);
      } else {
        await createArticle(payload);
      }
    });
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Título" value={form.title} onChange={(e) => update("title", e.target.value)} required />
        <Input label="Slug (URL)" value={form.slug} onChange={(e) => update("slug", e.target.value)} required />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Select
          label="Categoría"
          value={form.categoryId}
          placeholder="Elegí una categoría"
          onChange={(e) => {
            const option = categoryOptions.find((o) => o.value === e.target.value);
            update("categoryId", e.target.value);
            update("categorySlug", option?.slug ?? "");
          }}
          options={categoryOptions}
        />
        <Select
          label={`Zona relacionada${zoneRequired ? " (obligatoria para esta categoría)" : " (opcional)"}`}
          value={form.neighborhoodId}
          placeholder="—"
          onChange={(e) => update("neighborhoodId", e.target.value)}
          options={neighborhoodOptions}
        />
      </div>

      <Input label="Autor" value={form.authorName} onChange={(e) => update("authorName", e.target.value)} placeholder="Equipo De Paola" />
      <Input label="URL de imagen de portada" value={form.coverImageUrl} onChange={(e) => update("coverImageUrl", e.target.value)} />
      <Textarea label="Cuerpo del artículo" value={form.body} onChange={(e) => update("body", e.target.value)} rows={10} />

      {error && <p className="text-sm text-alert">{error}</p>}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => handleSubmit(false)} disabled={isPending}>
            Guardar borrador
          </Button>
          {canPublish && (
            <Button type="button" onClick={() => handleSubmit(true)} disabled={isPending}>
              {isPublished ? "Guardar y mantener publicado" : "Publicar"}
            </Button>
          )}
        </div>
        {articleId && (
          <button
            type="button"
            onClick={() => {
              if (confirm("¿Eliminar este artículo? No se puede deshacer.")) {
                startTransition(() => deleteArticle(articleId));
              }
            }}
            className="text-sm text-alert underline"
          >
            Eliminar artículo
          </button>
        )}
      </div>

      {!canPublish && (
        <p className="text-xs text-ink-soft">
          Los artículos creados por un Agente quedan como borrador hasta la aprobación de un Administrador (Fase 19).
        </p>
      )}
    </div>
  );
}
