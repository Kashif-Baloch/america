import { useTranslations } from "next-intl";

export interface PricingPlan {
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

const usePricingPlans = () => {
  const t = useTranslations("pricing.pricingPlans");

  // Check for saved plans in localStorage
  let savedPlans: PricingPlan[] | null = null;
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("pricingPlans");
    savedPlans = saved ? JSON.parse(saved) : null;
  }

  const defaultPlans = [
    {
      name: t("free.name"),
      description: t("free.description"),
      features: t.raw("free.features"),
      monthlyPrice: "Free",
      quarterlyPrice: "Free",
      monthlyUsdPrice: "",
      quarterlyUsdPrice: "",
      buttonText: t("free.buttonText"),
      type: "free",
    },
    {
      name: t("basic.name"),
      description: t("basic.description"),
      features: t.raw("basic.features"),
      monthlyPrice: "105.000 COP",
      quarterlyPrice: "84.000 COP",
      monthlyUsdPrice: "$25 +Tax Included",
      quarterlyUsdPrice: "$20 +Tax Included",
      buttonText: t("basic.buttonText"),
      type: "basic",
    },
    {
      name: t("pro.name"),
      description: t("pro.description"),
      features: t.raw("pro.features"),
      monthlyPrice: "120.000 COP",
      quarterlyPrice: "96.600 COP",
      monthlyUsdPrice: "$28 +Tax Included",
      quarterlyUsdPrice: "$23 +Tax Included",
      buttonText: t("pro.buttonText"),
      type: "pro",
      highlighted: true,
    },
    {
      name: t("proPlus.name"),
      description: t("proPlus.description"),
      features: t.raw("proPlus.features"),
      monthlyPrice: "246.000 COP",
      quarterlyPrice: "193.000 COP",
      monthlyUsdPrice: "$58 +Tax Included",
      quarterlyUsdPrice: "$46 +Tax Included",
      buttonText: t("proPlus.buttonText"),
      type: "proplus",
    },
  ];

  return savedPlans || defaultPlans;
};

export default usePricingPlans;
