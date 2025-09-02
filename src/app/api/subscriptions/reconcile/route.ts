import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { SubscriptionPlan } from "@prisma/client";

// Downgrade expired paid subscriptions to FREE
// - If ?userId=... is provided, only reconcile that user's subscription
// - Otherwise reconcile all expired subscriptions
export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") || undefined;

    const now = new Date();

    // Build filter for expired, active, paid plans
    const where: any = {
      endsAt: { lt: now },
      plan: {
        in: [
          SubscriptionPlan.BASIC,
          SubscriptionPlan.PRO,
          SubscriptionPlan.PRO_PLUS,
        ],
      },
    };

    if (userId) {
      where.userId = userId;
    }

    // If no expired subs, return early
    const expiredSubs = await db.subscription.findMany({
      where,
      select: { id: true, userId: true },
    });
    if (expiredSubs.length === 0) {
      return NextResponse.json({ ok: true, updated: 0 });
    }

    const updatedAt = new Date();

    // Downgrade in bulk
    const result = await db.subscription.updateMany({
      where,
      data: {
        plan: SubscriptionPlan.FREE,
        status: "active",
        startedAt: updatedAt,
        endsAt: null,
      },
    });

    return NextResponse.json({ ok: true, updated: result.count });
  } catch (error: any) {
    console.error("reconcile subscriptions error", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

// Optional GET for convenience/testing
export async function GET(req: Request) {
  return POST(req);
}
