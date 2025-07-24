"use client";
import { PricingPlanEditor } from "@/components/pages/Admin/PricingEditor/PricingEditor";
import {
  getPricingPlansForLanguage,
  savePricingPlansForLanguage,
} from "@/lib/pricing-plans";
import { useLocale } from "next-intl";

export default function PortuguesePricingEditor() {
  const locale = useLocale();
  const plans = getPricingPlansForLanguage(locale);

  return (
    <PricingPlanEditor
      initialPlans={plans}
      onSave={(updatedPlans) => {
        savePricingPlansForLanguage(locale, updatedPlans);
      }}
      languages={[
        { code: "en", name: "English" },
        { code: "es", name: "Spanish" },
        { code: "pt", name: "Portuguese" },
      ]}
    />
  );
}
