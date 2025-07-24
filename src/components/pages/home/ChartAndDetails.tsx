//Components
"use client";
import { Check } from "lucide-react";
import React from "react";
import Chart from "./components/Chart";
import { useTranslations } from "next-intl";

const ChartAndDetails = () => {
  return (
    <div className="relative flex gap-10 lg:flex-row flex-col w-full mt-16 md:pb-10 helmet">
      <Chart />
      <BenefitsList />
    </div>
  );
};

// Benefit Item Component
function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <Check className="w-5 h-5 text-primary-blue mt-0.5 flex-shrink-0" />
      <span className="">{text}</span>
    </div>
  );
}

// Benefits List Component
function BenefitsList() {
  const t = useTranslations("home");
  const benefits = t.raw("benefits") as string[];

  return (
    <div className="border border-[#DADADA] p-5 rounded-2xl lg:w-7/12 w-full">
      <h3 className="text-[22px] font-bold text-gray-900 mb-4 border-b border-[#F3F3F3] pb-2">
        {t("mainBenefits")}
      </h3>
      <div className="space-y-3">
        {benefits.map((benefit, index) => (
          <BenefitItem key={index} text={benefit} />
        ))}
      </div>
    </div>
  );
}

export default ChartAndDetails;
