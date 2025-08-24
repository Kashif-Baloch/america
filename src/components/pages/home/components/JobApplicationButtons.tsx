import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import type { Plan } from "@/lib/types";

export function JobApplicationButtons({
  t,
  plan,
}: {
  t: ReturnType<typeof useTranslations>;
  plan: Plan;
}) {
  const canUseWebsite =
    plan === "BASIC" || plan === "PRO" || plan === "PRO_PLUS";

  const canUseEmail = plan === "PRO" || plan === "PRO_PLUS";

  return (
    <div className="flex gap-4 w-full justify-between flex-wrap">
      <div className="flex items-center sm:flex-row flex-col-reverse max-sm:w-full gap-2">
        <Button
          disabled={!canUseWebsite}
          className={`bg-primary-blue max-sm:w-full px-5 md:h-14 h-12 rounded-xl xl:text-lg sm:font-bold font-normal tracking-wider text-white ${
            !canUseWebsite ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {t("job.apply.website")}
        </Button>
        <Badge
          variant="secondary"
          className={`lg:text-[17px] sm:block hidden text-sm px-3 rounded bg-ghost-green text-secondary-green`}
        >
          {t("job.detail.basic")}
        </Badge>
      </div>
      <div className="flex items-center sm:flex-row flex-col-reverse max-sm:w-full gap-2">
        <Button
          disabled={!canUseEmail}
          className={`md:h-14 max-sm:w-full h-12 px-5 rounded-xl xl:text-lg sm:font-bold font-normal tracking-wider text-white bg-gradient-to-r duration-300 from-[#CB9442] to-[#FEDC6E] ${
            !canUseEmail
              ? "opacity-60 cursor-not-allowed"
              : "hover:from-black hover:to-black cursor-pointer"
          }`}
        >
          {t("job.apply.email")}
        </Button>
        <Badge
          variant="secondary"
          className={`lg:text-[17px] sm:block hidden text-sm px-3 rounded bg-ghost-golden text-golden`}
        >
          {t("job.detail.pro")}
        </Badge>
      </div>
    </div>
  );
}
