"use client";

import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useClickOutsideDetector from "@/hooks/useClickOutsideDetector";
import { useTranslations } from "next-intl";

export default function GiftProSubscription() {
  const t = useTranslations("pricing.gift");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const plans = [t("dropdown.monthly"), t("dropdown.quarterly")];
  const dropdownRef = useRef<HTMLDivElement>(null);
  const params = new URLSearchParams({
    name: "Pro",
    price: "10000",
    description: "Pro subscription",
  });
  const paymentLinks = {
    0: `/api/payments/checkout?${params.toString()}`,
    1: `/api/payments/checkout?${params.toString()}`,
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleGiftNow = () => {
    setIsLoading(true);

    if (!email) {
      toast.error(t("errors.emailRequired"), {
        position: "top-center",
        duration: 3000,
      });
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      toast.error(t("errors.invalidEmail"), {
        position: "top-center",
        duration: 3000,
      });
      setIsLoading(false);
      return;
    }

    toast.success(t("toastSuccess"), {
      position: "top-center",
      duration: 2000,
    });
    const paymentLink = paymentLinks[plan as keyof typeof paymentLinks];

    if (paymentLink) {
      localStorage.setItem("giftSubscriptionEmail", email);
      const link = `${paymentLink}&giftRecipient=${encodeURIComponent(email)}`;
      setTimeout(() => {
        window.location.href = link;
      }, 2000);
    } else {
      toast.error("Invalid payment link configuration", {
        position: "top-center",
        duration: 3000,
      });
      setIsLoading(false);
    }
  };

  useClickOutsideDetector(dropdownRef, () => {
    setIsDropdownOpen(false);
  });

  return (
    <div className="md:h-[379px] font-sf mb-10 bg-[url('/images/gift-subscription-bg.png')] mx-auto bg-cover rounded-[50px] relative overflow-hidden max-w-[1056px] w-11/12">
      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-12 max-w-[682px] w-full mx-auto">
        <div className="text-center w-full">
          <h1 className="sm:text-[32px] text-[28px] leading-[1.2] font-bold text-white mb-4">
            {t("title")}
          </h1>
          <p className="sm:text-xl text-lg text-white/90 mb-5 font-light">
            {/* You can gift a <span className="font-medium">monthly</span> or{" "}
            <span className="font-medium">quarterly</span> Pro plan to a friend. */}
            {t.rich("subtitle", {
              monthly: (chunks) => (
                <span className="font-medium">{chunks}</span>
              ),
              quarterly: (chunks) => (
                <span className="font-medium">{chunks}</span>
              ),
            })}
          </p>
          <p className="text-white/80 mb-7 font-light">{t("description")}</p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8 w-full">
            <Input
              type="email"
              placeholder={t("placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 h-12 text-lg tracking-wider font-sf rounded-full border-0 bg-white text-gray-700 placeholder:text-[#999999]"
            />

            {/* Plan Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center justify-center cursor-pointer py-4 text-lg rounded-full border border-white bg-transparent text-white h-12 hover:bg-white/10 min-w-[140px] shadow-lg w-full"
              >
                <span className="font-normal">
                  {plan === 0 ? t("dropdown.monthly") : t("dropdown.quarterly")}
                </span>
                <ChevronDown
                  className={`ml-2 h-5 w-5 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute mt-2 w-[140px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  {plans.map((planOption, ind) => (
                    <button
                      key={planOption}
                      type="button"
                      onClick={() => {
                        setPlan(ind);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-6 py-3 text-gray-700 font-medium font-sf sm:text-lg hover:bg-gray-50 focus:bg-gray-50 cursor-pointer"
                    >
                      {planOption}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={handleGiftNow}
            disabled={isLoading}
            className="px-10 h-12 sm:text-lg text-base font-bold text-primary-blue bg-white rounded-full hover:bg-gray-50 shadow-lg transition-all duration-200 cursor-pointer"
          >
            {isLoading ? t("processing") : t("button")}
          </Button>
        </div>
      </div>
    </div>
  );
}
