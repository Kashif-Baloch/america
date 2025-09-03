import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const GET = async (request: Request) => {
  try {
    // Create a new Headers object to ensure we have a proper Headers instance
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      headers.set(key, value);
    });
    
    const session = await auth.api.getSession({ headers });
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const subscription = await db.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (!subscription) {
      return NextResponse.json(
        { data: null },
        { status: 200 }
      );
    }

    // Calculate days left if subscription has an end date
    let daysLeft = null;
    if (subscription.endsAt) {
      const now = new Date();
      const endDate = new Date(subscription.endsAt);
      const diffTime = endDate.getTime() - now.getTime();
      daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      daysLeft = Math.max(0, daysLeft); // Ensure it's not negative
    }

    // Calculate duration in months if we have both start and end dates
    let durationMonths = 0;
    if (subscription.startedAt && subscription.endsAt) {
      const startDate = new Date(subscription.startedAt);
      const endDate = new Date(subscription.endsAt);
      const diffMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                       (endDate.getMonth() - startDate.getMonth());
      durationMonths = Math.max(1, diffMonths); // At least 1 month
    }

    return NextResponse.json({
      data: {
        ...subscription,
        daysLeft,
        durationMonths,
        isActive: subscription.status === 'active' && 
                 (!subscription.endsAt || new Date(subscription.endsAt) > new Date())
      }
    });

  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
