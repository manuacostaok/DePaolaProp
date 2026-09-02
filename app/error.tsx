"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // TODO: mandar a un servicio de monitoreo (Sentry o similar) cuando se
    // conecte en la Fase 6 del plan — por ahora al menos queda en los logs
    // de Vercel, que hoy es la única forma de enterarse de un error real.
    console.error(error);
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
