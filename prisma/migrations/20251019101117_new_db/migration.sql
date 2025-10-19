-- DropForeignKey
ALTER TABLE "public"."jobs" DROP CONSTRAINT "jobs_userId_fkey";

-- AlterTable
ALTER TABLE "public"."jobs" ADD COLUMN     "companyEmails" TEXT[],
ADD COLUMN     "websiteLink" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."contact_submissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Gift" (
    "id" TEXT NOT NULL,
    "giverUserId" TEXT NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "recipientUserId" TEXT,
    "plan" "public"."SubscriptionPlan" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'sent',
    "referenceCode" TEXT,
    "transactionId" TEXT,
    "redeemedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gift_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Gift_recipientEmail_idx" ON "public"."Gift"("recipientEmail");

-- AddForeignKey
ALTER TABLE "public"."jobs" ADD CONSTRAINT "jobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
