// Suscribe un callback a scroll/resize coalescido en un solo requestAnimationFrame
// por frame — base común de los efectos atados al scroll de Home (progreso,
// hero, palabras, casa anclada). Corre una vez de entrada para fijar el estado
// inicial. Devuelve la función de limpieza.
export function onScrollFrame(callback: () => void): () => void {
  let queued = false;
  const run = () => {
    queued = false;
    callback();
  };
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(run);
  };

  run();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  return () => {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
  };
}

export function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}
