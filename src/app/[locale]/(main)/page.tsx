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
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: sub } = useSubscriptionPlan();

  useEffect(() => {
    setIsLoading(true);
    if (sub) {
      if (sub.plan !== "NONE" && sub.plan !== "FREE") {
        router.push("/jobs");
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [sub, router, setIsLoading]);

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
