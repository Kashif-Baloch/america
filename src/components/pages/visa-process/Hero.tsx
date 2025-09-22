"use client";
import { useWorkVisaSteps } from "@/Data/WorkVisaSteps";
import React from "react";
import { ProcessStep } from "./ProcessStep";
import { useTranslations } from "next-intl";
export interface Step {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  isLast?: boolean;
}
const Hero = () => {
  const t = useTranslations("visaProcess");
  const steps = useWorkVisaSteps();

  return (
    <div className="helmet text-center md:pt-20 pt-10 font-sf">
      <h1 className="md:text-[48px] sm:text-4xl text-3xl font-bold max-w-[657px] mx-auto leading-[1.2] mb-7">
        {t("headline")}
        <span className="inline-block text-primary-blue px-1 rounded-sm">
          {t("highlight")}
        </span>
      </h1>

      <div className="mb-12 md:max-w-[478px] sm:max-w-[400px] mx-auto">
        <p className="  w-full mx-auto leading-relaxed">{t("description")}</p>
      </div>
      <div className="relative overflow-hidden mt-20">
        <div className="absolute  w-[1.5px] bg-[linear-gradient(to_bottom,transparent_0%,transparent_50%,#153cf5_50%,#153cf5_100%)] bg-[length:2px_15px] sm:left-8 left-7 -top-2 bottom-0 sm:h-[98%] h-[95%] " />
        {/* <div className="absolute sm:left-8 left-7 -top-2 bottom-0 sm:h-[98%] h-[95%] w-px border-b border-dashed border-b-primary-blue bg-primary-blue " /> */}

        {/*Visa Process Steps */}
        <div className="flex flex-col sm:gap-y-14 gap-y-10">
          {steps.map((step) => (
            <ProcessStep
              key={step.id}
              icon={step.icon}
              title={step.title}
              description={step.description}
              isLast={step.isLast}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
