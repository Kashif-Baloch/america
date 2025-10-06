-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."SubscriptionPlan" AS ENUM ('NONE', 'FREE', 'BASIC', 'PRO', 'PRO_PLUS');

-- CreateEnum
CREATE TYPE "public"."Language" AS ENUM ('en', 'es', 'pt');

-- CreateEnum
CREATE TYPE "public"."Rating" AS ENUM ('1', '2', '3', '4', '5');

-- CreateEnum
CREATE TYPE "public"."HiresOutside" AS ENUM ('yes', 'no', 'sometimes');

-- CreateEnum
CREATE TYPE "public"."JobType" AS ENUM ('full_time', 'part_time', 'contract', 'temporary', 'internship');

-- CreateEnum
CREATE TYPE "public"."JobSeason" AS ENUM ('spring', 'summer', 'fall', 'winter', 'year_round');

-- CreateEnum
CREATE TYPE "public"."TransportationHousing" AS ENUM ('provided', 'not_provided', 'partial', 'transportation_only', 'housing_only');

-- CreateEnum
CREATE TYPE "public"."OvertimeAvailability" AS ENUM ('available', 'not_available', 'limited');

-- CreateEnum
CREATE TYPE "public"."ProcessSpeed" AS ENUM ('fast', 'medium', 'slow');

-- CreateEnum
CREATE TYPE "public"."ApprovalEfficiency" AS ENUM ('high', 'medium', 'low');

-- CreateTable
CREATE TABLE "public"."Consultation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "notes" TEXT,
    "meetingLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subscriptionId" TEXT,

    CONSTRAINT "Consultation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" "public"."SubscriptionPlan" NOT NULL DEFAULT 'FREE',
    "status" TEXT NOT NULL DEFAULT 'inactive',
    "searchCount" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "phone" TEXT,
    "resumeLink" TEXT,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "banned" BOOLEAN,
    "banReason" TEXT,
    "banExpires" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sessions" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    "impersonatedBy" TEXT,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."accounts" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."verifications" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."jobs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."job_translations" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "language" "public"."Language" NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "salary" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "rating" "public"."Rating" NOT NULL,
    "hiresOutside" "public"."HiresOutside" NOT NULL,
    "requirements" TEXT NOT NULL,
    "jobType" "public"."JobType" NOT NULL,
    "season" "public"."JobSeason" NOT NULL,
    "transportationHousing" "public"."TransportationHousing" NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "overtime" "public"."OvertimeAvailability" NOT NULL,
    "legalProcess" TEXT NOT NULL,
    "processDuration" TEXT NOT NULL,
    "approvalRate" TEXT NOT NULL,
    "employeesHired" TEXT NOT NULL,
    "processSpeed" "public"."ProcessSpeed" NOT NULL,
    "approvalEfficiency" "public"."ApprovalEfficiency" NOT NULL,
    "visaEmployees" TEXT NOT NULL,
    "certifications" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pricing_plans" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "highlighted" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pricing_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pricing_plan_translations" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "language" "public"."Language" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "monthlyPrice" TEXT NOT NULL,
    "quarterlyPrice" TEXT NOT NULL,
    "monthlyUsdPrice" TEXT NOT NULL,
    "quarterlyUsdPrice" TEXT NOT NULL,
    "buttonText" TEXT NOT NULL,
    "features" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pricing_plan_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pricing_market" (
    "id" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "countdownTimer" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "oldPrice" TEXT NOT NULL,
    "newPrice" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pricing_market_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Favorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ModalContent" (
    "id" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "en" JSONB NOT NULL,
    "es" JSONB NOT NULL,
    "pt" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModalContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Testimonial" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "flag" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "textEn" TEXT NOT NULL,
    "textEs" TEXT NOT NULL,
    "textPt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."job_details" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "typeJobId" TEXT,
    "employerId" TEXT,
    "basicWageRateFrom" DOUBLE PRECISION,
    "basicWageRateTo" DOUBLE PRECISION,
    "per" TEXT,
    "worksiteCity" TEXT,
    "worksiteState" TEXT,
    "worksitePostalCode" INTEGER,
    "requestedBeginDate" TIMESTAMP(3),
    "requestedEndDate" TIMESTAMP(3),
    "hiringSeason" TEXT,
    "overtimeAvailable" BOOLEAN,
    "boardLodging" BOOLEAN,
    "dailyTransportation" BOOLEAN,
    "receivedDate" TIMESTAMP(3),
    "decisionDate" TIMESTAMP(3),
    "specialRequirements" TEXT,
    "hiringOutsideNow" BOOLEAN,
    "hiringOutsideLast3" INTEGER,
    "hiringOutsideLastYr" INTEGER,
    "caseApprovalRate" DOUBLE PRECISION,
    "typeOfRepresentation" TEXT,
    "daysOfGovReception" INTEGER,
    "approvalEfficiency" TEXT,
    "totalWorkersCertified" INTEGER,
    "phoneNumber" TEXT,
    "emailToApply" TEXT,
    "employerPocEmail" TEXT,
    "approvedCertifications5Y" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Employer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Employer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TypeJob" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TypeJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Consultation_userId_idx" ON "public"."Consultation"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "public"."Subscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "public"."sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "job_translations_jobId_language_key" ON "public"."job_translations"("jobId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "pricing_plans_type_key" ON "public"."pricing_plans"("type");

-- CreateIndex
CREATE UNIQUE INDEX "pricing_plan_translations_planId_language_key" ON "public"."pricing_plan_translations"("planId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_jobId_key" ON "public"."Favorite"("userId", "jobId");

-- CreateIndex
CREATE UNIQUE INDEX "ModalContent_page_key" ON "public"."ModalContent"("page");

-- CreateIndex
CREATE UNIQUE INDEX "job_details_jobId_key" ON "public"."job_details"("jobId");

-- AddForeignKey
ALTER TABLE "public"."Consultation" ADD CONSTRAINT "Consultation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Consultation" ADD CONSTRAINT "Consultation_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "public"."Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."jobs" ADD CONSTRAINT "jobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."job_translations" ADD CONSTRAINT "job_translations_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pricing_plan_translations" ADD CONSTRAINT "pricing_plan_translations_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."pricing_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Favorite" ADD CONSTRAINT "Favorite_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."job_details" ADD CONSTRAINT "job_details_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."job_details" ADD CONSTRAINT "job_details_typeJobId_fkey" FOREIGN KEY ("typeJobId") REFERENCES "public"."TypeJob"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."job_details" ADD CONSTRAINT "job_details_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "public"."Employer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
