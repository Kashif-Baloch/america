import { Check, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "./button";

export type PlanType = 'FREE' | 'BASIC' | 'PRO' | 'PRO_PLUS';

interface PlanFeature {
  name: string;
  key: string;
  plans: Record<PlanType, boolean | string>;
}

interface FeatureComparisonTableProps {
  features: PlanFeature[];
  currentPlan: PlanType;
  onUpgrade: (plan: PlanType) => void;
}

export function FeatureComparisonTable({ 
  features, 
  currentPlan, 
  onUpgrade 
}: FeatureComparisonTableProps) {
  const t = useTranslations("pricing");
  
  const plans: PlanType[] = ["FREE", "BASIC", "PRO", "PRO_PLUS"];
  const planNames: Record<PlanType, string> = {
    FREE: t("plans.free.name"),
    BASIC: t("plans.basic.name"),
    PRO: t("plans.pro.name"),
    PRO_PLUS: t("plans.proPlus.name")
  };

  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="h-5 w-5 text-green-500" />
      ) : (
        <X className="h-5 w-5 text-gray-300" />
      );
    }
    return <span className="text-sm">{value}</span>;
  };

  const isCurrentPlan = (plan: PlanType) => {
    return plan === currentPlan;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left p-4 border-b">{t("feature")}</th>
            {plans.map((plan) => (
              <th 
                key={plan} 
                className={`p-4 text-center border-b ${isCurrentPlan(plan) ? 'bg-blue-50' : ''}`}
              >
                <div className="font-medium">{planNames[plan]}</div>
                {isCurrentPlan(plan) && (
                  <span className="text-xs text-blue-600">
                    {t("currentPlan")}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((feature) => (
            <tr key={feature.key} className="border-b hover:bg-gray-50">
              <td className="p-4 text-sm font-medium">
                {t(`features.${feature.key}`, { defaultMessage: feature.name })}
              </td>
              {plans.map((plan) => (
                <td 
                  key={`${feature.key}-${plan}`} 
                  className="p-4 text-center"
                >
                  {renderFeatureValue(feature.plans[plan])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="p-4"></td>
            {plans.map((plan) => (
              <td key={`action-${plan}`} className="p-4 text-center">
                {isCurrentPlan(plan) ? (
                  <Button variant="outline" disabled className="w-full">
                    {t("currentPlan")}
                  </Button>
                ) : (
                  <Button 
                    onClick={() => onUpgrade(plan)}
                    className="w-full"
                  >
                    {plan === "FREE" ? t("getStarted") : t("upgrade")}
                  </Button>
                )}
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
