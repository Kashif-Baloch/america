import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export function JobApplicationButtons({
  t,
}: {
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="flex gap-4 w-full justify-between flex-wrap">
      <div className="flex items-center sm:flex-row flex-col-reverse max-sm:w-full gap-2">
        <Button className="bg-primary-blue max-sm:w-full px-5 cursor-pointer md:h-14 h-12 rounded-xl xl:text-lg sm:font-bold font-normal tracking-wider text-white ">
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
        <Button className="md:h-14 max-sm:w-full h-12 px-5 rounded-xl cursor-pointer xl:text-lg sm:font-bold font-normal tracking-wider text-white bg-gradient-to-r hover:from-black hover:to-black duration-300 from-[#CB9442] to-[#FEDC6E] ">
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
