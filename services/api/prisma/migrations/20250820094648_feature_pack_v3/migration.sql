-- CreateTable
CREATE TABLE "public"."ARObject" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "meshKey" TEXT,
    "previewKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ARObject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ARLink" (
    "objectId" TEXT NOT NULL,
    "memoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ARLink_pkey" PRIMARY KEY ("objectId","memoryId")
);

-- CreateTable
CREATE TABLE "public"."Milestone" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "confidence" INTEGER NOT NULL DEFAULT 100,
    "completeness" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Quest" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "target" INTEGER NOT NULL DEFAULT 5,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."QuestPick" (
    "id" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "memoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestPick_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Consent" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "shareId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Consent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShareLink" (
    "id" TEXT NOT NULL,
    "memoryId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "passHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShareLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Milestone_childId_title_key" ON "public"."Milestone"("childId", "title");

-- CreateIndex
CREATE UNIQUE INDEX "Quest_childId_month_year_key" ON "public"."Quest"("childId", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "Consent_shareId_key" ON "public"."Consent"("shareId");

-- CreateIndex
CREATE INDEX "Consent_childId_shareId_idx" ON "public"."Consent"("childId", "shareId");

-- AddForeignKey
ALTER TABLE "public"."ARObject" ADD CONSTRAINT "ARObject_childId_fkey" FOREIGN KEY ("childId") REFERENCES "public"."Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ARLink" ADD CONSTRAINT "ARLink_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "public"."ARObject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ARLink" ADD CONSTRAINT "ARLink_memoryId_fkey" FOREIGN KEY ("memoryId") REFERENCES "public"."Memory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Milestone" ADD CONSTRAINT "Milestone_childId_fkey" FOREIGN KEY ("childId") REFERENCES "public"."Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Quest" ADD CONSTRAINT "Quest_childId_fkey" FOREIGN KEY ("childId") REFERENCES "public"."Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuestPick" ADD CONSTRAINT "QuestPick_questId_fkey" FOREIGN KEY ("questId") REFERENCES "public"."Quest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuestPick" ADD CONSTRAINT "QuestPick_memoryId_fkey" FOREIGN KEY ("memoryId") REFERENCES "public"."Memory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Consent" ADD CONSTRAINT "Consent_childId_fkey" FOREIGN KEY ("childId") REFERENCES "public"."Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Consent" ADD CONSTRAINT "Consent_shareId_fkey" FOREIGN KEY ("shareId") REFERENCES "public"."ShareLink"("id") ON DELETE SET NULL ON UPDATE CASCADE;
