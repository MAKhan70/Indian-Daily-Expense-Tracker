ALTER TABLE "UserPreference" ADD COLUMN "themeMode" TEXT NOT NULL DEFAULT 'light';
ALTER TABLE "UserPreference" ADD COLUMN "palette" TEXT NOT NULL DEFAULT 'heritage';
ALTER TABLE "UserPreference" ADD COLUMN "look" TEXT NOT NULL DEFAULT 'soft';
UPDATE "UserPreference" SET "themeMode" = 'dark' WHERE "dark" = 1;
