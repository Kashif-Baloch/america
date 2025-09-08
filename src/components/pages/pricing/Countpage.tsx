"use client";

import { Suspense, useEffect, useState } from "react";
import CountdownTimer from "./CountdownTimer";
import { Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { getPricingPlansForLanguage } from "@/lib/pricing-plans";
import { PricingPlan } from "@/Data/PricingPlan";
import DesktopMarketing from "./components/DesktopMarketing";
import PriceLeftSection from "@/components/shared/price-left";
import MobileMarketing from "./components/MobileMarketing";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type PricingMarket = {
  id?: string;
  isActive: boolean;
  countdownTimer: string;
  oldPrice: string;
};

const CountPage = () => {
  const router = useRouter();
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

  const t = useTranslations("dashboardnavigation");

  const locale = useLocale();
  const isQuarterly = false;
  const [plans, setPlans] = useState<PricingPlan[] | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const data = await getPricingPlansForLanguage(locale);
      if (active) setPlans(data);
    })();
    return () => {
      active = false;
    };
  }, [locale]);

  useEffect(() => {
    if (!isLoading && !pricingMarket?.isActive) {
      router.push("/not-found");
    }
  }, [isLoading, pricingMarket, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!pricingMarket?.isActive) {
    return null; // or a loading/redirecting message
  }
  return (
    <div className="min-h-[120dvh]  flex font-sf">
      {/* Left Side - Branding */}
      <PriceLeftSection />
      {/* Right Side - Form */}
      <div className="flex-1 bg-white md:mt-16 flex items-center justify-center p-8 flex-col">
        <div className="w-full sm:max-w-md">
          <Suspense fallback={<>Loading...</>}>
            <CountdownTimer timeLeft={timeLeft} />

            {plans ? (
              <>
                {/* Desktop Cards */}
                <DesktopMarketing
                  oldprice={pricingMarket.oldPrice}
                  plans={plans.slice(2, 3)}
                  isQuarterly={isQuarterly}
                />
                {/* Mobile Cards */}
                <MobileMarketing
                  oldprice={pricingMarket.oldPrice}
                  plans={plans.slice(2, 3)}
                  isQuarterly={isQuarterly}
                />
              </>
            ) : (
              <div className="flex items-center justify-center h-[50vh]">
                <Loader2 size={30} className="animate-spin" />
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default CountPage;
