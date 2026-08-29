"use client";

import { useEffect, useRef, useState } from "react";

// Clips reales de Buenos Aires con licencia Pexels — libres para uso
// comercial, sin atribución obligatoria. Fuentes:
// pexels.com/video/obelisco-buenos-aires-19908912
// pexels.com/video/sunny-day-on-buenos-aires-bridge-36426975 (Puente de la Mujer, Puerto Madero)
// pexels.com/video/aerial-view-of-buenos-aires-planetarium-park-35565808 (Planetario + Río de la Plata)
const CLIPS = ["/hero/obelisco.mp4", "/hero/puerto-madero.mp4", "/hero/planetario.mp4"];

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
