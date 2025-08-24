import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LockedFeatureBadge } from "./locked-feature-badge";
import { UpgradePrompt } from "./upgrade-prompt";

type PlanType = "FREE" | "BASIC" | "PRO" | "PRO_PLUS";

interface FeatureWrapperProps {
  children: ReactNode;
  requiredPlan: PlanType;
  currentPlan: PlanType;
  featureName: string;
  className?: string;
  showLockedState?: boolean;
  onUpgrade?: (plan: PlanType) => void;
}

const planHierarchy: Record<PlanType, number> = {
  FREE: 0,
  BASIC: 1,
  PRO: 2,
  PRO_PLUS: 3,
};

export function FeatureWrapper({
  children,
  requiredPlan,
  currentPlan,
  featureName,
  className,
  showLockedState = true,
  onUpgrade,
}: FeatureWrapperProps) {
  const hasAccess = planHierarchy[currentPlan] >= planHierarchy[requiredPlan];

  if (hasAccess) {
    return <>{children}</>;
  }

  if (!showLockedState) {
    return null;
  }

  return (
    <div className={cn("relative group", className)}>
      {/* Overlay that shows the locked state */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg z-10 flex flex-col items-center justify-center gap-3 p-4 text-center opacity-0 group-hover:opacity-100 transition-opacity">
        <LockedFeatureBadge requiredPlan={requiredPlan} />
        <p className="text-sm text-gray-600">
          Upgrade to {requiredPlan} to access this feature
        </p>
        <UpgradePrompt
          requiredPlan={requiredPlan}
          currentPlan={currentPlan}
          featureName={featureName}
          onUpgrade={onUpgrade}
        >
          <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
            Upgrade Now
          </button>
        </UpgradePrompt>
      </div>

      {/* The actual content with reduced opacity when locked */}
      <div className="opacity-50 group-hover:opacity-30 transition-opacity">
        {children}
      </div>
    </div>
  );
}

// Helper component for feature cards/tiles
export function FeatureCard({
  title,
  description,
  icon: Icon,
  requiredPlan,
  currentPlan,
  className,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredPlan: PlanType;
  currentPlan: PlanType;
  isLocked?: boolean;
  className?: string;
}) {
  const hasAccess = planHierarchy[currentPlan] >= planHierarchy[requiredPlan];

  return (
    <div
      className={cn(
        "border rounded-lg p-6 transition-all",
        hasAccess ? "bg-white hover:shadow-md" : "bg-gray-50",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="bg-blue-100 p-3 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        {!hasAccess && (
          <LockedFeatureBadge requiredPlan={requiredPlan} size="sm" />
        )}
      </div>
      <h3 className="mt-4 text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </div>
  );
}
