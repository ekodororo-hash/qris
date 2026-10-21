import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { EmailForm, PasswordForm } from "./account-forms";

export default async function AccountPage() {
  const s = await requireRole("OWNER");
  const user = await prisma.user.findUnique({ where: { id: s.id }, select: { email: true } });
  if (!user) return <p className="text-slate-600">Akun tidak ditemukan.</p>;
  return (
    <>
      <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Akun</h1>
      <EmailForm email={user.email} />
      <PasswordForm />
    </>
  );
}
