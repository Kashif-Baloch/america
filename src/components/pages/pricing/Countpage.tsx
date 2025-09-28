"use client";

import { Suspense, useEffect, useState } from "react";
import CountdownTimer from "./CountdownTimer";
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
  newPrice: string;
  oldPrice: string;
};

export default function CountPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [pricingMarket, setPricingMarket] = useState<PricingMarket | null>();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // const validateEmail = (email: string) => {
  //   const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return re.test(email);
  // };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError("");
  };

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
    <div className="min-h-[120dvh] flex font-sf">
      {/* Left Side - Branding */}
      <PriceLeftSection />
      {/* Right Side - Form */}
      <div className="flex-1 bg-white md:mt-16 flex items-center justify-center p-8 flex-col">
        <div className="w-full sm:max-w-lg">
          <Suspense fallback={<div>Loading...</div>}>
            <CountdownTimer timeLeft={timeLeft} />

            {/* Email Input */}
            <div className="mt-6 w-full max-w-md mx-auto">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email to get started"
                  className="w-full px-4 mt-10 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  required
                />
                {emailError && (
                  <p className="mt-1 text-sm text-red-500">{emailError}</p>
                )}
              </div>
            </div>

            {plans && (
              <>
                {/* Desktop Cards */}
                <DesktopMarketing
                  email={email}
                  oldprice={pricingMarket.oldPrice}
                  plans={plans.slice(3, 4)}
                  newprice={pricingMarket.newPrice}
                />
                {/* Mobile Cards */}
                <MobileMarketing
                  email={email}
                  oldprice={pricingMarket.oldPrice}
                  plans={plans.slice(3, 4)}
                  newprice={pricingMarket.newPrice}
                />
              </>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
