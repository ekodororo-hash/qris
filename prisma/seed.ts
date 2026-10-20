import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
async function main() {
  const email = process.env.SEED_ADMIN_EMAIL, pw = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !pw || pw.length < 12) throw new Error("Set SEED_ADMIN_EMAIL & SEED_ADMIN_PASSWORD (>=12 karakter)");
  await prisma.user.upsert({
    where: { email }, update: {},
    create: { name: "Admin", email, role: "ADMIN", passwordHash: await bcrypt.hash(pw, 12) },
  });
}
main().finally(() => prisma.$disconnect());
