CREATE TABLE IF NOT EXISTS "AuditReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "teamSize" INTEGER NOT NULL,
    "primaryUseCase" TEXT NOT NULL,
    "inputJson" JSONB NOT NULL,
    "auditJson" JSONB NOT NULL,
    "summary" TEXT NOT NULL,
    "totalMonthlySavings" REAL NOT NULL,
    "totalAnnualSavings" REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reportId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "companyName" TEXT,
    "role" TEXT,
    "teamSize" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Lead_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "AuditReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "AuditReport_slug_key" ON "AuditReport"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "Lead_reportId_key" ON "Lead"("reportId");
