"use client";
//Components
import Hero from "@/components/pages/faq/Hero";
import React from "react";
import FAQ from "@/components/pages/faq/FAQ";
import FloatingBox from "@/components/shared/FloatingBox";
import { useTranslations } from "next-intl";
const FAQS = () => {
  const t = useTranslations("floatingBox");
  return (
    <>
      <Hero />
      <FAQ />
      <FloatingBox
        message={t("faq_floating_message")}
        tagline={t("faq_floating_tagline")}
      />
    </>
  );
};

export default FAQS;
