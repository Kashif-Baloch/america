"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoCheckCircleFill } from "react-icons/go";
import { Button } from "@/components/ui/button";
import { PricingPlan } from "@/Data/PricingPlan";

interface MobileCardsProps {
  plans: PricingPlan[];
  isQuarterly: boolean;
  oldprice: string;
}

export default function MobileMarketing({
  plans,
  isQuarterly,
  oldprice,
}: MobileCardsProps) {
  return (
    <div className="w-full min-xl:hidden relative flex items-center justify-center mt-10 overflow-x-auto scrollbar-hide">
      {plans.map((plan, index) => (
        <div
          key={index}
          className="min-h-full sm:!w-[370px] !w-[340px] flex-shrink-0 mr-5"
        >
          <Card
            className={`relative min-h-[860px] mb-8 w-full rounded-[39px] ${
              plan.highlighted
                ? "bg-gradient-to-r from-[#CB9442] to-[#FEDC6E] text-white "
                : "bg-white border-gray-200"
            } ${index === 0 ? "border-[#DADADA]" : ""}`}
          >
            <CardHeader className="text-center">
              <CardTitle
                className={`text-2xl font-bold ${
                  plan.highlighted ? "text-white" : "text-gray-900"
                }`}
              >
                {plan.name === "Free" ? (
                  <span className="invisible">Free</span>
                ) : (
                  plan?.name
                )}
              </CardTitle>
              <div className="mt-4">
                {plan.name === "Free" ? (
                  <div className="sm:text-[32px] text-2xl font-bold text-left leading-[1.2]">
                    Free
                  </div>
                ) : (
                  <>
                    {/* making it cut like a  cut line on price */}
                    <h3
                      className={`sm:text-[31px] line-through text-2xl font-bold leading-[1.2] text-left ${
                        plan.highlighted ? "text-white" : "text-black"
                      }`}
                    >
                      {`${oldprice}.000`} COP
                    </h3>
                    {/* discount price */}
                    <h3
                      className={`sm:text-[31px] text-2xl font-bold leading-[1.2] text-left ${
                        plan.highlighted ? "text-white" : "text-black"
                      }`}
                    >
                      {isQuarterly ? plan.quarterlyPrice : plan.monthlyPrice}
                      <span className="text-lg font-normal">/month</span>
                    </h3>
                    <div
                      className={`text-sm text-left ${
                        plan.highlighted ? "text-white/90" : "text-[#222222]"
                      } mt-1`}
                    >
                      {isQuarterly
                        ? plan.quarterlyUsdPrice
                        : plan.monthlyUsdPrice}
                    </div>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0 flex flex-col justify-between max-h-full">
              <CardDescription
                className={`text-left text-lg mb-4 ${
                  plan.highlighted ? "text-white/90" : "text-light-black"
                }`}
              >
                {plan.description}
                <ul className="space-y-3 mt-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <GoCheckCircleFill
                        className={`size-6 mt-0.5 flex-shrink-0 ${
                          plan.highlighted ? "text-white" : "text-[#858C95]"
                        }`}
                      />
                      <span
                        className={`text-[17px] ${
                          plan.highlighted ? "text-white" : "text-light-black"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardDescription>
              {plan.name === "Free" ? (
                <Button
                  className={`w-11/12 rounded-full absolute bottom-9 left-1/2 -translate-x-1/2 duration-300 flex text-[17px] font-bold cursor-pointer h-16 ${
                    plan.highlighted
                      ? "bg-white text-black hover:bg-black hover:text-white"
                      : "bg-primary-blue blue-btn-shadow text-white hover:bg-white hover:text-primary-blue border border-primary-blue"
                  }`}
                  size="lg"
                >
                  {plan.buttonText}
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    window.location.href = `/sign-up?name=${plan.type}&price=${
                      isQuarterly ? plan.quarterlyPrice : plan.monthlyPrice
                    }&description=${plan.name} subscription`;
                  }}
                  className={`w-11/12 rounded-full absolute bottom-9 left-1/2 -translate-x-1/2 duration-300 flex text-[17px] font-bold justify-center items-center cursor-pointer h-16 ${
                    plan.highlighted
                      ? "bg-white text-black hover:bg-black hover:text-white"
                      : "bg-primary-blue blue-btn-shadow text-white hover:bg-white hover:text-primary-blue border border-primary-blue"
                  }`}
                >
                  {plan.buttonText}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
