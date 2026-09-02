"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
    // console.error de arriba solo llega a la consola del navegador del
    // usuario — nunca a los logs de Vercel (corren en el cliente). Este
    // POST manda el error al server para que SÍ quede en los Runtime Logs.
    // Best-effort: si falla el POST, no hay nada más que hacer acá.
    fetch("/api/log-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: error.message,
        digest: error.digest,
        stack: error.stack,
        url: window.location.href,
      }),
    }).catch(() => {});
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-[560px] flex-col items-center justify-center px-6 text-center sm:px-8">
      <h1 className="mb-3 text-2xl">Algo salió mal</h1>
      <p className="mb-6 text-ink-soft">
        Tuvimos un problema para mostrar esta página. Podés intentar de nuevo, o volver al inicio y probar desde ahí.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>Reintentar</Button>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}
