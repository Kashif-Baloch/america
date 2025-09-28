// import { db } from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import { SubscriptionPlan } from "@prisma/client";
// import { sendSubscriptionWelcomeEmail } from "@/actions/send-email.action";

// export async function POST(req: Request) {
//   try {
//     const { email, referenceCode, status } = await req.json();

//     if (status !== "APPROVED") {
//       return NextResponse.json(
//         { ok: false, message: "Payment not approved" },
//         { status: 400 }
//       );
//     }

//     const planMatch = referenceCode.match(/^plan-(.+?)-/);
//     const plan = planMatch ? planMatch[1].toUpperCase() : "NONE"; // BASIC / PRO / PRO_PLUS

//     const user = await db.user.findUnique({ where: { email } });
//     if (!user) {
//       return NextResponse.json(
//         { ok: false, message: "User not found" },
//         { status: 404 }
//       );
//     }

//     const now = new Date();
//     const endsAt = new Date();
//     endsAt.setMonth(now.getMonth() + 1);

//     const updatedPlan = plan === "PROPLUS" ? "PRO_PLUS" : plan;

//     await db.subscription.upsert({
//       where: { userId: user.id },
//       update: {
//         plan: updatedPlan,
//         status: "active",
//         searchCount: 0,
//         startedAt: now,
//         endsAt,
//       },
//       create: {
//         userId: user.id,
//         plan: updatedPlan,
//         status: "active",
//         searchCount: 0,
//         startedAt: now,
//         endsAt,
//       },
//     });

//     await sendSubscriptionWelcomeEmail({
//       to: email,
//       userName: user.name || "Valued Customer",
//       plan: updatedPlan as SubscriptionPlan,
//     });

//     return NextResponse.json({ ok: true, message: "Payment successful" });
//   } catch (err: any) {
//     console.error(err);
//     return NextResponse.json(
//       { ok: false, error: err.message },
//       { status: 500 }
//     );
//   }
// }

import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { SubscriptionPlan } from "@prisma/client";
import { sendSubscriptionWelcomeEmail } from "@/actions/send-email.action";

export async function POST(req: Request) {
  try {
    const { transactionId } = await req.json();
    console.log(transactionId);
    if (!transactionId) {
      return NextResponse.json(
        { ok: false, message: "Missing transactionId" },
        { status: 400 }
      );
    }

    // ✅ Fetch transaction details from Wompi
    const wompiRes = await fetch(
      `https://sandbox.wompi.co/v1/transactions/${transactionId}`
    );

    if (!wompiRes.ok) throw new Error("Failed to fetch Wompi transaction");

    const responseData = await wompiRes.json();
    const { data } = responseData;
    const status = data.status; // APPROVED, DECLINED, etc.
    const referenceCode = data.reference || "";
    // extracting email from redirect url
    const email = new URL(data.redirect_url).searchParams.get("email") || "";

    if (status !== "APPROVED") {
      return NextResponse.json(
        { ok: false, message: "Payment not approved" },
        { status: 400 }
      );
    }

    const planMatch = referenceCode.match(/^plan-(.+?)-/);
    const plan = planMatch ? planMatch[1].toUpperCase() : "NONE";

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { ok: false, message: "User not found" },
        { status: 404 }
      );
    }

    const now = new Date();
    const endsAt = new Date();
    endsAt.setMonth(now.getMonth() + 1);

    const updatedPlan = plan === "PROPLUS" ? "PRO_PLUS" : plan;

    await db.subscription.upsert({
      where: { userId: user.id },
      update: {
        plan: updatedPlan,
        status: "active",
        searchCount: 0,
        startedAt: now,
        endsAt,
      },
      create: {
        userId: user.id,
        plan: updatedPlan,
        status: "active",
        searchCount: 0,
        startedAt: now,
        endsAt,
      },
    });

    await sendSubscriptionWelcomeEmail({
      to: email,
      userName: user.name || "Valued Customer",
      plan: updatedPlan as SubscriptionPlan,
    });

    return NextResponse.json({ ok: true, message: "Payment successful" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
