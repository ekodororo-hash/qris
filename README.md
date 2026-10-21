# ReviewQR

## Jalankan lokal
npm install
cp .env.example .env        # isi DATABASE_URL, AUTH_SECRET, SEED_ADMIN_*
npx prisma migrate dev --name init   # buat & commit folder prisma/migrations
npm run db:seed
npm run dev

## Alur
Login admin (/login) -> "Buat QR baru" (PIN terlihat di daftar selama QR belum aktif) -> download QR di detail ->
pemilik scan -> isi form aktivasi (PIN dari admin) -> login dashboard.

## Deploy Vercel
1. Push ke GitHub, import di Vercel.
2. Env: DATABASE_URL, AUTH_SECRET, NEXT_PUBLIC_APP_URL (domain Vercel).
3. Migrasi produksi (sekali, dari lokal): DATABASE_URL=<prod> npx prisma migrate deploy, lalu db:seed.
4. Deploy.

## Sales & setoran
Admin > Sales: atur setoran wajib per QR, tambah nama sales (tanpa login), serahkan QR ke sales (PIN tampil di halaman sales untuk QR yang belum aktif), catat setoran.
QR berstatus aktivasi = terjual -> sales wajib setor sebesar harga yang dikunci saat serah terima. Sisa = wajib setor - total setoran.

### WAJIB sebelum deploy fitur Sales (tanpa terminal)
Kode Sales membaca tabel/kolom baru. Kalau kode ter-deploy sebelum DB diubah, halaman Daftar QR dan Ringkasan error.
Urutan: (1) jalankan SQL di bawah di SQL Editor dashboard database (Supabase/Neon), klik Run; (2) baru push ke GitHub (Vercel deploy otomatis).
SQL hanya menambah, tidak menghapus/mengubah data lama. Cukup dijalankan SEKALI (jalankan dua kali akan error "already exists", abaikan).
Kalau pakai terminal: `npx prisma db push` (hasilnya sama).

```sql
CREATE TABLE "Salesperson" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Salesperson_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Payment" (
  "id" TEXT NOT NULL,
  "salespersonId" TEXT NOT NULL,
  "amount" INTEGER NOT NULL,
  "paidAt" TIMESTAMP(3) NOT NULL,
  "note" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Setting" (
  "key" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  CONSTRAINT "Setting_pkey" PRIMARY KEY ("key")
);

ALTER TABLE "QrCode"
  ADD COLUMN "salespersonId" TEXT,
  ADD COLUMN "assignedAt" TIMESTAMP(3),
  ADD COLUMN "price" INTEGER;

CREATE INDEX "QrCode_salespersonId_idx" ON "QrCode"("salespersonId");
CREATE INDEX "Payment_salespersonId_paidAt_idx" ON "Payment"("salespersonId", "paidAt");

ALTER TABLE "QrCode" ADD CONSTRAINT "QrCode_salespersonId_fkey"
  FOREIGN KEY ("salespersonId") REFERENCES "Salesperson"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_salespersonId_fkey"
  FOREIGN KEY ("salespersonId") REFERENCES "Salesperson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
```

## Belum ada.
Reset aktivasi, OTP WhatsApp/email, rate limit terdistribusi (Upstash), tes otomatis.
