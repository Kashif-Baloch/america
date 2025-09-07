import { NextResponse } from "next/server";
import { db as prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const pricingMarket = await prisma.pricingMarket.findFirst({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(pricingMarket);
  } catch (error) {
    console.error("Error fetching pricing market:", error);
    return NextResponse.json(
      { error: "Failed to fetch pricing market data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { isActive, countdownTimer, oldPrice } = await request.json();

    // Deactivate all other active timers
    if (isActive) {
      await prisma.pricingMarket.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    const newPricingMarket = await prisma.pricingMarket.create({
      data: {
        isActive,
        countdownTimer: new Date(countdownTimer),
        oldPrice,
      },
    });

    return NextResponse.json(newPricingMarket, { status: 201 });
  } catch (error) {
    console.error("Error creating pricing market:", error);
    return NextResponse.json(
      { error: "Failed to create pricing market" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json();

    // If activating this timer, deactivate all others
    if (data.isActive) {
      await prisma.pricingMarket.updateMany({
        where: { isActive: true, id: { not: id } },
        data: { isActive: false },
      });
    }

    const updatedPricingMarket = await prisma.pricingMarket.update({
      where: { id },
      data: {
        ...data,
        ...(data.countdownTimer && {
          countdownTimer: new Date(data.countdownTimer),
        }),
      },
    });

    return NextResponse.json(updatedPricingMarket);
  } catch (error) {
    console.error("Error updating pricing market:", error);
    return NextResponse.json(
      { error: "Failed to update pricing market" },
      { status: 500 }
    );
  }
}
