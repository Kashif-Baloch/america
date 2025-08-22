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

export const defaultPlans: Record<string, PricingPlan[]> = {
  en: [
    {
      name: "Free",
      description: "Perfect for getting started",
      features: ["Feature 1", "Feature 2", "Feature 3"],
      monthlyPrice: "Free",
      quarterlyPrice: "Free",
      monthlyUsdPrice: "",
      quarterlyUsdPrice: "",
      buttonText: "Get Started",
      type: "free",
    },
    {
      name: "Basic",
      description: "Great for small businesses",
      features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
      monthlyPrice: "105.000 COP",
      quarterlyPrice: "84.000 COP",
      monthlyUsdPrice: "$25 +Tax Included",
      quarterlyUsdPrice: "$20 +Tax Included",
      buttonText: "Choose Basic",
      type: "basic",
    },
    {
      name: "Pro",
      description: "For growing businesses",
      features: [
        "Feature 1",
        "Feature 2",
        "Feature 3",
        "Feature 4",
        "Feature 5",
      ],
      monthlyPrice: "120.000 COP",
      quarterlyPrice: "96.600 COP",
      monthlyUsdPrice: "$28 +Tax Included",
      quarterlyUsdPrice: "$23 +Tax Included",
      buttonText: "Choose Pro",
      type: "pro",
      highlighted: true,
    },
    {
      name: "Pro Plus",
      description: "Enterprise level solution",
      features: [
        "Feature 1",
        "Feature 2",
        "Feature 3",
        "Feature 4",
        "Feature 5",
        "Feature 6",
      ],
      monthlyPrice: "246.000 COP",
      quarterlyPrice: "193.000 COP",
      monthlyUsdPrice: "$58 +Tax Included",
      quarterlyUsdPrice: "$46 +Tax Included",
      buttonText: "Choose Pro Plus",
      type: "proplus",
    },
  ],
  es: [
    {
      name: "Gratis",
      description: "Perfecto para empezar",
      features: ["Función 1", "Función 2", "Función 3"],
      monthlyPrice: "Gratis",
      quarterlyPrice: "Gratis",
      monthlyUsdPrice: "",
      quarterlyUsdPrice: "",
      buttonText: "Empezar",
      type: "free",
    },
    {
      name: "Básico",
      description: "Ideal para pequeños negocios",
      features: ["Función 1", "Función 2", "Función 3", "Función 4"],
      monthlyPrice: "105.000 COP",
      quarterlyPrice: "84.000 COP",
      monthlyUsdPrice: "$25 +Impuestos Incluidos",
      quarterlyUsdPrice: "$20 +Impuestos Incluidos",
      buttonText: "Elegir Básico",
      type: "basic",
    },
    {
      name: "Pro",
      description: "Para negocios en crecimiento",
      features: [
        "Función 1",
        "Función 2",
        "Función 3",
        "Función 4",
        "Función 5",
      ],
      monthlyPrice: "120.000 COP",
      quarterlyPrice: "96.600 COP",
      monthlyUsdPrice: "$28 +Impuestos Incluidos",
      quarterlyUsdPrice: "$23 +Impuestos Incluidos",
      buttonText: "Elegir Pro",
      type: "pro",
      highlighted: true,
    },
    {
      name: "Pro Plus",
      description: "Solución de nivel empresarial",
      features: [
        "Función 1",
        "Función 2",
        "Función 3",
        "Función 4",
        "Función 5",
        "Función 6",
      ],
      monthlyPrice: "246.000 COP",
      quarterlyPrice: "193.000 COP",
      monthlyUsdPrice: "$58 +Impuestos Incluidos",
      quarterlyUsdPrice: "$46 +Impuestos Incluidos",
      buttonText: "Elegir Pro Plus",
      type: "proplus",
    },
  ],
  pt: [
    {
      name: "Grátis",
      description: "Perfeito para começar",
      features: ["Recurso 1", "Recurso 2", "Recurso 3"],
      monthlyPrice: "Grátis",
      quarterlyPrice: "Grátis",
      monthlyUsdPrice: "",
      quarterlyUsdPrice: "",
      buttonText: "Começar",
      type: "free",
    },
    {
      name: "Básico",
      description: "Ótimo para pequenos negócios",
      features: ["Recurso 1", "Recurso 2", "Recurso 3", "Recurso 4"],
      monthlyPrice: "105.000 COP",
      quarterlyPrice: "84.000 COP",
      monthlyUsdPrice: "$25 +Impostos Incluídos",
      quarterlyUsdPrice: "$20 +Impostos Incluídos",
      buttonText: "Escolher Básico",
      type: "basic",
    },
    {
      name: "Pro",
      description: "Para negócios em crescimento",
      features: [
        "Recurso 1",
        "Recurso 2",
        "Recurso 3",
        "Recurso 4",
        "Recurso 5",
      ],
      monthlyPrice: "120.000 COP",
      quarterlyPrice: "96.600 COP",
      monthlyUsdPrice: "$28 +Impostos Incluídos",
      quarterlyUsdPrice: "$23 +Impostos Incluídos",
      buttonText: "Escolher Pro",
      type: "pro",
      highlighted: true,
    },
    {
      name: "Pro Plus",
      description: "Solução de nível empresarial",
      features: [
        "Recurso 1",
        "Recurso 2",
        "Recurso 3",
        "Recurso 4",
        "Recurso 5",
        "Recurso 6",
      ],
      monthlyPrice: "246.000 COP",
      quarterlyPrice: "193.000 COP",
      monthlyUsdPrice: "$58 +Impostos Incluídos",
      quarterlyUsdPrice: "$46 +Impostos Incluídos",
      buttonText: "Escolher Pro Plus",
      type: "proplus",
    },
  ],
};

export async function getPricingPlansForLanguage(
  locale: string
): Promise<PricingPlan[]> {
  try {
    const res = await fetch(`/api/pricing-plans/${locale}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch plans");
    const data = (await res.json()) as PricingPlan[];
    return data;
  } catch (e) {
    console.error("Failed to fetch plans:", e);
    // Fallback to in-memory defaults on error
    return defaultPlans[locale] || defaultPlans.en;
  }
}

export async function savePricingPlansForLanguage(
  locale: string,
  plans: PricingPlan[]
): Promise<void> {
  const res = await fetch(`/api/pricing-plans/${locale}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(plans),
  });
  if (!res.ok) {
    throw new Error("Failed to save pricing plans");
  }
}
