import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface LockedFeatureBadgeProps {
  requiredPlan: "FREE" | "BASIC" | "PRO" | "PRO_PLUS";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LockedFeatureBadge({
  requiredPlan,
  className,
  size = "md",
}: LockedFeatureBadgeProps) {
  const t = useTranslations("pricing.plans");

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        "bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border border-amber-200",
        sizeClasses[size],
        className
      )}
    >
      <Lock className="h-3 w-3" />
      <span>{t(`${requiredPlan.toLowerCase()}.name`)}</span>
    </span>
  );
}
