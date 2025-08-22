"use client";
import { useEffect, useState } from "react";
import { PricingPlanEditor } from "@/components/pages/Admin/PricingEditor/PricingEditor";
import {
  getPricingPlansForLanguage,
  savePricingPlansForLanguage,
  type PricingPlan,
} from "@/lib/pricing-plans";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

export default function PortuguesePricingEditor() {
  const t = useTranslations("PricingPlanEditor");
  const locale = useLocale();
  const [plans, setPlans] = useState<PricingPlan[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const data = await getPricingPlansForLanguage(locale);
      if (active) setPlans(data);
    })();
    return () => {
      active = false;
    };
  }, [locale]);

  if (!plans) return null; // or a loader

  return (
    <PricingPlanEditor
      key={`${locale}-${plans.length}`}
      loading={loading}
      initialPlans={plans}
      onSave={async (updatedPlans) => {
        try {
          setLoading(true);
          await savePricingPlansForLanguage(locale, updatedPlans);
          setPlans(updatedPlans);
          toast.success(t("success.save"));
        } catch (error) {
          toast.error(t("error.error"));
          console.error("Failed to save pricing plans:", error);
        } finally {
          setLoading(false);
        }
      }}
      languages={[
        { code: "en", name: "English" },
        { code: "es", name: "Spanish" },
        { code: "pt", name: "Portuguese" },
      ]}
    />
  );
}
