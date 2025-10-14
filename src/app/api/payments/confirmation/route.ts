import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { SubscriptionPlan } from "@prisma/client";
import {
  sendSubscriptionWelcomeEmail,
  sendGiftInvitationEmail,
} from "@/actions/send-email.action";

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
    // extracting email and optional gift recipient from redirect url
    const redirect = new URL(data.redirect_url);
    const email = redirect.searchParams.get("email") || "";
    const giftRecipient = redirect.searchParams.get("giftRecipient") || "";
    // console.log("email", email, "giftRecipient", giftRecipient);
    if (status !== "APPROVED") {
      return NextResponse.json(
        { ok: false, message: "Payment not approved" },
        { status: 400 }
      );
    }

    const planMatch = referenceCode.match(/^plan-(.+?)-/);
    const plan = planMatch ? planMatch[1].toUpperCase() : "NONE";

    // If this is a gift purchase, create gift record and email recipient
    if (giftRecipient) {
      // find giver user if exists
      const giver = await db.user.findUnique({ where: { email } });

      // If recipient already exists, redeem immediately; else store gift as sent
      const recipient = await db.user.findUnique({
        where: { email: giftRecipient },
      });

      if (recipient) {
        const now = new Date();
        const endsAt = new Date();
        endsAt.setMonth(now.getMonth() + 1);

        const updatedPlan = plan === "PROPLUS" ? "PRO_PLUS" : plan;

        await db.subscription.upsert({
          where: { userId: recipient.id },
          update: {
            plan: updatedPlan,
            status: "active",
            searchCount: 0,
            startedAt: now,
            endsAt,
          },
          create: {
            userId: recipient.id,
            plan: updatedPlan,
            status: "active",
            searchCount: 0,
            startedAt: now,
            endsAt,
          },
        });

        await db.gift.create({
          data: {
            giverUserId: giver ? giver.id : "",
            recipientEmail: giftRecipient,
            recipientUserId: recipient.id,
            plan: updatedPlan as SubscriptionPlan,
            status: "redeemed",
            referenceCode,
            transactionId,
            redeemedAt: new Date(),
          },
        });

        await sendSubscriptionWelcomeEmail({
          to: recipient.email,
          userName: recipient.name || "Valued Customer",
          plan: updatedPlan as SubscriptionPlan,
        });

        return NextResponse.json({
          ok: true,
          message: "Gift redeemed for existing user",
        });
      } else {
        const updatedPlan = (
          plan === "PROPLUS" ? "PRO_PLUS" : plan
        ) as SubscriptionPlan;
        await db.gift.create({
          data: {
            giverUserId: giver ? giver.id : "",
            recipientEmail: giftRecipient,
            plan: updatedPlan,
            status: "sent",
            referenceCode,
            transactionId,
          },
        });

        const signupUrl = `${
          process.env.NEXT_PUBLIC_APP_URL || ""
        }/auth/sign-up?email=${encodeURIComponent(giftRecipient)}`;
        await sendGiftInvitationEmail({
          to: giftRecipient,
          giverName: giver?.name || email || "Un amigo",
          plan: updatedPlan,
          signupUrl,
        });

        return NextResponse.json({
          ok: true,
          message: "Gift created and invitation sent",
        });
      }
    }

    // Non-gift flow (assign plan to buyer)
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
