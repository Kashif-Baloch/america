import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { SubscriptionPlan } from "@prisma/client";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: true, data: { plan: SubscriptionPlan.NONE }, message: "No session" },
        { status: 200 }
      );
    }

    const sub = await db.subscription.findUnique({ where: { userId: session.user.id } });
    const plan = sub?.plan ?? SubscriptionPlan.NONE;

    return NextResponse.json(
      { success: true, data: { plan }, message: "OK" },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/subscription/me error:", err);
    return NextResponse.json({ success: false, data: null, message: "Internal Server Error" }, { status: 500 });
  }
}
