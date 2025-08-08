"use client";

import { useTranslations } from "next-intl";
// import JobsData from "@/Data/JobsData";
import { useJobsQuery } from "@/lib/jobs-queries";
import JobCardCorrectType from "./_components/job-card-new";
import { Skeleton } from "@/components/ui/skeleton";

const Hero = () => {
  const t2 = useTranslations("dashboardJobs");
  // const t = useTranslations("home");
  const { data, isLoading, isError, refetch } = useJobsQuery();

  if (isLoading) return (
    <div className="px-4 py-12 font-sf max-w-7xl mx-auto">
      <h2 className="text-4xl text-center font-bold text-gray-900 mb-2">
        {t2("title")}
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-10">
        {
          [0, 1, 2].map((item) => (
            <Skeleton key={`job-admin-${item}`} className="border  border-[#DADADA]
       rounded-2xl  cursor-pointer w-full animate-pulse min-h-[400px] lg:min-h-[412px]" />
          ))
        }
      </div>
    </div>

  );

  if (isError || !data?.length) return <button onClick={() => refetch()}>Retry</button>;
  // const AllJobsData: JobData[] = [
  //   {
  //     id: 1,
  //     title: t("job.detail.adminTitle"),
  //     company: t("job.detail.basic"),
  //     salary: "$25 - $30",
  //     location: "Pro",
  //     rating: "4.9",
  //     hiresOutside: "Pro",
  //     requirements: t("job.requirements.adminReq"),
  //     jobType: "Pro",
  //     season: "Pro",
  //     transportationHousing: "Pro",
  //     phoneNumber: "Pro",
  //     overtime: "Pro",
  //     legalProcess: "Pro",
  //     processDuration: "Pro",
  //     approvalRate: "Pro",
  //     employeesHired: "Pro",
  //     processSpeed: "Pro+",
  //     approvalEfficiency: "Pro+",
  //     visaEmployees: "Pro+",
  //     certifications: "Pro+",
  //   },
  //   {
  //     id: 2,
  //     title: t("job.detail.marketingTitle"),
  //     company: t("job.detail.basic"),
  //     salary: "$30 - $35",
  //     location: "Pro",
  //     rating: "4.7",
  //     hiresOutside: "Pro",
  //     requirements: t("job.requirements.marketingReq"),
  //     jobType: "Pro",
  //     season: "Pro",
  //     transportationHousing: "Pro",
  //     phoneNumber: "Pro",
  //     overtime: "Pro",
  //     legalProcess: "Pro",
  //     processDuration: "Pro",
  //     approvalRate: "Pro",
  //     employeesHired: "Pro",
  //     processSpeed: "Pro+",
  //     approvalEfficiency: "Pro+",
  //     visaEmployees: "Pro+",
  //     certifications: "Pro+",
  //   },
  // ];

  return (
    <div className="px-4 py-12 font-sf max-w-7xl mx-auto">
      <h2 className="text-4xl text-center font-bold text-gray-900 mb-2">
        {t2("title")}
      </h2>
      <div className="flex flex-wrap gap-5 mt-10">
        {data.map((item, index) => (
          <JobCardCorrectType key={index} job={item} />
        ))}
      </div>
    </div>
  );
};

export default Hero;
