//Components
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
import { useLocale } from "next-intl";

//TS Interface
interface DesktopCardsProps {
  plans: PricingPlan[];
  oldprice: string;
  newprice: string;
  email: string;
}

export default function DesktopMarketing({
  plans,
  oldprice,
  newprice,
  email,
}: DesktopCardsProps) {
  const locale = useLocale();

  return (
    <div className="grid max-xl:hidden grid-cols-1 gap-6 mt-20">
      {plans.map((plan, index) => (
        <Card
          key={plan.name}
          className={`relative ${
            locale === "en" ? "min-h-[650px]" : "min-h-[780px]"
          }  rounded-[39px] ${
            plan.highlighted
              ? "bg-gradient-to-r from-[#CB9442] to-[#FEDC6E] text-white "
              : "bg-white border-gray-200"
          } ${index === 0 ? "border-[#DADADA]" : ""}`}
        >
          <CardHeader className="text-center ">
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
                <div>
                  <h3
                    className={`sm:text-[31px] text-center line-through text-2xl font-bold leading-[1.2] ${
                      plan.highlighted ? "text-white" : "text-black"
                    }`}
                  >
                    {`${oldprice}.000`} COP
                  </h3>
                  <h3 className="text-4xl font-bold text-center my-2">
                    ${newprice}
                    <span className="text-lg font-normal">/month</span>
                  </h3>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-0 flex flex-col justify-between h-[90%]">
            <CardDescription
              className={`text-left text-lg mb-4 ${
                plan.highlighted ? "text-white/90" : "text-light-black"
              }`}
            >
              {plan.description}

              <ul className="space-y-3 mt-4 mb-8 h-[85vh]">
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
                className={`w-11/12 rounded-full absolute bottom-6 left-1/2 -translate-x-1/2 duration-300 flex text-[17px] font-bold cursor-pointer h-16 ${
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
                onClick={(e) => {
                  if (!email) {
                    e.preventDefault();
                    alert('Please enter your email first');
                    return;
                  }
                  window.location.href = `/sign-up?name=${plan.type}&price=${newprice}&description=${plan.name} subscription&email=${encodeURIComponent(email)}`;
                }}
                className={`w-11/12 justify-center items-center rounded-full absolute bottom-6 left-1/2 -translate-x-1/2 duration-300 flex text-[17px] font-bold cursor-pointer h-16 ${
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
      ))}
    </div>
  );
}
