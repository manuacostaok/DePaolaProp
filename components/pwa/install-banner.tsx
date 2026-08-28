"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const DISMISS_KEY = "depaola:install-banner-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

export function InstallBanner() {
  const [platform, setPlatform] = useState<"ios" | "android" | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect --
       Detección de plataforma a propósito en un efecto (no en el render):
       corre client-only para no desalinear el HTML servido por SSR (que
       siempre renderiza "sin banner") con el primer render del cliente. */
    if (localStorage.getItem(DISMISS_KEY) === "1") return;

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (isStandalone) return;

    const ua = navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/.test(ua);
    const isAndroid = /Android/.test(ua);

    if (isIOS) {
      setPlatform("ios");
      setDismissed(false);
    } else if (isAndroid) {
      setPlatform("android");
      setDismissed(false);
      // Sin service worker, Chrome puede no disparar este evento nunca —
      // por eso el banner de Android ya muestra instrucciones manuales de
      // entrada; esto solo mejora la experiencia a un botón de un toque
      // cuando el navegador sí lo permite.
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
      };
      window.addEventListener("beforeinstallprompt", handler);
      return () => window.removeEventListener("beforeinstallprompt", handler);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  function dismiss() {
    setDismissed(true);
    localStorage.setItem(DISMISS_KEY, "1");
  }

  async function handleInstallClick() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    dismiss();
  }

  if (dismissed || !platform) return null;

  return (
    <div className="fixed inset-x-0 bottom-16 z-40 border-t border-line bg-white px-4 py-3 shadow-soft md:hidden">
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-control bg-brand text-sm font-bold text-white">
          D
        </div>
        <div className="min-w-0 flex-1">
          {platform === "ios" ? (
            <p className="text-[13px] text-ink">
              Agregá De Paola a tu pantalla de inicio: tocá <strong>Compartir</strong> (□↑) y después{" "}
              <strong>&quot;Agregar a inicio&quot;</strong>.
            </p>
          ) : deferredPrompt ? (
            <p className="text-[13px] text-ink">Instalá De Paola en tu teléfono para acceder más rápido.</p>
          ) : (
            <p className="text-[13px] text-ink">
              Agregá De Paola a tu pantalla de inicio: menú <strong>⋮</strong> → <strong>&quot;Instalar app&quot;</strong>{" "}
              o <strong>&quot;Agregar a pantalla de inicio&quot;</strong>.
            </p>
          )}
        </div>
        {platform === "android" && deferredPrompt && (
          <Button type="button" size="sm" onClick={handleInstallClick}>
            Instalar
          </Button>
        )}
        <button type="button" onClick={dismiss} aria-label="Cerrar" className="shrink-0 text-lg text-ink-soft">
          ✕
        </button>
      </div>
    </div>
  );
}
