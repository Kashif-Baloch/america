import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dispatch, SetStateAction } from "react";
import { BsFillBookmarkFill } from "react-icons/bs";
import { FaStar } from "react-icons/fa";

import MobileJobDetails from "./MobileJobDetails";
import { JobApplicationButtons } from "./JobApplicationButtons";
import { useLocale, useTranslations } from "next-intl";
import { JobWithTranslations } from "@/lib/types";
import { getTranslation, ratingToNumber } from "@/lib/utils";

interface JobCardProps {
  job: JobWithTranslations;
  selectedCard: string;
  setSelectedCard: Dispatch<SetStateAction<string>>;
}

export default function JobCard({
  job,
  selectedCard,
  setSelectedCard,
}: JobCardProps) {
  const t = useTranslations("home");
  const locale = useLocale()
  const tr = getTranslation(job.translations, locale, "en")
  if (!tr) return null
  return (
    <Card
      onClick={() => setSelectedCard(job.id)}
      className={`border ${selectedCard === job.id ? "border-primary-blue" : "border-[#DADADA]"
        } rounded-2xl lg:h-[342px] lg:w-[458px] cursor-pointer w-full`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold font-roboto sm:text-3xl text-2xl leading-[1.1]  w-11/12">
            {tr.title}
          </h3>
          <BsFillBookmarkFill className="fill-primary-yellow size-6" />
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">{t("job.detail.company")}</span>
            <Badge
              variant="secondary"
              className="lg:text-[17px] text-sm px-3 text-secondary-green bg-ghost-green"
            >
              {tr.company}
            </Badge>
          </div>

          <div className="text-2xl font-semibold">{tr.salary}</div>

          <div className="">Location:- {tr.location}</div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[#7B7B7B]">
                {t("job.detail.hiresOutside")}
              </span>
              <Badge
                variant="secondary"
                className="bg-ghost-golden px-3 text-golden lg:text-lg text-sm"
              >
                {tr.hiresOutside ? "Yes" : "No"}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 ">
            <span className="text-sm text-gray-600">
              {t("job.rating.label")}
            </span>
            <div className="flex items-center gap-1">
              <FaStar className="fill-primary-yellow text-2xl" />
              <span className="font-roboto">{ratingToNumber(tr.rating).toFixed(1)}</span>
            </div>
          </div>

          {/* Accordion for smaller screens */}
          {selectedCard === job.id && <MobileJobDetails job={job} t={t} />}
        </div>
        <div className="w-full lg:hidden">
          {selectedCard === job.id && <JobApplicationButtons t={t} />}
        </div>
      </CardContent>
    </Card>
  );
}
