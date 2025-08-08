"use client";
import ChartAndDetails from "@/components/pages/home/ChartAndDetails";
import Details from "@/components/pages/home/Details";
import Hero from "@/components/pages/home/Hero";
import Presence from "@/components/pages/home/Presence";
import SocialLinks from "@/components/pages/home/SocialLinks";
import Testimonials from "@/components/pages/home/Testimonials";
import FloatingBox from "@/components/shared/FloatingBox";
import GiftProSubscription from "@/components/shared/GiftProSubscription";

export default function Home() {
  return (
    <>
      <Hero />
      <Details />
      <ChartAndDetails />
      <Testimonials />
      <Presence />
      <GiftProSubscription />
      <SocialLinks />
      <FloatingBox
      />
    </>
  );
}
