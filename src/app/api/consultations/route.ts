import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has an active PRO+ subscription
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

    if (!subscription) {
      return NextResponse.json(
        { error: "PRO+ subscription required" },
        { status: 403 }
      );
    }

    // Get user's scheduled consultations
    const consultations = await db.consultation.findMany({
      where: {
        userId: session.user.id,
        status: "scheduled",
        scheduledAt: {
          gte: new Date(),
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
    });

    return NextResponse.json({ consultations });
  } catch (error) {
    console.error("Error fetching consultations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { scheduledAt, notes } = await req.json();

    const scheduledDate = new Date(scheduledAt);
    if (scheduledDate <= new Date()) {
      return NextResponse.json(
        { error: "Scheduled time must be in the future" },
        { status: 400 }
      );
    }

    // Check if user has an active PRO+ subscription
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

    if (!subscription) {
      return NextResponse.json(
        { error: "PRO+ subscription required" },
        { status: 403 }
      );
    }

    // Check if user already has a scheduled consultation
    const existingConsultation = await db.consultation.findFirst({
      where: {
        userId: session.user.id,
        status: "scheduled",
        scheduledAt: {
          gte: new Date(),
        },
      },
    });

    if (existingConsultation) {
      return NextResponse.json(
        { error: "You already have a scheduled consultation" },
        { status: 400 }
      );
    }

    // Create the consultation
    const consultation = await db.consultation.create({
      data: {
        userId: session.user.id,
        scheduledAt: scheduledDate,
        notes: notes || null,
        status: "scheduled",
        meetingLink: `https://meet.jit.si/aw-${Date.now()}`, // Generate a unique meeting link
      },
    });

    // Update subscription with the new consultation
    await db.subscription.update({
      where: { id: subscription.id },
      data: {
        consultations: {
          connect: { id: consultation.id },
        },
      },
    });

    return NextResponse.json({ consultation });
  } catch (error) {
    console.error("Error scheduling consultation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
