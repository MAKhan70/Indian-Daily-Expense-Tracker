ALTER TABLE "UserPreference" ADD COLUMN "categoryConfigJson" TEXT NOT NULL DEFAULT '{}';
ALTER TABLE "UserPreference" ADD COLUMN "analyticsModulesJson" TEXT NOT NULL DEFAULT '{"pie":true,"bar":true,"trend":true}';
