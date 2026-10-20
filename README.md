# ReviewQR — fondasi (tahap 1-3, 5-6 inti)

## Setup
npx create-next-app@latest . --ts --tailwind --app --src-dir --import-alias "@/*"
npm i @prisma/client zod qrcode bcryptjs next-auth@beta
npm i -D prisma tsx @types/bcryptjs @types/qrcode
cp .env.example .env   # isi nilai
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
npm run dev

## Struktur target
src/app/(marketing)/page.tsx | admin/{login,page,qr/new,qr/[id]} | dashboard/{page,settings,activity}
src/app/q/[token]/{page.tsx,go/route.ts,activated/page.tsx} | src/lib/{db,tokens,validators,activation}.ts
## Sudah ada: schema, token/PIN, validasi URL Google, aktivasi atomik, routing 3 kondisi.
## Berikutnya: auth+role (middleware), admin buat QR + download PNG/SVG, form aktivasi, route /go, dashboard, deploy Vercel.
