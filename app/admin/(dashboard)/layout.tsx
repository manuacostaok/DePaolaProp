import Link from "next/link";
import { getSession } from "@/lib/session";
import { logout } from "@/app/admin/login/actions";

const NAV = [
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/properties", label: "Propiedades" },
  { href: "/admin/agents", label: "Agentes", adminOnly: true },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="flex min-h-screen flex-col bg-bg-alt sm:flex-row">
      <aside className="shrink-0 border-b border-line bg-white p-4 sm:w-56 sm:border-b-0 sm:border-r sm:p-5">
        <p className="mb-4 font-display text-lg text-brand-dark sm:mb-6">De Paola · Admin</p>
        <nav className="flex flex-row flex-wrap gap-1 sm:flex-col">
          {NAV.filter((item) => !item.adminOnly || session?.role === "ADMINISTRADOR").map((item) => (
            <Link key={item.href} href={item.href} className="rounded-control px-3 py-2 text-sm text-ink hover:bg-brand-tint">
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-line bg-white px-6 py-3">
          <span className="text-sm text-ink-soft">{session?.name}</span>
          <form action={logout}>
            <button type="submit" className="text-sm text-ink-soft underline">
              Salir
            </button>
          </form>
        </header>
        <main className="overflow-x-auto p-6">{children}</main>
      </div>
    </div>
  );
}
