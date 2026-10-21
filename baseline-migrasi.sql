-- JALANKAN SEKALI di SQL Editor database, SEBELUM push ke GitHub.
-- Ini tidak mengubah tabel/data apa pun. Hanya mencatat bahwa struktur database
-- yang sekarang sudah setara dengan migrasi "0_init", supaya Prisma tidak mencoba membuat ulang tabel.

CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id" VARCHAR(36) PRIMARY KEY NOT NULL,
    "checksum" VARCHAR(64) NOT NULL,
    "finished_at" TIMESTAMPTZ,
    "migration_name" VARCHAR(255) NOT NULL,
    "logs" TEXT,
    "rolled_back_at" TIMESTAMPTZ,
    "started_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "applied_steps_count" INTEGER NOT NULL DEFAULT 0
);

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "applied_steps_count")
SELECT gen_random_uuid()::text, '5db7d1b2faae75c810676b2ea445294ba29a63a4d6cf5eb5ce46f11ae7aedda5', now(), '0_init', 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '0_init');
