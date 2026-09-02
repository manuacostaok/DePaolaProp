import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import type { AgentRole } from "@prisma/client";

const COOKIE_NAME = "depaola_session";
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 días

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("Falta AUTH_SECRET en las variables de entorno.");
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  agentId: string;
  name: string;
  role: AgentRole;
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(getSecretKey());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// Defensa en profundidad: las server actions de /admin dependen del
// middleware (proxy.ts) para bloquear requests sin sesión, pero eso es una
// dependencia implícita (una server action importada desde una ruta pública,
// o un cambio de comportamiento de invocación en una futura versión de Next,
// rompería la protección sin que sea obvio). Cada acción sensible llama esto
// explícitamente en vez de confiar solo en el middleware.
export async function requireSession(role?: AgentRole): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new Error("No autorizado.");
  if (role && session.role !== role) throw new Error("No autorizado.");
  return session;
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
