import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ hasProPlus: false });
    }

    const subscription = await db.subscription.findUnique({
      where: {
        userId: session.user.id,
        status: "active",
        plan: "PRO_PLUS",
        endsAt: {
          gt: new Date(),
        },
      },
    });

    return NextResponse.json({ hasProPlus: !!subscription });
  } catch (error) {
    console.error("Error checking PRO+ status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
