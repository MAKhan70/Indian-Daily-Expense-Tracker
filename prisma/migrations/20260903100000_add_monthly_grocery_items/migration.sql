-- CreateTable
CREATE TABLE "GroceryItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,
    "quantity" REAL NOT NULL DEFAULT 1,
    "unit" TEXT NOT NULL DEFAULT 'item',
    "unitPriceMinor" INTEGER,
    "included" BOOLEAN NOT NULL DEFAULT true,
    "purchased" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GroceryItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "GroceryItem_userId_month_idx" ON "GroceryItem"("userId", "month");

-- CreateIndex
CREATE INDEX "GroceryItem_userId_groupName_idx" ON "GroceryItem"("userId", "groupName");
