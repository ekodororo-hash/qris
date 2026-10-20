# ReviewQR

## Jalankan lokal
npm install
cp .env.example .env        # isi DATABASE_URL, AUTH_SECRET, SEED_ADMIN_*
npx prisma migrate dev --name init   # buat & commit folder prisma/migrations
npm run db:seed
npm run dev

## Alur
Login admin (/login) -> "Buat QR baru" (catat PIN, tampil sekali) -> download QR di detail ->
pemilik scan -> isi form aktivasi (PIN dari admin) -> login dashboard.

## Deploy Vercel
1. Push ke GitHub, import di Vercel.
2. Env: DATABASE_URL, AUTH_SECRET, NEXT_PUBLIC_APP_URL (domain Vercel).
3. Migrasi produksi (sekali, dari lokal): DATABASE_URL=<prod> npx prisma migrate deploy, lalu db:seed.
4. Deploy.

## Belum ada
Reset aktivasi, OTP WhatsApp/email, halaman statistik terpisah, rate limit terdistribusi (Upstash), tes otomatis.
