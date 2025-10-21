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
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { useTranslations } from "next-intl";
//TS Interface
interface DesktopCardsProps {
  plans: PricingPlan[];
  isQuarterly: boolean;
}

export default function DesktopCards({
  plans,
  isQuarterly,
}: DesktopCardsProps) {
  const locale = useLocale();
  const router = useRouter();
  const { data: session } = useSession();
  const t = useTranslations("pricing");
  return (
    <div className="grid max-xl:hidden grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
      {plans.map((plan, index) => (
        <Card
          key={plan.name}
          className={`relative ${
            locale === "en" ? "min-h-[750px]" : "min-h-[880px]"
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
              {plan.name === "Free" ||
              plan.name == "Free Plan" ||
              plan.name == "Free Package" ? (
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
                  <h3
                    className={`sm:text-[31px] text-2xl font-bold leading-[1.2] text-left ${
                      plan.highlighted ? "text-white" : "text-black"
                    }`}
                  >
                    {isQuarterly ? plan.quarterlyPrice : plan.monthlyPrice}
                    <span className="text-lg font-normal">/{t("month")}</span>
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

          <CardContent className="pt-0 flex flex-col justify-between h-[90%]">
            <CardDescription
              className={`text-left h-[700px] text-lg mb-4 ${
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
                onClick={() => {
                  if (!session) {
                    router.push("/sign-up");
                    return;
                  }
                  router.push("/");
                }}
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
                onClick={() => {
                  if (!session) {
                    router.push(
                      `/sign-up?name=${plan.type}&price=${
                        isQuarterly ? plan.quarterlyPrice : plan.monthlyPrice
                      }&description=${
                        plan.name
                      } subscription&email=${"unkown@gmail.com"}`
                    );
                    return;
                  }

                  const params = new URLSearchParams({
                    name: plan.type,
                    price: isQuarterly
                      ? plan.quarterlyPrice
                      : plan.monthlyPrice,
                    description: `${plan.name} subscription`,
                    email: session.user.email,
                  });

                  window.location.href = `/api/payments/checkout?${params.toString()}`;
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
