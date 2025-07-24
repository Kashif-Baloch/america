import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "next-intl";

interface SubscriptionSectionProps {
  planName: string;
  durationMonths: number;
  daysLeft: number | null;
}

export function SubscriptionSection({
  planName,
  durationMonths,
  daysLeft,
}: SubscriptionSectionProps) {
  const t = useTranslations("SubscriptionSection");
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancellationReasons, setCancellationReasons] = useState<string[]>([]);
  const [otherReason, setOtherReason] = useState("");

  const showWarning = daysLeft !== null && daysLeft < 7;

  const cancellationOptions = [
    t("cancellationOptions.noTime"),
    t("cancellationOptions.tooExpensive"),
    t("cancellationOptions.foundAlternative"),
    t("cancellationOptions.noMatchingJobs"),
    t("cancellationOptions.confusing"),
    t("cancellationOptions.tooManyEmails"),
    t("cancellationOptions.accessIssues"),
    t("cancellationOptions.otherChannel"),
  ];

  const handleCheckboxChange = (option: string, checked: boolean) => {
    if (checked) {
      setCancellationReasons([...cancellationReasons, option]);
    } else {
      setCancellationReasons(
        cancellationReasons.filter((item) => item !== option)
      );
    }
  };

  const handleSubmitCancellation = () => {
    const allReasons = otherReason
      ? [...cancellationReasons, `${t("other")}: ${otherReason}`]
      : cancellationReasons;
    console.log("Cancellation reasons:", allReasons);
    setShowCancelForm(false);
    setCancellationReasons([]);
    setOtherReason("");
  };

  return (
    <Card className="mb-6 shadow-none ">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="sm:text-3xl text-2xl">
              {t("currentPlan")} <strong className="pr-2">{planName}</strong>(
              {durationMonths}{" "}
              {durationMonths > 0 ? t("month.other") : t("month.one")})
            </p>
            {daysLeft !== null && (
              <p className="text-xl text-muted-foreground mt-1">
                {t("daysLeft")}:{" "}
                <span
                  className={showWarning ? "text-orange-600 font-semibold" : ""}
                >
                  {daysLeft}
                </span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {showWarning && (
              <div className="flex items-center gap-1 text-orange-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">{t("expiringSoon")}</span>
              </div>
            )}
            <Badge
              className="text-base"
              variant={planName === "Free" ? "secondary" : "default"}
            >
              {planName}
            </Badge>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            variant="outline"
            onClick={() => setShowCancelForm(!showCancelForm)}
            className="bg-red-500 text-white h-12 w-44 text-base"
          >
            {t("cancelButton")}
          </Button>
        </div>

        {showCancelForm && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50/50">
            <h3 className="text-xl font-semibold mb-3">{t("cancelTitle")}</h3>
            <p className="text-base text-gray-600 mb-4">
              {t("cancelDescription")}
            </p>

            <div className="space-y-3 mb-4">
              {cancellationOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={option}
                    className="size-5 data-[state=checked]:bg-primary-blue"
                    checked={cancellationReasons.includes(option)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(option, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={option}
                    className="text-base cursor-pointer font-normal"
                  >
                    {option}
                  </Label>
                </div>
              ))}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="other"
                  className="size-5 data-[state=checked]:bg-primary-blue"
                  checked={cancellationReasons.includes(t("other"))}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(t("other"), checked as boolean)
                  }
                />
                <Label
                  htmlFor="other"
                  className="text-base cursor-pointer font-normal"
                >
                  {t("other")}:
                </Label>
              </div>
              {cancellationReasons.includes(t("other")) && (
                <Textarea
                  placeholder={t("otherPlaceholder")}
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  className="mt-2 text-base placeholder:text-base"
                />
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                className="text-base h-12 w-36"
                onClick={() => setShowCancelForm(false)}
              >
                {t("backButton")}
              </Button>
              <Button
                onClick={handleSubmitCancellation}
                className="bg-red-600 text-base h-12 w-44 hover:bg-red-700"
              >
                {t("confirmButton")}
              </Button>
            </div>
          </div>
        )}

        {showWarning && (
          <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-md">
            <p className="text-sm text-orange-800">
              {t("warningMessage", { count: daysLeft })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
