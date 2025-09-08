"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PricingMarket = {
  id?: string;
  isActive: boolean;
  countdownTimer: string;
  oldPrice: string;
};

export default function PricingTimerPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [pricingMarket, setPricingMarket] = useState<PricingMarket | null>(
    null
  );
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const { register, handleSubmit, reset, setValue, watch } =
    useForm<PricingMarket>({
      defaultValues: {
        isActive: false,
        countdownTimer: new Date().toISOString().slice(0, 16),
        oldPrice: "",
      },
    });

  const isActive = watch("isActive");

  useEffect(() => {
    fetchPricingMarket();
  }, []);

  useEffect(() => {
    if (pricingMarket?.isActive && pricingMarket.countdownTimer) {
      const timer = setInterval(
        () => updateCountdown(pricingMarket.countdownTimer),
        1000
      );
      return () => clearInterval(timer);
    }
  }, [pricingMarket]);

  const fetchPricingMarket = async () => {
    try {
      const response = await fetch("/api/admin/pricing-market");
      const data = await response.json();
      if (data.id) {
        setPricingMarket({
          ...data,
          countdownTimer: new Date(data.countdownTimer)
            .toISOString()
            .slice(0, 16),
        });
        reset({
          ...data,
          countdownTimer: new Date(data.countdownTimer)
            .toISOString()
            .slice(0, 16),
        });
      }
    } catch (error) {
      console.error("Error fetching pricing market:", error);
      toast.error(t("loadError"));
    } finally {
      setIsLoading(false);
    }
  };

  const updateCountdown = (endTime: string) => {
    const endDate = new Date(endTime).getTime();
    const now = new Date().getTime();
    const difference = endDate - now;

    if (difference <= 0) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    setTimeLeft({ days, hours, minutes, seconds });
  };

  const onSubmit = async (data: PricingMarket) => {
    try {
      setIsLoading(true);
      const method = pricingMarket?.id ? "PUT" : "POST";
      const url = pricingMarket?.id
        ? `/api/admin/pricing-market`
        : "/api/admin/pricing-market";

      const body = {
        ...(pricingMarket?.id && { id: pricingMarket.id }),
        ...data,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Failed to save");

      const result = await response.json();
      setPricingMarket({
        ...result,
        countdownTimer: new Date(result.countdownTimer)
          .toISOString()
          .slice(0, 16),
      });

      toast.success(t("saveSuccess"));
      fetchPricingMarket();
    } catch (error) {
      console.error("Error saving pricing market:", error);
      toast.error(t("saveError"));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleActive = (checked: boolean) => {
    setValue("isActive", checked);
  };

  const t = useTranslations("dashboardnavigation");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container sm:px-12 px-4 mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">{t("pricingTimerTitle")}</h1>

      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{t("pricingTimer")}</CardTitle>
            <CardDescription>{t("pricingTimerDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="oldPrice">{t("oldPrice")}</Label>
                <Input
                  id="oldPrice"
                  placeholder={t("oldPricePlaceholder")}
                  {...register("oldPrice", {
                    required: t("oldPrice") + " " + t("isRequired"),
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="countdownTimer">{t("countdownEndTime")}</Label>
                <Input
                  id="countdownTimer"
                  type="datetime-local"
                  {...register("countdownTimer", {
                    required: t("countdownEndTime") + " " + t("isRequired"),
                  })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Label htmlFor="isActive">
                  {isActive ? t("active") : t("inactive")}
                </Label>
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={toggleActive}
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? t("saving") : t("saveSettings")}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("preview")}</CardTitle>
            <CardDescription>{t("previewDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">{t("specialOfferEndsIn")}</h3>
                {isActive ? (
                  <div className="flex space-x-4 mt-2">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{timeLeft.days}</div>
                      <div className="text-sm text-muted-foreground">
                        {t("days")}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{timeLeft.hours}</div>
                      <div className="text-sm text-muted-foreground">
                        {t("hours")}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {timeLeft.minutes}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t("minutes")}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {timeLeft.seconds}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t("seconds")}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground mt-2">
                    {t("timerInactive")}
                  </p>
                )}
                {watch("oldPrice") && (
                  <div className="mt-4">
                    <p className="text-muted-foreground line-through">
                      {watch("oldPrice")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
