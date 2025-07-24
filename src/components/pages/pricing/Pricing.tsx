// "use client";

// import { useState } from "react";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import DesktopCards from "./components/DesktopCards";
// import MobileCards from "./components/MobileCards";
// import { useTranslations } from "next-intl";
// import usePricingPlans from "@/Data/PricingPlan";

// const paymentLinks = {
//   monthly: {
//     basic: "https://biz.payulatam.com/L0fa642E5545E9B",
//     pro: "https://biz.payulatam.com/L0fa6426B94E895",
//     proPlus: "https://biz.payulatam.com/L0fa64273BA9049",
//   },
//   quarterly: {
//     basic: "https://biz.payulatam.com/L0fa6425B3F4871",
//     pro: "https://biz.payulatam.com/L0fa64257C078EA",
//     proPlus: "https://biz.payulatam.com/L0fa6420A9C0E29",
//   },
// };

// export default function PricingTable() {
//   const t = useTranslations("pricing");
//   const plans = usePricingPlans();

//   const [isQuarterly, setIsQuarterly] = useState(false);

//   const getPaymentLink = (planName: string) => {
//     const links = isQuarterly ? paymentLinks.quarterly : paymentLinks.monthly;

//     switch (planName.toLowerCase()) {
//       case "basic":
//         return links.basic;
//       case "pro":
//         return links.pro;
//       case "proplus":
//         return links.proPlus;
//       default:
//         return "#";
//     }
//   };

//   return (
//     <div className="helmet font-sf md:my-32 pt-10 order-1 md:order-2">
//       {/* Header */}
//       <h1 className="md:text-[40px] sm:text-[32px] max-w-[645px] mx-auto text-center text-[26px] font-bold leading-[1.2] mb-6">
//         {t.rich("toggleHeadline", {
//           bold: (chunks) => (
//             <span className="text-primary-blue px-3">{chunks}</span>
//           ),
//         })}
//       </h1>
//       <div className="flex gap-3 mt-7 justify-center items-center">
//         <Label
//           className={`${
//             !isQuarterly ? "text-primary-blue" : "text-gray-500"
//           } text-lg font-medium`}
//         >
//           {t("monthly")}
//         </Label>
//         <Switch
//           checked={isQuarterly}
//           onCheckedChange={setIsQuarterly}
//           className="data-[state=checked]:bg-primary-blue cursor-pointer"
//         />
//         <Label
//           className={`${
//             isQuarterly ? "text-primary-blue" : "text-gray-500"
//           } text-lg font-medium`}
//         >
//           {t("quarterly")}
//         </Label>
//       </div>

//       {/* Desktop Cards */}
//       <DesktopCards
//         plans={plans}
//         isQuarterly={isQuarterly}
//         getPaymentLink={getPaymentLink}
//       />

//       {/* Mobile Cards */}
//       <MobileCards
//         plans={plans}
//         isQuarterly={isQuarterly}
//         getPaymentLink={getPaymentLink}
//       />
//     </div>
//   );
// }

//new code

"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import DesktopCards from "./components/DesktopCards";
import MobileCards from "./components/MobileCards";
import { useTranslations } from "next-intl";
import { getPricingPlansForLanguage } from "@/lib/pricing-plans";
import { useLocale } from "next-intl";

const paymentLinks = {
  monthly: {
    basic: "https://biz.payulatam.com/L0fa642E5545E9B",
    pro: "https://biz.payulatam.com/L0fa6426B94E895",
    proPlus: "https://biz.payulatam.com/L0fa64273BA9049",
  },
  quarterly: {
    basic: "https://biz.payulatam.com/L0fa6425B3F4871",
    pro: "https://biz.payulatam.com/L0fa64257C078EA",
    proPlus: "https://biz.payulatam.com/L0fa6420A9C0E29",
  },
};

export default function PricingTable() {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const plans = getPricingPlansForLanguage(locale);
  const [isQuarterly, setIsQuarterly] = useState(false);

  const getPaymentLink = (planName: string) => {
    const links = isQuarterly ? paymentLinks.quarterly : paymentLinks.monthly;

    switch (planName.toLowerCase()) {
      case "basic":
      case "básico":
        return links.basic;
      case "pro":
        return links.pro;
      case "proplus":
        return links.proPlus;
      default:
        return "#";
    }
  };

  return (
    <div className="helmet font-sf md:my-32 pt-10 order-1 md:order-2">
      {/* Header */}
      <h1 className="md:text-[40px] sm:text-[32px] max-w-[645px] mx-auto text-center text-[26px] font-bold leading-[1.2] mb-6">
        {t.rich("toggleHeadline", {
          bold: (chunks) => (
            <span className="text-primary-blue px-3">{chunks}</span>
          ),
        })}
      </h1>
      <div className="flex gap-3 mt-7 justify-center items-center">
        <Label
          className={`${
            !isQuarterly ? "text-primary-blue" : "text-gray-500"
          } text-lg font-medium`}
        >
          {t("monthly")}
        </Label>
        <Switch
          checked={isQuarterly}
          onCheckedChange={setIsQuarterly}
          className="data-[state=checked]:bg-primary-blue cursor-pointer"
        />
        <Label
          className={`${
            isQuarterly ? "text-primary-blue" : "text-gray-500"
          } text-lg font-medium`}
        >
          {t("quarterly")}
        </Label>
      </div>

      {/* Desktop Cards */}
      <DesktopCards
        plans={plans}
        isQuarterly={isQuarterly}
        getPaymentLink={getPaymentLink}
      />

      {/* Mobile Cards */}
      <MobileCards
        plans={plans}
        isQuarterly={isQuarterly}
        getPaymentLink={getPaymentLink}
      />
    </div>
  );
}
