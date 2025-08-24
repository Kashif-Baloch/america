import { SubscriptionPlan, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type JobFields = {
  title: boolean;
  salary: boolean;
  company: boolean;
  rating: boolean;
  requirements: boolean;
  jobType: boolean;
  season: boolean;
  transportationHousing: boolean;
  phoneNumber: boolean;
  overtime: boolean;
  legalProcess: boolean;
  processDuration: string;
  approvalRate: string;
  employeesHired: string;
  hiresOutside: boolean;
  websiteUrl: boolean;
  email: boolean;
};

export function getVisibleFields(plan: SubscriptionPlan): JobFields {
  const baseFields = {
    title: true,
    salary: false,
    company: false,
    rating: false,
    requirements: false,
    jobType: false,
    season: false,
    transportationHousing: false,
    phoneNumber: false,
    overtime: false,
    legalProcess: false,
    processDuration: "hidden",
    approvalRate: "hidden",
    employeesHired: "hidden",
    hiresOutside: false,
    websiteUrl: false,
    email: false,
  };

  switch (plan) {
    case SubscriptionPlan.NONE:
      return {
        ...baseFields,
        title: true,
        salary: true,
        rating: true,
      };

    case SubscriptionPlan.FREE:
      return {
        ...baseFields,
        title: true,
        salary: true,
        company: true,
        rating: true,
        requirements: true,
      };

    case SubscriptionPlan.BASIC:
      return {
        ...baseFields,
        title: true,
        salary: true,
        company: true,
        rating: true,
        requirements: true,
        jobType: true,
        websiteUrl: true,
      };

    case SubscriptionPlan.PRO:
      return {
        ...baseFields,
        title: true,
        salary: true,
        company: true,
        rating: true,
        requirements: true,
        jobType: true,
        season: true,
        transportationHousing: true,
        phoneNumber: true,
        overtime: true,
        legalProcess: true,
        processDuration: "visible",
        approvalRate: "visible",
        employeesHired: "visible",
        hiresOutside: true,
        websiteUrl: true,
        email: true,
      };

    case SubscriptionPlan.PRO_PLUS:
      return {
        ...baseFields,
        title: true,
        salary: true,
        company: true,
        rating: true,
        requirements: true,
        jobType: true,
        season: true,
        transportationHousing: true,
        phoneNumber: true,
        overtime: true,
        legalProcess: true,
        processDuration: "visible",
        approvalRate: "visible",
        employeesHired: "visible",
        hiresOutside: true,
        websiteUrl: true,
        email: true,
      };

    default:
      return baseFields;
  }
}

export async function checkFavoriteLimit(
  userId: string
): Promise<{ canAdd: boolean; limit: number; current: number }> {
  const limitinfo = await fetch("/api/favlimit?userId=" + userId);
  const limitData = await limitinfo.json();
  return limitData;
}

export async function checkFavoriteLimitServer(
  userId: string
): Promise<{ canAdd: boolean; limit: number; current: number }> {
  // Get user's active subscription
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });

  if (!user || !user.subscription) {
    return { canAdd: false, limit: 0, current: 0 };
  }

  // Define favorite limits per plan
  const favoriteLimits: Record<SubscriptionPlan, number> = {
    [SubscriptionPlan.NONE]: 5,
    [SubscriptionPlan.FREE]: 10,
    [SubscriptionPlan.BASIC]: 25,
    [SubscriptionPlan.PRO]: 100,
    [SubscriptionPlan.PRO_PLUS]: 1000, // Effectively unlimited for PRO_PLUS
  };

  const limit = favoriteLimits[user.subscription.plan];

  // Get current favorite count
  const current = await prisma.favorite.count({
    where: { userId },
  });

  return {
    canAdd: current < limit,
    limit,
    current,
  };
}

export function filterJobData(job: any, visibleFields: JobFields) {
  const filteredJob = { ...job };

  // Handle direct boolean fields
  Object.keys(visibleFields).forEach((field) => {
    const fieldValue = visibleFields[field as keyof JobFields];
    if (typeof fieldValue === "boolean" && !fieldValue) {
      filteredJob[field] = undefined;
    }
  });

  // Handle special fields with 'hidden'/'visible' values
  if (visibleFields.processDuration === "hidden") {
    filteredJob.processDuration = undefined;
  }
  if (visibleFields.approvalRate === "hidden") {
    filteredJob.approvalRate = undefined;
  }
  if (visibleFields.employeesHired === "hidden") {
    filteredJob.employeesHired = undefined;
  }

  return filteredJob;
}
