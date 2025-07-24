"use client";
//Components
import DiscoverWhatSetsUsApart from "@/components/pages/about/DiscoverWhatSetsUsApart";
import Hero from "@/components/pages/about/Hero";
import FloatingBox from "@/components/shared/FloatingBox";
import { useTranslations } from "next-intl";
import React from "react";

const AboutUs = () => {
  const t = useTranslations("floatingBox");
  return (
    <>
      <Hero />
      <DiscoverWhatSetsUsApart />
      <FloatingBox
        message={t("about_floating_message")}
        tagline={t("about_floating_tagline")}
      />
    </>
  );
};

export default AboutUs;
