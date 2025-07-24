"use client";
//Component
import Hero from "@/components/pages/visa-process/Hero";
import FloatingBox from "@/components/shared/FloatingBox";
import { useTranslations } from "next-intl";

const VisaProcess = () => {
  const t = useTranslations("floatingBox");
  return (
    <>
      <Hero />
      <FloatingBox
        message={t("visa_floating_message")}
        tagline={t("visa_floating_tagline")}
      />
    </>
  );
};

export default VisaProcess;
