"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import DesktopCards from "./components/DesktopCards";
import MobileCards from "./components/MobileCards";
import { useTranslations } from "next-intl";
import { getPricingPlansForLanguage, PricingPlan } from "@/lib/pricing-plans";
import { useLocale } from "next-intl";
import { Loader2 } from "lucide-react";
import { SessionProvider } from "next-auth/react";

export default function PricingTable() {
  const t = useTranslations("pricing");
  const locale = useLocale();
  // const plansData = getPricingPlansForLanguage(locale);
  const [isQuarterly, setIsQuarterly] = useState(false);
  const [plans, setPlans] = useState<PricingPlan[] | null>(null);

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

  return (
    <SessionProvider>
      <div className="helmet font-sf md:my-32 pt-10 order-1 md:order-2">
        {/* Header */}
        <h1 className="md:text-[40px] sm:text-[32px] max-w-[645px] mx-auto text-center text-[26px] font-bold leading-[1.2] mb-6">
          {t.rich("toggleHeadline", {
            bold: (chunks) => (
              <span className="text-primary-blue px-3">{chunks}</span>
            ),
          })}
        </h1>
        <div className="flex gap-3 mt-7 justify-center items-center">
          <Label
            className={`${
              !isQuarterly ? "text-primary-blue" : "text-gray-500"
            } text-lg font-medium`}
          >
            {t("monthly")}
          </Label>
          <Switch
            checked={isQuarterly}
            onCheckedChange={setIsQuarterly}
            className="data-[state=checked]:bg-primary-blue cursor-pointer"
          />
          <Label
            className={`${
              isQuarterly ? "text-primary-blue" : "text-gray-500"
            } text-lg font-medium`}
          >
            {t("quarterly")}
          </Label>
        </div>

        {plans ? (
          <>
            {/* Desktop Cards */}
            <DesktopCards plans={plans.slice(0, 3)} isQuarterly={isQuarterly} />
            {/* Mobile Cards */}
            <MobileCards plans={plans.slice(0, 3)} isQuarterly={isQuarterly} />
          </>
        ) : (
          <div className="flex items-center justify-center h-[50vh]">
            <Loader2 size={30} className="animate-spin" />
          </div>
        )}
      </div>
    </SessionProvider>
  );
}
