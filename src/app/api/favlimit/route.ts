import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { SubscriptionPlan } from "@prisma/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ hasProPlus: false });
    }

    const { searchParams } = new URL(req.url);

    const plan = searchParams.get("userId");

    if (!plan) {
      return NextResponse.json(
        { canAdd: false, limit: 0, current: 0 },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true },
    });

    if (!user || !user.subscription) {
      return NextResponse.json(
        { canAdd: false, limit: 0, current: 0 },
        { status: 400 }
      );
    }

    const favoriteLimits: Record<SubscriptionPlan, number> = {
      [SubscriptionPlan.NONE]: 5,
      [SubscriptionPlan.FREE]: 10,
      [SubscriptionPlan.BASIC]: 25,
      [SubscriptionPlan.PRO]: 100,
      [SubscriptionPlan.PRO_PLUS]: 1000, // Effectively unlimited for PRO_PLUS
    };

    const limit = favoriteLimits[plan as SubscriptionPlan];

    const current = await db.favorite.count({
      where: { userId: session.user.id },
    });

    return NextResponse.json(
      { canAdd: current < limit, limit, current },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching favorite limit:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
