import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Prisma, SubscriptionPlan } from "@prisma/client";
import { filterJobData, getVisibleFields } from "@/lib/subscription-utils";

// Track search counts in memory (in production, use a proper rate limiting solution like Redis)
// const searchCounts = new Map<string, { count: number; lastSearch: number }>();
// const ANONYMOUS_SEARCH_LIMIT = 5;
// const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });


    // const ip = headersList.get("x-forwarded-for") || "unknown";

    let plan: SubscriptionPlan = SubscriptionPlan.NONE;

    // Handle rate limiting for non-logged-in users
    // if (!session?.user?.id) {
    //   const now = Date.now();
    //   const userData = searchCounts.get(ip) || { count: 0, lastSearch: 0 };

    //   // Reset count if window has passed
    //   if (now - userData.lastSearch > RATE_LIMIT_WINDOW) {
    //     userData.count = 0;
    //   }

    //   // Check if user has exceeded the limit
    //   if (userData.count >= ANONYMOUS_SEARCH_LIMIT) {
    //     return NextResponse.json(
    //       {
    //         success: false,
    //         message: `Anonymous users are limited to ${ANONYMOUS_SEARCH_LIMIT} searches per day. Please sign in for more.`,
    //       },
    //       { status: 429 }
    //     );
    //   }

    //   // Increment search count
    //   userData.count++;
    //   userData.lastSearch = now;
    //   searchCounts.set(ip, userData);
    // }

    // let subId: string | null = null;

    if (session?.user?.id) {
      const sub = await db.subscription.findUnique({
        where: { userId: session.user.id },
      });
      if (sub) {
        plan = sub.plan;
        // subId = sub.id;

        // Reset monthly quota if period expired
        const now = new Date();
        if (sub.endsAt && now > sub.endsAt) {
          const newEndsAt = new Date();

          newEndsAt.setMonth(now.getMonth() + 1);

          await db.subscription.update({
            where: { id: sub.id },
            data: { searchCount: 0, startedAt: now, endsAt: newEndsAt },
          });
        }
      }
    }

    // Enforce search quotas (only for FREE/BASIC). PRO/PRO_PLUS unlimited.
    if (plan === SubscriptionPlan.FREE || plan === SubscriptionPlan.BASIC) {
      const sub = await db.subscription.findUnique({
        where: { userId: session!.user!.id },
      });

      if (sub) {
        const monthlyLimit = plan === SubscriptionPlan.FREE ? 50 : 100;

        if (sub.searchCount >= monthlyLimit) {
          return NextResponse.json(
            {
              success: true,
              data: [],
              message: "Monthly search limit reached.",
            },
            { status: 200 }
          );
        }
        // Increment per search request
        await db.subscription.update({
          where: { id: sub.id },
          data: { searchCount: { increment: 1 } },
        });
      }
    }

    // Parse filters from query string
    const url = new URL(req.url);
    const q = url.searchParams.get("q") || undefined; // job title query
    const location = url.searchParams.get("location") || undefined;
    const jobTypes = url.searchParams.getAll("jobType"); // multiple
    let hiresOutside = url.searchParams.get("hiresOutside") || undefined;
    let salary = url.searchParams.get("salary") || undefined;
    let seasons = url.searchParams.getAll("season");
    let transportationHousing =
      url.searchParams.get("transportationHousing") == "transport"
        ? "transportation_only"
        : url.searchParams.get("transportationHousing") == "housing"
        ? "housing_only"
        : undefined;

    if (plan === SubscriptionPlan.NONE || plan === SubscriptionPlan.FREE) {
      salary = undefined;
    } else if (plan === SubscriptionPlan.BASIC) {
      if (salary && salary !== "upto13") salary = "upto13";
    } else if (plan === SubscriptionPlan.PRO) {
      if (salary && salary === "above26") salary = undefined; // PRO cannot request above26
    }

    // Only PRO/PRO_PLUS can filter by these
    if (
      !(plan === SubscriptionPlan.PRO || plan === SubscriptionPlan.PRO_PLUS)
    ) {
      hiresOutside = undefined;
      seasons = [];
      transportationHousing = undefined;
    }

    const where: Prisma.JobWhereInput = {};
    const translationWhere: Prisma.JobTranslationWhereInput = {};

    if (location)
      translationWhere.location = { contains: location, mode: "insensitive" };

    if (q) translationWhere.title = { contains: q, mode: "insensitive" };

    if (jobTypes.length > 0) translationWhere.jobType = { in: jobTypes as any };

    if (hiresOutside) translationWhere.hiresOutside = hiresOutside as any;

    if (seasons.length > 0) translationWhere.season = { in: seasons as any };

    if (transportationHousing)
      translationWhere.transportationHousing = transportationHousing as any;

    if (Object.keys(translationWhere).length > 0) {
      where.translations = { some: translationWhere };
    }

    // Limits per plan for result size
    const take =
      plan === SubscriptionPlan.NONE
        ? 3
        : plan === SubscriptionPlan.FREE || plan === SubscriptionPlan.BASIC
        ? 15
        : 1000000;

    const jobs = await db.job.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { translations: true },
      ...(take ? { take } : {}),
    });

    // Apply salary bucket filtering (if provided). Salary is stored as string, so parse.
    function parseSalaryToNumber(s: string | null | undefined): number | null {
      if (!s) return null;
      const match = s.replace(/,/g, "").match(/\d+(?:\.\d+)?/);
      if (!match) return null;
      const num = parseFloat(match[0]);
      return isNaN(num) ? null : num;
    }

    let filtered = jobs;

    if (salary) {
      const bucket = salary as "upto13" | "upto26" | "above26";

      filtered = jobs.filter((job) => {
        // Try to use English translation first as a baseline; else any available
        const en = job.translations.find((t) => t.language === "en");
        const base = en ?? job.translations[0];
        const val = parseSalaryToNumber(base?.salary);
        if (val === null) return false;
        if (bucket === "upto13") return val <= 13;
        if (bucket === "upto26") return val > 13 && val <= 26;
        return val > 26; // above26
      });
    }

    // Apply field-level security based on subscription
    const visibleFields = getVisibleFields(plan);

    const securedJobs = filtered.map((job) => {
      // Get translations with filtered fields
      const filteredTranslations = job.translations.map((translation) => ({
        ...filterJobData(translation, visibleFields),
        language: translation.language, // Ensure language is always included
      }));

      return {
        ...job,
        translations: filteredTranslations,
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: securedJobs,
        message: "Jobs fetched successfully",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/public/jobs error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
