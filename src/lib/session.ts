import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type Role = "ADMIN" | "OWNER";
const key = () => new TextEncoder().encode(process.env.AUTH_SECRET);

export async function createSession(u: { id: string; role: Role }) {
  const token = await new SignJWT(u).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").sign(key());
  (await cookies()).set("session", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
}
export async function getSession(): Promise<{ id: string; role: Role } | null> {
  const t = (await cookies()).get("session")?.value;
  if (!t) return null;
  try { const { payload } = await jwtVerify(t, key()); return { id: payload.id as string, role: payload.role as Role }; } catch { return null; }
}
export async function requireRole(role: Role) {
  const s = await getSession();
  if (!s || s.role !== role) redirect("/login");
  return s;
}
export async function destroySession() { (await cookies()).delete("session"); }
