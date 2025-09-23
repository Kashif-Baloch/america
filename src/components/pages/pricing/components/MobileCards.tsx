"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoCheckCircleFill } from "react-icons/go";
import { Button } from "@/components/ui/button";
import { PricingPlan } from "@/Data/PricingPlan";
import { useTranslations } from "next-intl";

interface MobileCardsProps {
  plans: PricingPlan[];
  isQuarterly: boolean;
}

export default function MobileCards({ plans, isQuarterly }: MobileCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("pricing");
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrame: number;
    let startTime: number | null = null;
    let startScroll = 0;
    let maxScroll = container.scrollWidth - container.clientWidth;
    const duration = 2500; // Fast, in ms

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPlayedOnce) {
          startScroll = container.scrollLeft;
          maxScroll = container.scrollWidth - container.clientWidth;
          startTime = null;
          animateScroll();
        }
      },
      { threshold: 0.5 }
    );

    function animateScroll(timestamp?: number) {
      if (!container) return;

      if (!startTime) startTime = timestamp || performance.now();
      const elapsed = (timestamp || performance.now()) - startTime;
      const progress = Math.min(elapsed / duration, 1);
      container.scrollLeft = startScroll + (maxScroll - startScroll) * progress;

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animateScroll);
      } else {
        setHasPlayedOnce(true);
      }
    }

    if (container) {
      observer.observe(container);
    }

    return () => {
      if (container) observer.unobserve(container);
      cancelAnimationFrame(animationFrame);
    };
  }, [hasPlayedOnce]);

  return (
    <div
      ref={containerRef}
      className="w-full min-xl:hidden relative pr-1 mt-10 flex overflow-x-auto scrollbar-hide"
      style={{
        scrollBehavior: "auto",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {plans.map((plan, index) => (
        <div
          key={index}
          className="min-h-full sm:!w-[370px] !w-[340px] flex-shrink-0 mr-5"
        >
          <Card
            className={`relative min-h-[860px] mb-8 w-full rounded-[39px] ${
              plan.highlighted
                ? "bg-gradient-to-r from-[#CB9442] to-[#FEDC6E] text-white "
                : "bg-white border-gray-200"
            } ${index === 0 ? "border-[#DADADA]" : ""}`}
          >
            <CardHeader className="text-center">
              <CardTitle
                className={`text-2xl font-bold ${
                  plan.highlighted ? "text-white" : "text-gray-900"
                }`}
              >
                {plan.name === "Free" ? (
                  <span className="invisible">Free</span>
                ) : (
                  plan?.name
                )}
              </CardTitle>
              <div className="mt-4">
                {plan.name === "Free" ? (
                  <div className="sm:text-[32px] text-2xl font-bold text-left leading-[1.2]">
                    Free
                  </div>
                ) : (
                  <>
                    <h3
                      className={`sm:text-[31px] text-2xl font-bold leading-[1.2] text-left ${
                        plan.highlighted ? "text-white" : "text-black"
                      }`}
                    >
                      {isQuarterly ? plan.quarterlyPrice : plan.monthlyPrice}
                      <span className="text-lg font-normal">/{t("month")}</span>
                    </h3>
                    <div
                      className={`text-sm text-left ${
                        plan.highlighted ? "text-white/90" : "text-[#222222]"
                      } mt-1`}
                    >
                      {isQuarterly
                        ? plan.quarterlyUsdPrice
                        : plan.monthlyUsdPrice}
                    </div>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0 flex flex-col justify-between max-h-full">
              <CardDescription
                className={`text-left text-lg mb-4 ${
                  plan.highlighted ? "text-white/90" : "text-light-black"
                }`}
              >
                {plan.description}
                <ul className="space-y-3 mt-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <GoCheckCircleFill
                        className={`size-6 mt-0.5 flex-shrink-0 ${
                          plan.highlighted ? "text-white" : "text-[#858C95]"
                        }`}
                      />
                      <span
                        className={`text-[17px] ${
                          plan.highlighted ? "text-white" : "text-light-black"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardDescription>
              {plan.name === "Free" ? (
                <Button
                  className={`w-11/12 rounded-full absolute bottom-9 left-1/2 -translate-x-1/2 duration-300 flex text-[17px] font-bold cursor-pointer h-16 ${
                    plan.highlighted
                      ? "bg-white text-black hover:bg-black hover:text-white"
                      : "bg-primary-blue blue-btn-shadow text-white hover:bg-white hover:text-primary-blue border border-primary-blue"
                  }`}
                  size="lg"
                >
                  {plan.buttonText}
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    if (!session) {
                      router.push("/sign-up?callbackUrl=pricing");
                      return;
                    }

                    const params = new URLSearchParams({
                      name: plan.type,
                      price: isQuarterly
                        ? plan.quarterlyPrice
                        : plan.monthlyPrice,
                      description: `${plan.name} subscription`,
                    });

                    window.location.href = `/api/payments/checkout?${params.toString()}`;
                  }}
                  className={`w-11/12 rounded-full absolute bottom-9 left-1/2 -translate-x-1/2 duration-300 flex text-[17px] font-bold justify-center items-center cursor-pointer h-16 ${
                    plan.highlighted
                      ? "bg-white text-black hover:bg-black hover:text-white"
                      : "bg-primary-blue blue-btn-shadow text-white hover:bg-white hover:text-primary-blue border border-primary-blue"
                  }`}
                >
                  {plan.buttonText}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
