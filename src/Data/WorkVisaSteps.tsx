"use client";

import {
  VisaProcessIcon1,
  VisaProcessIcon2,
  VisaProcessIcon3,
  VisaProcessIcon4,
  VisaProcessIcon5,
  VisaProcessIcon6,
  VisaProcessIcon7,
  VisaProcessIcon8,
  VisaProcessIcon9,
  VisaProcessIcon10,
} from "@/utils/Icons";
import { useTranslations } from "next-intl";

export const useWorkVisaSteps = () => {
  const t = useTranslations("visaProcess.steps");

  const iconComponents = [
    VisaProcessIcon1,
    VisaProcessIcon2,
    VisaProcessIcon3,
    VisaProcessIcon4,
    VisaProcessIcon5,
    VisaProcessIcon6,
    VisaProcessIcon7,
    VisaProcessIcon8,
    VisaProcessIcon9,
    VisaProcessIcon10,
  ];

  return iconComponents.map((IconComponent, index) => ({
    id: index + 1,
    icon: <IconComponent key={index} />,
    title: t(`${index}.title`),
    description: t(`${index}.description`),
    isLast: index === iconComponents.length - 1,
  }));
};
