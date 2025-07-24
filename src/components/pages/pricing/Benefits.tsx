import { Check } from "lucide-react";
import React from "react";
import DetailsChart from "./components/DetailsChart";
import { useTranslations } from "next-intl";

const Benefits = () => {
  const t = useTranslations("pricing.benefits");
  return (
    <div className="helmet order-2 md:order-1 font-sf mb-10 ">
      <div className="flex gap-10 lg:flex-row flex-col w-full mt-16">
        {/* Chart */}
        <DetailsChart />
        <div className="border border-[#DADADA] p-5 rounded-2xl lg:w-7/12 w-full">
          <h3 className="text-[22px] font-bold text-gray-900 mb-4 border-b border-[#F3F3F3] pb-2">
            {t("title")}
          </h3>
          <div className="space-y-3">
            {t.raw("items").map((item: string, index: number) => (
              <BenefitItem text={item} key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Benefits;

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <Check className="w-5 h-5 text-secondary-green mt-0.5 flex-shrink-0" />
      <span className="">{text}</span>
    </div>
  );
}
