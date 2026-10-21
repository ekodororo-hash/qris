import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

// sesi masih aktif -> langsung ke dashboard (penting untuk aplikasi PWA yang selalu dibuka di /login)
export default async function LoginPage() {
  const s = await getSession();
  if (s) redirect(s.role === "ADMIN" ? "/admin" : "/dashboard");
  return <LoginForm />;
}
