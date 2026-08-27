import { SITE } from "@/lib/nav";

export function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-[86px] right-5 z-50 flex size-[54px] items-center justify-center rounded-full bg-whatsapp text-2xl text-white shadow-[0_6px_18px_rgba(0,0,0,0.22)] md:bottom-6"
    >
      ☎
    </a>
  );
}
