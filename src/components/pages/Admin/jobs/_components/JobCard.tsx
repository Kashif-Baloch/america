"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BsFillBookmarkFill } from "react-icons/bs";
import { FaStar } from "react-icons/fa";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { JobData } from "@/components/pages/home/Details";

export default function JobCard({ job }: { job: JobData }) {
  const t = useTranslations("home");
  const t2 = useTranslations("dashboardJobs");
  return (
    <Card
      className={`border  border-[#DADADA]
       rounded-2xl lg:h-[412px] lg:w-[458px] cursor-pointer w-full`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold font-roboto sm:text-3xl text-2xl leading-[1.1]  w-11/12">
            {job.title}
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
              {job.company}
            </Badge>
          </div>

          <div className="text-2xl font-semibold">{job.salary}</div>

          <div className="">10 min • {job.location}</div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[#7B7B7B]">
                {t("job.detail.hiresOutside")}
              </span>
              <Badge
                variant="secondary"
                className="bg-ghost-golden px-3 text-golden lg:text-lg text-sm"
              >
                {job.hiresOutside ? "Yes" : "No"}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 ">
            <span className="text-sm text-gray-600">
              {t("job.rating.label")}
            </span>
            <div className="flex items-center gap-1">
              <FaStar className="fill-primary-yellow text-2xl" />
              <span className="font-roboto">{job.rating}</span>
            </div>
          </div>
          <Link href={`/admin/jobs/${job.id}`}>
            <Button className="bg-primary-blue mt-5 max-sm:w-full px-5 cursor-pointer md:h-14 h-12 rounded-xl xl:text-lg sm:font-bold font-normal tracking-wider text-white blue-btn-shadow">
              {t2("btn")}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
