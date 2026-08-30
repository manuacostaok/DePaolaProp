"use client";

import { useEffect, useRef, useState } from "react";

// Clips reales de Buenos Aires con licencia Pexels — libres para uso
// comercial, sin atribución obligatoria. Perfil más cercano a Zona Norte
// (costa del río, puentes/puerto sobre el agua, parques) que el set
// anterior (Obelisco/Puerto Madero/Planetario, más "centro porteño").
// Fuentes (en el mismo orden que el array, de más liviano a más pesado
// para que el primer clip — el que carga en el LCP — sea el más chico):
// pexels.com/video/buenos-aires-aerial-19909620 (skyline y puente al atardecer)
// pexels.com/video/buenos-aires-aerial-19909622 (distrito financiero, atardecer)
// pexels.com/video/buenos-aires-aerial-19909615 (puente y puerto sobre el río)
// pexels.com/video/buenos-aires-aerial-19909623 (parque verde y skyline)
// pexels.com/video/buenos-aires-aerial-19909618 (costa del río, atardecer, botes)
const CLIPS = [
  "/hero/skyline-puente.mp4",
  "/hero/distrito-financiero.mp4",
  "/hero/puerto-rio.mp4",
  "/hero/parque-verde.mp4",
  "/hero/rio-atardecer.mp4",
];

export function HeroVideo({ posterUrl, className }: { posterUrl: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [clipIndex, setClipIndex] = useState(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect --
       Detección de prefers-reduced-motion a propósito en un efecto (no
       en el render): corre client-only para no desalinear el HTML
       servido por SSR (que siempre asume "sin video") con el primer
       render del cliente. */
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(!reduceMotion);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.load();
    video.play().catch(() => {});
  }, [clipIndex]);

  if (!enabled) {
    // eslint-disable-next-line @next/next/no-img-element -- fondo decorativo full-bleed, no contenido
    return <img src={posterUrl} alt="" className={className} />;
  }

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay
      muted
      playsInline
      poster={posterUrl}
      onEnded={() => setClipIndex((i) => (i + 1) % CLIPS.length)}
    >
      <source src={CLIPS[clipIndex]} type="video/mp4" />
    </video>
  );
}
