"use client";
//Components
import DiscoverWhatSetsUsApart from "@/components/pages/about/DiscoverWhatSetsUsApart";
import Hero from "@/components/pages/about/Hero";
import FloatingBox from "@/components/shared/FloatingBox";
import React from "react";

const AboutUs = () => {
  return (
    <>
      <Hero />
      <DiscoverWhatSetsUsApart />
      <FloatingBox />
    </>
  );
};

export default AboutUs;
