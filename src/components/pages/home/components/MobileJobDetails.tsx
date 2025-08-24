import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import DetailRow from "./DetailRow";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocale, useTranslations } from "next-intl";
import type { JobWithTranslations, Plan } from "@/lib/types";
import { getTranslation } from "@/lib/utils";

function MobileJobDetails({
  job,
  t,
  plan,
}: {
  job: JobWithTranslations;
  t: ReturnType<typeof useTranslations>;
  plan: Plan;
}) {
  const locale = useLocale();
  const tr = getTranslation(job.translations, locale, "en");
  if (!tr) return null;
  return (
    <div className="lg:hidden mt-4 ">
      <Accordion type="multiple" className="flex flex-col gap-y-4 w-full">
        <AccordionItem
          value="general"
          className="bg-tab-content shadow-none border-b-0 data-[state=open]:bg-[linear-gradient(259.52deg,_#FFFFFF_-37.44%,_#F1F0FB_60.89%)]  border-l-6 sm:pl-9 pl-4 duration-200 border-l-tab-border data-[state=open]:border-l-[#D2CEFF] pb-2"
        >
          <AccordionTrigger className="group text-left font-semibold pt-9 flex items-center justify-between text-[#170F49] text-xl   [&>svg]:hidden flex-wrap hover:no-underline cursor-pointer data-[state=open]:text-primary-blue">
            <span className="flex items-center gap-2 text-base">
              <ChevronDown className="transition-transform duration-300 text-[#170F49] group-data-[state=open]:rotate-180 group-data-[state=open]:text-primary-blue" />
              {t("job.detail.accordion.general")}
            </span>
            <div className="flex gap-2 flex-wrap">
              <Badge
                variant="secondary"
                className={`lg:text-[17px] text-sm px-3 rounded bg-ghost-green text-secondary-green`}
              >
                {t("job.detail.basic")}
              </Badge>
              <Badge
                variant="secondary"
                className={`lg:text-[17px] text-sm px-3 rounded bg-ghost-golden text-golden`}
              >
                Pro
              </Badge>
            </div>
          </AccordionTrigger>

          <AccordionContent className="text-light-black text-base sm:pl-9 pl-7 w-11/12 font-inter">
            <div className="grid p-2">
              <DetailRow
                label={t("job.detail.company")}
                value={
                  plan === "BASIC" || plan === "PRO" || plan === "PRO_PLUS"
                    ? tr.company
                    : t("job.detail.basic")
                }
                valueType="basic"
              />
              <DetailRow
                label={t("job.detail.city")}
                value={
                  plan === "PRO" || plan === "PRO_PLUS"
                    ? tr.location
                    : t("job.detail.pro")
                }
                valueType="pro"
              />
              <DetailRow
                label={t("job.detail.phone")}
                value={
                  plan === "PRO" || plan === "PRO_PLUS"
                    ? tr.phoneNumber
                    : t("job.detail.pro")
                }
                valueType="pro"
              />
              <DetailRow
                label={t("job.detail.season")}
                value={
                  plan === "PRO" || plan === "PRO_PLUS"
                    ? tr.season
                    : t("job.detail.pro")
                }
                valueType="pro"
              />
              <DetailRow
                label={t("job.detail.overtime")}
                value={
                  plan === "PRO" || plan === "PRO_PLUS"
                    ? tr.overtime
                    : t("job.detail.pro")
                }
                valueType="pro"
              />
              <DetailRow
                label={t("job.detail.transportationHousing")}
                value={
                  plan === "PRO" || plan === "PRO_PLUS"
                    ? tr.transportationHousing
                    : t("job.detail.pro")
                }
                valueType="pro"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="international"
          className="bg-tab-content shadow-none border-b-0 data-[state=open]:bg-[linear-gradient(259.52deg,_#FFFFFF_-37.44%,_#F1F0FB_60.89%)]  border-l-6 sm:pl-9 pl-4 duration-200 border-l-tab-border data-[state=open]:border-l-[#D2CEFF] pb-2"
        >
          <AccordionTrigger className="group  text-left font-semibold pt-4 flex items-center justify-between text-[#170F49] text-xl   [&>svg]:hidden hover:no-underline cursor-pointer data-[state=open]:text-primary-blue">
            <span className="flex items-center gap-2 w-11/12 text-base">
              <ChevronDown className="transition-transform duration-300 text-[#170F49] group-data-[state=open]:rotate-180 group-data-[state=open]:text-primary-blue" />
              {t("job.detail.accordion.international")}
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-light-black text-base sm:pl-9 pl-7 w-11/12 font-inter">
            <div className="grid  p-2">
              <DetailRow
                label={t("job.detail.hiresOutside")}
                value={
                  plan === "PRO" || plan === "PRO_PLUS"
                    ? tr.hiresOutside
                    : t("job.detail.pro")
                }
                valueType="pro"
              />
              <DetailRow
                label={t("job.detail.employeesHired")}
                value={
                  plan === "PRO" || plan === "PRO_PLUS"
                    ? tr.employeesHired
                    : t("job.detail.pro")
                }
                valueType="pro"
              />
              <DetailRow
                label={t("job.detail.visaEmployees")}
                value={
                  plan === "PRO" || plan === "PRO_PLUS"
                    ? tr.visaEmployees
                    : t("job.detail.pro")
                }
                valueType="pro"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="legal"
          className="bg-tab-content shadow-none border-b-0 data-[state=open]:bg-[linear-gradient(259.52deg,_#FFFFFF_-37.44%,_#F1F0FB_60.89%)]  border-l-6 sm:pl-9 pl-4 duration-200 border-l-tab-border data-[state=open]:border-l-[#D2CEFF] pb-2"
        >
          <AccordionTrigger className="group  text-left font-semibold pt-4 flex items-center justify-between text-[#170F49] text-xl   [&>svg]:hidden hover:no-underline cursor-pointer data-[state=open]:text-primary-blue">
            <span className="flex items-center gap-2 w-11/12 text-base">
              <ChevronDown className="transition-transform duration-300 text-[#170F49] group-data-[state=open]:rotate-180 group-data-[state=open]:text-primary-blue" />
              {t("job.detail.accordion.legal")}
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-light-black text-base sm:pl-9 pl-7 w-11/12 font-inter">
            <div className="grid p-2">
              <DetailRow
                label={t("job.detail.legalProcess")}
                value={
                  plan === "PRO" || plan === "PRO_PLUS"
                    ? tr.legalProcess
                    : t("job.detail.pro")
                }
                valueType="pro"
              />
              <DetailRow
                label={t("job.detail.processDuration")}
                value={
                  plan === "PRO" || plan === "PRO_PLUS"
                    ? tr.processDuration
                    : t("job.detail.pro")
                }
                valueType="pro"
              />
              <DetailRow
                label={t("job.detail.processSpeed")}
                value={
                  plan === "PRO" || plan === "PRO_PLUS"
                    ? tr.processSpeed
                    : t("job.detail.pro")
                }
                valueType="pro"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="efficiency"
          className="bg-tab-content shadow-none border-b-0 data-[state=open]:bg-[linear-gradient(259.52deg,_#FFFFFF_-37.44%,_#F1F0FB_60.89%)]  border-l-6 sm:pl-9 pl-4 duration-200 border-l-tab-border data-[state=open]:border-l-[#D2CEFF] pb-2"
        >
          <AccordionTrigger className="group  text-left font-semibold pt-4 flex items-center justify-between text-[#170F49] text-xl   [&>svg]:hidden hover:no-underline cursor-pointer data-[state=open]:text-primary-blue">
            <span className="flex items-center gap-2 w-11/12 text-base">
              <ChevronDown className="transition-transform duration-300 text-[#170F49] group-data-[state=open]:rotate-180 group-data-[state=open]:text-primary-blue" />
              {t("job.detail.accordion.efficiency")}
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-light-black text-base sm:pl-9 pl-7 w-11/12 font-inter">
            <div className="grid p-2">
              <DetailRow
                label={t("job.detail.approvalEfficiency")}
                value={
                  plan === "PRO" || plan === "PRO_PLUS"
                    ? tr.approvalRate
                    : t("job.detail.pro")
                }
                valueType="pro"
              />
              <DetailRow
                label={t("job.detail.approvalEfficiency")}
                value={
                  plan === "PRO" || plan === "PRO_PLUS"
                    ? tr.approvalEfficiency
                    : t("job.detail.pro")
                }
                valueType="pro"
              />
              <DetailRow
                label={t("job.detail.certifications")}
                value={
                  plan === "PRO" || plan === "PRO_PLUS"
                    ? tr.certifications
                    : t("job.detail.pro")
                }
                valueType="pro"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default MobileJobDetails;
