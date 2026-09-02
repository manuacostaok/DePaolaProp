"use client";

import { useEffect } from "react";

// Reemplaza TODO el layout raíz (incluido <html>/<body>) cuando el error
// ocurre ahí mismo — a propósito no reusa Header/Footer ni componentes que
// dependan de datos, para no arriesgarse a que el propio fallback rompa.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
    // Ver el mismo comentario en app/error.tsx: esto corre en el cliente,
    // así que el console.error de arriba no llega a los logs de Vercel —
    // este POST sí (best-effort, nunca bloquea el fallback).
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
    <html lang="es">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#F5F1E8", color: "#00385C" }}>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "24px",
          }}
        >
          <h1 style={{ marginBottom: 12, fontSize: 24 }}>Algo salió mal</h1>
          <p style={{ marginBottom: 24, color: "#57534A" }}>
            De Paola Propiedades tuvo un problema inesperado. Probá de nuevo en un momento.
          </p>
          <button
            onClick={reset}
            style={{
              padding: "11px 24px",
              borderRadius: 999,
              border: "none",
              background: "#00385C",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reintentar
          </button>
        </main>
      </body>
    </html>
  );
}
