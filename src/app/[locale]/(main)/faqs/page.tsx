"use client";
//Components
import Hero from "@/components/pages/faq/Hero";
import React from "react";
import FAQ from "@/components/pages/faq/FAQ";
import FloatingBox from "@/components/shared/FloatingBox";
const FAQS = () => {
  return (
    <>
      <Hero />
      <FAQ />
      <FloatingBox
      />
    </>
  );
};

export default FAQS;
