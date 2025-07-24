"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, CreditCard, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function QuickActions() {
  const t = useTranslations("QuickActions");

  const handleAction = (actionKey: string) => {
    toast.success(
      t("successMessage", { action: t(`actions.${actionKey}.label`) })
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="md:text-[40px] sm:text-[32px] text-[26px] font-bold leading-[1.2] mb-6">
            {t("title")}
          </h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          className="w-full justify-start bg-transparent text-lg h-14 cursor-pointer"
          variant="outline"
        >
          <Link href={"/"} className="flex gap-2">
            <Search className="size-6 mr-2" />
            {t("actions.browseJobs.label")}
          </Link>
        </Button>
        <Button
          className="w-full justify-start bg-transparent text-lg h-14 cursor-pointer"
          variant="outline"
          onClick={() => handleAction("browseJobs")}
        >
          <CreditCard className="size-6 mr-2" />
          {t("actions.upgradePlan.label")}
        </Button>
        <Button
          className="w-full justify-start bg-transparent text-lg h-14 cursor-pointer"
          variant="outline"
          onClick={() => handleAction("logOut")}
        >
          <LogOut className="size-6 mr-2" />
          {t("actions.logOut.label")}
        </Button>
      </CardContent>
    </Card>
  );
}
