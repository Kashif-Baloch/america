import { useTranslations } from "next-intl";
import { Button } from "./button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./dialog";
import { FeatureComparisonTable } from "./feature-comparison-table";

export type PlanType = 'FREE' | 'BASIC' | 'PRO' | 'PRO_PLUS';

interface UpgradePromptProps {
  requiredPlan: PlanType;
  currentPlan: PlanType;
  featureName: string;
  children: React.ReactNode;
  showComparison?: boolean;
  onUpgrade?: (plan: PlanType) => void;
}

const defaultFeatures = [
  {
    name: "Job Search",
    key: "jobSearch",
    plans: {
      FREE: true,
      BASIC: true,
      PRO: true,
      PRO_PLUS: true,
    },
  },
  {
    name: "Company Contact Information",
    key: "companyContact",
    plans: {
      FREE: false,
      BASIC: true,
      PRO: true,
      PRO_PLUS: true,
    },
  },
  {
    name: "Save Jobs",
    key: "saveJobs",
    plans: {
      FREE: "5 jobs",
      BASIC: "20 jobs",
      PRO: "Unlimited",
      PRO_PLUS: "Unlimited",
    },
  },
  {
    name: "Priority Support",
    key: "prioritySupport",
    plans: {
      FREE: false,
      BASIC: false,
      PRO: true,
      PRO_PLUS: true,
    },
  },
  {
    name: "Direct Employer Contact",
    key: "directContact",
    plans: {
      FREE: false,
      BASIC: false,
      PRO: false,
      PRO_PLUS: true,
    },
  },
];

export function UpgradePrompt({ 
  requiredPlan, 
  currentPlan,
  featureName, 
  children,
  showComparison = true,
  onUpgrade
}: UpgradePromptProps) {
  const t = useTranslations("subscription");
  const tPricing = useTranslations("pricing");
  
  const handleUpgrade = (plan: PlanType) => {
    if (onUpgrade) {
      onUpgrade(plan);
    } else {
      window.location.href = `/pricing?plan=${plan.toLowerCase()}`;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            {t("upgradeRequired")}
          </DialogTitle>
          <DialogDescription className="text-center">
            {t("featureRequiresPlan", { 
              feature: featureName,
              plan: tPricing(`plans.${requiredPlan.toLowerCase()}.name`)
            })}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {showComparison && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">
                {tPricing("comparePlans")}
              </h3>
              <FeatureComparisonTable 
                features={defaultFeatures} 
                currentPlan={currentPlan}
                onUpgrade={handleUpgrade}
              />
            </div>
          )}
          
          <div className="flex flex-col items-center gap-4 mt-6">
            <p className="text-sm text-muted-foreground">
              {t("upgradeToAccess")}
            </p>
            <div className="flex gap-3">
              <Button 
                onClick={() => handleUpgrade(requiredPlan)}
                size="lg"
              >
                {t("upgradeNow")} - {tPricing(`plans.${requiredPlan.toLowerCase()}.name`)}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleUpgrade('PRO_PLUS')}
              >
                {tPricing("seeAllPlans")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
