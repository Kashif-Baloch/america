"use client";
import ChartAndDetails from "@/components/pages/home/ChartAndDetails";
import Details from "@/components/pages/home/Details";
import Hero from "@/components/pages/home/Hero";
import Presence from "@/components/pages/home/Presence";
import SocialLinks from "@/components/pages/home/SocialLinks";
import Testimonials from "@/components/pages/home/Testimonials";
import FloatingBox from "@/components/shared/FloatingBox";
import GiftProSubscription from "@/components/shared/GiftProSubscription";
import { useSubscriptionPlan } from "@/lib/subscription-queries";
import { redirect } from "next/navigation";

export default function Home() {
  const { data: sub } = useSubscriptionPlan();

  if (sub?.plan !== "NONE" && sub?.plan !== "FREE") {
    redirect(`/jobs`);
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
