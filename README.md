# ReviewQR

## Jalankan lokal
npm install
cp .env.example .env        # isi DATABASE_URL, AUTH_SECRET, SEED_ADMIN_*
npx prisma migrate dev              # terapkan semua migrasi di prisma/migrations
npm run db:seed
npm run dev

## Alur
Login admin (/login) -> "Buat QR baru" (PIN terlihat di daftar selama QR belum aktif) -> download QR di detail ->
pemilik scan -> isi form aktivasi (PIN dari admin) -> login dashboard.

## Deploy Vercel
1. Push ke GitHub, import di Vercel.
2. Env: DATABASE_URL, AUTH_SECRET, NEXT_PUBLIC_APP_URL (domain Vercel).
3. Tambahkan env DIRECT_URL juga di Vercel (dipakai saat build untuk migrasi).
4. Deploy. Migrasi di prisma/migrations dijalankan otomatis saat build (prisma migrate deploy).

## Sales & setoran
Admin > Sales: atur setoran wajib per QR, tambah nama sales (tanpa login), serahkan QR ke sales (PIN tampil di halaman sales untuk QR yang belum aktif), catat setoran.
QR berstatus aktivasi = terjual -> sales wajib setor sebesar harga yang dikunci saat serah terima. Sisa = wajib setor - total setoran.

## Migrasi database (Prisma)
Setiap perubahan struktur database dicatat sebagai folder di `prisma/migrations/<tanggal>_<nama>/migration.sql`.
Saat build di Vercel, `prisma migrate deploy` menjalankan migrasi yang belum pernah dijalankan, lalu `next build`.
Jadi urutan "SQL dulu baru push" tidak perlu lagi: cukup push ke GitHub.

Mengubah struktur database:
1. Ubah `prisma/schema.prisma`.
2. Buat migrasinya dari terminal: `npx prisma migrate dev --name nama_perubahan` (menghasilkan folder migrasi baru).
3. Commit folder `prisma/migrations/` bersama perubahan schema, push. Vercel menerapkannya saat build.

Tanpa terminal: tulis sendiri `prisma/migrations/<YYYYMMDDHHMMSS>_nama/migration.sql` berisi SQL perubahan,
upload ke GitHub bersama perubahan schema. Jangan mengubah isi migrasi yang sudah pernah dijalankan.

`0_init` adalah kondisi database saat migrasi mulai dicatat. Database yang sudah ada cukup ditandai sekali
dengan menjalankan `baseline-migrasi.sql` di SQL Editor (hanya mencatat, tidak mengubah tabel).

## Belum ada.
Lupa/ganti password, OTP WhatsApp/email, rate limit terdistribusi (Upstash), tes otomatis.
