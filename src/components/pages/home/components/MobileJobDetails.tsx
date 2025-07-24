import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import DetailRow from "./DetailRow";
import { JobData } from "../Details";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

function MobileJobDetails({
  job,
  t,
}: {
  job: JobData;
  t: ReturnType<typeof useTranslations>;
}) {
  // console.log(job);
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
                value={job.company}
                valueType="basic"
              />
              <DetailRow
                label={t("job.detail.city")}
                value={job.location}
                valueType="pro"
              />
              <DetailRow
                label={t("job.detail.phone")}
                value={job.phoneNumber}
                valueType="pro"
              />
              <DetailRow
                label={t("job.detail.season")}
                value={job.season}
                valueType="pro"
              />
              <DetailRow
                label={t("job.detail.overtime")}
                value={job.overtime}
                valueType="pro"
              />
              <DetailRow
                label={t("job.detail.transportationHousing")}
                value={job.transportationHousing}
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
                value={job.hiresOutside}
                valueType="pro"
              />
              <DetailRow
                label={t("job.detail.employeesHired")}
                value={job.employeesHired}
                valueType="pro"
              />
              <DetailRow
                label={t("job.detail.visaEmployees")}
                value={job.visaEmployees}
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
                value={job.legalProcess}
                valueType="pro"
              />
              <DetailRow
                label={t("job.detail.processDuration")}
                value={job.processDuration}
                valueType="pro"
              />
              <DetailRow
                label={t("job.detail.processSpeed")}
                value={job.processSpeed}
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
                value={job.approvalRate}
                valueType="pro"
              />
              <DetailRow
                label={t("job.detail.approvalEfficiency")}
                value={job.approvalEfficiency}
                valueType="pro"
              />
              <DetailRow
                label={t("job.detail.certifications")}
                value={job.certifications}
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
