-- Alamat dan tautan Google Review kini boleh kosong saat aktivasi (dilengkapi pemilik di dashboard).
ALTER TABLE "Business" ALTER COLUMN "address" DROP NOT NULL;
ALTER TABLE "Business" ALTER COLUMN "googleMapsUrl" DROP NOT NULL;
ALTER TABLE "Business" ALTER COLUMN "googleReviewUrl" DROP NOT NULL;
