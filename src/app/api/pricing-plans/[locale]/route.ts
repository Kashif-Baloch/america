import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { Language } from "@prisma/client";

// Shape used by the client/editor
export interface PricingPlanDTO {
  name: string;
  monthlyPrice: string;
  quarterlyPrice: string;
  monthlyUsdPrice: string;
  quarterlyUsdPrice: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  buttonText: string;
  type: string;
}

// Fallback defaults (importing avoids duplicating data); keep import type-only to prevent client code execution on server
import { defaultPlans as fallbackDefaultPlans } from "@/lib/pricing-plans";

function toDTOs(records: any[], locale: Language): PricingPlanDTO[] {
  return records
    .map((plan) => {
      const t = plan.translations.find((tr: any) => tr.language === locale);
      if (!t) return null;
      return {
        type: plan.type,
        highlighted: !!plan.highlighted,
        name: t.name,
        description: t.description,
        monthlyPrice: t.monthlyPrice,
        quarterlyPrice: t.quarterlyPrice,
        monthlyUsdPrice: t.monthlyUsdPrice,
        quarterlyUsdPrice: t.quarterlyUsdPrice,
        buttonText: t.buttonText,
        features: Array.isArray(t.features) ? (t.features as string[]) : [],
      } as PricingPlanDTO;
    })
    .filter(Boolean) as PricingPlanDTO[];
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ locale: string }> }
) {
  try {
    const supported = ["en", "es", "pt"] as const;
    const param = (await params).locale.toLowerCase();
    const locale = (
      supported.includes(param as any) ? param : "en"
    ) as Language;

    const plans = await db.pricingPlan.findMany({
      include: {
        translations: true,
      },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });

    const dtos = toDTOs(plans, locale);

    if (!dtos.length) {
      // Fallback to in-code defaults if DB not initialized
      const fallback = fallbackDefaultPlans[locale] || fallbackDefaultPlans.en;
      return NextResponse.json(fallback, { status: 200 });
    }

    return NextResponse.json(dtos, { status: 200 });
  } catch (error) {
    console.error("GET /api/pricing-plans error", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ locale: string }> }
) {
  try {
    const body = (await req.json()) as PricingPlanDTO[];
    const supported = ["en", "es", "pt"] as const;
    const param = (await params).locale.toLowerCase();
    const locale = (
      supported.includes(param as any) ? param : "en"
    ) as Language;

    // Upsert each plan and its translation for the locale
    for (const plan of body) {
      // Upsert main plan by unique type
      const upsertedPlan = await db.pricingPlan.upsert({
        where: { type: plan.type },
        create: {
          type: plan.type,
          highlighted: !!plan.highlighted,
          translations: {
            create: {
              language: locale,
              name: plan.name,
              description: plan.description,
              monthlyPrice: plan.monthlyPrice,
              quarterlyPrice: plan.quarterlyPrice,
              monthlyUsdPrice: plan.monthlyUsdPrice,
              quarterlyUsdPrice: plan.quarterlyUsdPrice,
              buttonText: plan.buttonText,
              features: plan.features as unknown as any,
            },
          },
        },
        update: {
          highlighted: !!plan.highlighted,
        },
      });

      // Upsert translation for this locale
      await db.pricingPlanTranslation.upsert({
        where: {
          planId_language: {
            planId: upsertedPlan.id,
            language: locale,
          },
        },
        update: {
          name: plan.name,
          description: plan.description,
          monthlyPrice: plan.monthlyPrice,
          quarterlyPrice: plan.quarterlyPrice,
          monthlyUsdPrice: plan.monthlyUsdPrice,
          quarterlyUsdPrice: plan.quarterlyUsdPrice,
          buttonText: plan.buttonText,
          features: plan.features as unknown as any,
        },
        create: {
          planId: upsertedPlan.id,
          language: locale,
          name: plan.name,
          description: plan.description,
          monthlyPrice: plan.monthlyPrice,
          quarterlyPrice: plan.quarterlyPrice,
          monthlyUsdPrice: plan.monthlyUsdPrice,
          quarterlyUsdPrice: plan.quarterlyUsdPrice,
          buttonText: plan.buttonText,
          features: plan.features as unknown as any,
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PUT /api/pricing-plans error", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
