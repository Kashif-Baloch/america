"use client";
import { useEffect, useState } from "react";
import ChartAndDetails from "@/components/pages/home/ChartAndDetails";
import Details from "@/components/pages/home/Details";
import Hero from "@/components/pages/home/Hero";
import Presence from "@/components/pages/home/Presence";
import SocialLinks from "@/components/pages/home/SocialLinks";
import Testimonials from "@/components/pages/home/Testimonials";
import FloatingBox from "@/components/shared/FloatingBox";
import GiftProSubscription from "@/components/shared/GiftProSubscription";
import { useSubscriptionPlan } from "@/lib/subscription-queries";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const { data: sub } = useSubscriptionPlan();

  useEffect(() => {
    if (!sub) {
      setIsLoading(false);
    } else {
      if (sub.plan !== "NONE" && sub.plan !== "FREE") {
        window.location.href = "/jobs";
      }
    }
  }, [sub]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={24} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Hero />
      <Details />
      <ChartAndDetails />
      <Testimonials />
      <Presence />
      <GiftProSubscription />
      <SocialLinks />
      <FloatingBox />
    </>
  );
}
