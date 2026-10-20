import Link from "next/link";
import { Logo } from "./icons";

export function AuthShell({ title, desc, children, wide = false }: { title: string; desc?: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center px-5 py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-gradient-to-b from-brand-100/70 to-transparent" />
      <Link href="/" className="mb-8"><Logo /></Link>
      <div className={`w-full ${wide ? "max-w-lg" : "max-w-sm"}`}>
        <h1 className="text-center text-2xl font-bold tracking-tight">{title}</h1>
        {desc && <p className="mt-1.5 text-center text-sm text-slate-500">{desc}</p>}
        <div className="mt-7">{children}</div>
      </div>
    </main>
  );
}
