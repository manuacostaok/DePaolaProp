"use client";

import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { useFavorites } from "@/lib/use-favorites";
import { cn } from "@/lib/cn";

export interface ActionPanelProps {
  propertyId: string;
  title: string;
  address: string;
  price: number | null;
  currency: "ARS" | "USD" | null;
  whatsapp: string;
  email: string;
  agentName: string;
  agentTitle: string;
  agentPhotoUrl: string | null;
}

export function ActionPanel({
  propertyId,
  title,
  address,
  price,
  currency,
  whatsapp,
  email,
  agentName,
  agentTitle,
  agentPhotoUrl,
}: ActionPanelProps) {
  const { isFavorite, toggle } = useFavorites();
  const favorite = isFavorite(propertyId);

  const whatsappHref = `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
    `Hola, me interesa "${title}" (${address}). ¿Podemos coordinar una consulta?`,
  )}`;
  const emailHref = `mailto:${email}?subject=${encodeURIComponent(title)}`;

  return (
    <div className="sticky top-24 rounded-card border border-line bg-white p-6">
      <div className="mb-1 flex items-start justify-between gap-3">
        <p className="font-display text-[26px] text-brand-dark">{formatPrice(price, currency)}</p>
        <button
          type="button"
          onClick={() => toggle(propertyId)}
          aria-pressed={favorite}
          aria-label={favorite ? "Quitar de favoritos" : "Guardar en favoritos"}
          className={cn("text-2xl leading-none", favorite ? "text-alert" : "text-ink-soft")}
        >
          {favorite ? "♥" : "♡"}
        </button>
      </div>
      {price == null && <p className="mb-4 text-[13.5px] text-ink-soft">Cotización a confirmar con el agente.</p>}

      <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: "whatsapp" }), "mb-2.5 w-full")}>
        Consultar por WhatsApp
      </a>
      <a href="/contacto" className={cn(buttonVariants({ variant: "outline" }), "mb-2.5 w-full")}>
        Solicitar visita
      </a>
      <a href={emailHref} className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
        Consultar por email
      </a>

      <div className="mt-4 flex items-center gap-3 border-t border-line pt-4">
        {agentPhotoUrl ? (
          <Image src={agentPhotoUrl} alt={agentName} width={52} height={52} className="size-[52px] rounded-full object-cover" />
        ) : (
          <div className="flex size-[52px] items-center justify-center rounded-full bg-brand-tint text-sm font-semibold text-brand-dark">
            {agentName
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")}
          </div>
        )}
        <div>
          <p className="text-[14.5px] font-semibold text-ink">{agentName}</p>
          <p className="text-[13px] text-ink-soft">{agentTitle}</p>
        </div>
      </div>
    </div>
  );
}
