import { Lock } from "lucide-react";
import { Button } from "./button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { useTranslations } from "next-intl";

interface FeatureLockProps {
  requiredPlan: 'BASIC' | 'PRO' | 'PRO_PLUS';
  currentPlan: string;
  featureName: string;
  children: React.ReactNode;
}

export function FeatureLock({ requiredPlan, currentPlan, featureName, children }: FeatureLockProps) {
  const t = useTranslations("subscription");
  const isLocked = currentPlan === 'NONE' || 
                  (requiredPlan === 'PRO' && currentPlan === 'BASIC') ||
                  (requiredPlan === 'PRO_PLUS' && currentPlan !== 'PRO_PLUS');

  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
              aria-label={t("unlockFeature", { feature: featureName })}
            >
              <Lock className="h-5 w-5 text-gray-500" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center">
                {t("upgradeRequired")}
              </DialogTitle>
            </DialogHeader>
            <div className="text-center py-4">
              <p className="mb-4">
                {t("featureRequiresPlan", { 
                  feature: featureName,
                  plan: requiredPlan 
                })}
              </p>
              <Button onClick={() => window.location.href = '/pricing'}>
                {t("upgradeNow")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
