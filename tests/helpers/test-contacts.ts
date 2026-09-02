// Compartido por leads.spec.ts, tasacion.spec.ts y analytics.spec.ts: cada
// test que crea un Lead real usa un contacto único (timestamp + random, no
// solo timestamp — dos tests en paralelo pueden correr en el mismo
// milisegundo) para poder borrar SOLO su propio lead al terminar, nunca por
// contactName genérico (bajo fullyParallel eso puede pisar el lead de otro
// test que todavía lo necesita — ver el bug real que causó esto en
// newsletter.spec.ts).
export function uniquePhone() {
  const rand = Math.floor(Math.random() * 900 + 100);
  return `11${Date.now()}${rand}`.slice(-10);
}
