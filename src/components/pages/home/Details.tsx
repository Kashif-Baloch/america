"use client";
import { Star } from "lucide-react";
import { useState, Dispatch, SetStateAction } from "react";
import DetailRow from "./components/DetailRow";
import JobCard from "./components/JobCard";
import { JobApplicationButtons } from "./components/JobApplicationButtons";
import { useTranslations } from "next-intl";
import FilterSection from "./Filters";
export interface JobData {
  id: number;
  title: string;
  company: string;
  salary: string;
  location: string;
  rating: string;
  hiresOutside: string;
  requirements: string;
  jobType: string;
  season: string;
  transportationHousing: string;
  phoneNumber: string;
  overtime: string;
  legalProcess: string;
  processDuration: string;
  approvalRate: string;
  employeesHired: string;
  processSpeed: string;
  approvalEfficiency: string;
  visaEmployees: string;
  certifications: string;
}

export default function Details() {
  const t = useTranslations("home");

  return (
    <div className="bg-white helmet mt-28 md:mt-14 font-sf">
      <FilterSection t={t} />
      <JobContentSection />
    </div>
  );
}

function JobContentSection() {
  const t = useTranslations("home");
  const [selectedCard, setSelectedCard] = useState<number>(1);

  const AllJobsData: JobData[] = [
    {
      id: 1,
      title: t("job.detail.adminTitle"),
      company: t("job.detail.basic"),
      salary: "$25 - $30",
      location: "Pro",
      rating: "4.9",
      hiresOutside: "Pro",
      requirements: t("job.requirements.adminReq"),
      jobType: "Pro",
      season: "Pro",
      transportationHousing: "Pro",
      phoneNumber: "Pro",
      overtime: "Pro",
      legalProcess: "Pro",
      processDuration: "Pro",
      approvalRate: "Pro",
      employeesHired: "Pro",
      processSpeed: "Pro+",
      approvalEfficiency: "Pro+",
      visaEmployees: "Pro+",
      certifications: "Pro+",
    },
    {
      id: 2,
      title: t("job.detail.marketingTitle"),
      company: t("job.detail.basic"),
      salary: "$30 - $35",
      location: "Pro",
      rating: "4.7",
      hiresOutside: "Pro",
      requirements: t("job.requirements.marketingReq"),
      jobType: "Pro",
      season: "Pro",
      transportationHousing: "Pro",
      phoneNumber: "Pro",
      overtime: "Pro",
      legalProcess: "Pro",
      processDuration: "Pro",
      approvalRate: "Pro",
      employeesHired: "Pro",
      processSpeed: "Pro+",
      approvalEfficiency: "Pro+",
      visaEmployees: "Pro+",
      certifications: "Pro+",
    },
    {
      id: 3,
      title: t("job.detail.adminTitle"),
      company: t("job.detail.basic"),
      salary: "$25 - $30",
      location: "Pro",
      rating: "4.9",
      hiresOutside: "Pro",
      requirements: t("job.requirements.adminReq"),
      jobType: "Pro",
      season: "Pro",
      transportationHousing: "Pro",
      phoneNumber: "Pro",
      overtime: "Pro",
      legalProcess: "Pro",
      processDuration: "Pro",
      approvalRate: "Pro",
      employeesHired: "Pro",
      processSpeed: "Pro+",
      approvalEfficiency: "Pro+",
      visaEmployees: "Pro+",
      certifications: "Pro+",
    },
    {
      id: 4,
      title: t("job.detail.marketingTitle"),
      company: t("job.detail.basic"),
      salary: "$30 - $35",
      location: "Pro",
      rating: "4.7",
      hiresOutside: "Pro",
      requirements: t("job.requirements.marketingReq"),
      jobType: "Pro",
      season: "Pro",
      transportationHousing: "Pro",
      phoneNumber: "Pro",
      overtime: "Pro",
      legalProcess: "Pro",
      processDuration: "Pro",
      approvalRate: "Pro",
      employeesHired: "Pro",
      processSpeed: "Pro+",
      approvalEfficiency: "Pro+",
      visaEmployees: "Pro+",
      certifications: "Pro+",
    },
    {
      id: 6,
      title: t("job.detail.adminTitle"),
      company: t("job.detail.basic"),
      salary: "$25 - $30",
      location: "Pro",
      rating: "4.9",
      hiresOutside: "Pro",
      requirements: t("job.requirements.adminReq"),
      jobType: "Pro",
      season: "Pro",
      transportationHousing: "Pro",
      phoneNumber: "Pro",
      overtime: "Pro",
      legalProcess: "Pro",
      processDuration: "Pro",
      approvalRate: "Pro",
      employeesHired: "Pro",
      processSpeed: "Pro+",
      approvalEfficiency: "Pro+",
      visaEmployees: "Pro+",
      certifications: "Pro+",
    },
    {
      id: 7,
      title: t("job.detail.marketingTitle"),
      company: t("job.detail.basic"),
      salary: "$30 - $35",
      location: "Pro",
      rating: "4.7",
      hiresOutside: "Pro",
      requirements: t("job.requirements.marketingReq"),
      jobType: "Pro",
      season: "Pro",
      transportationHousing: "Pro",
      phoneNumber: "Pro",
      overtime: "Pro",
      legalProcess: "Pro",
      processDuration: "Pro",
      approvalRate: "Pro",
      employeesHired: "Pro",
      processSpeed: "Pro+",
      approvalEfficiency: "Pro+",
      visaEmployees: "Pro+",
      certifications: "Pro+",
    },
  ];

  return (
    <div className="w-full">
      <div className="flex gap-10 lg:flex-row flex-col w-full ">
        <JobCardsList
          AllJobsData={AllJobsData}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
        />

        <JobDetails
          t={t}
          job={
            AllJobsData.find((job) => job.id === selectedCard) || AllJobsData[0]
          }
        />
      </div>
    </div>
  );
}

export function JobCardsList({
  AllJobsData,
  selectedCard,
  setSelectedCard,
}: {
  AllJobsData: JobData[];
  selectedCard: number;
  setSelectedCard: Dispatch<SetStateAction<number>>;
}) {
  const [visibleJobs, setVisibleJobs] = useState<number>(2);
  const loadMoreJobs = () => {
    setVisibleJobs((prev) => prev + 2);
  };
  const t = useTranslations("home");
  const jobsToShow = AllJobsData.slice(0, visibleJobs);
  const allJobsLoaded = visibleJobs >= AllJobsData.length;
  return (
    <div className="flex flex-col relative gap-y-7 sm:max-h-[780px] max-h-[800px]  overflow-y-auto  lg:w-[540px] w-full ">
      {jobsToShow.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
        />
      ))}
      {!allJobsLoaded && (
        <button
          onClick={loadMoreJobs}
          className=" sticky bottom-5 w-max left-1/2 -translate-x-1/2 bg-primary-blue rounded-full px-6 text-white cursor-pointer text-lg py-4"
        >
          {t("loadMoreJobs")}
        </button>
      )}
    </div>
  );
}

function JobDetails({
  job,
  t,
}: {
  job: JobData;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="lg:grid gap-8 w-full hidden lg:w-[calc(100%-420px)]">
      <div className="sm:p-14 p-4 max-sm:py-8 border border-[#DADADA] rounded-2xl">
        <JobDetailsHeader t={t} title={job.title} rating={job.rating} />
        <JobSalaryInfo t={t} salary={job.salary} />
        <JobRequirements t={t} requirements={job.requirements} />
        <JobDetailsList t={t} job={job} />
        <JobApplicationButtons t={t} />
      </div>
    </div>
  );
}

function JobDetailsHeader({
  title,
  rating,
  t,
}: {
  title: string;
  rating: string;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="flex items-start gap-y-3 justify-between mb-4">
      <h1 className="sm:text-[32px] text-2xl font-bold max-w-[502px] leading-[1.2]">
        {title}
      </h1>
      <div className="text-right sm:block hidden">
        <div className="text-sm text-gray-600 mb-1 whitespace-nowrap">
          {t("job.rating.label")}
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-2xl">{rating}</span>
        </div>
      </div>
    </div>
  );
}

function JobSalaryInfo({
  salary,
}: {
  salary: string;
  t: ReturnType<typeof useTranslations>;
}) {
  return <div className="text-2xl font-semibold mb-2">{salary}</div>;
}

function JobRequirements({
  requirements,
  t,
}: {
  requirements: string;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="mb-2">
      <p className="max-w-[410px] leading-[1.2]">
        <span className="font-bold">{t("job.requirements.label")}</span>{" "}
        {requirements}
      </p>
    </div>
  );
}

function JobDetailsList({
  job,
  t,
}: {
  job: JobData;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 gap-y-1 mb-6">
      <DetailRow
        label={t("job.detail.company")}
        value={job.company}
        valueType="basic"
      />
      <DetailRow label={t("job.detail.city")} value={"Pro"} valueType="pro" />
      <DetailRow
        label={t("job.detail.phone")}
        value={job.phoneNumber}
        valueType="pro"
      />
      <DetailRow
        label={t("job.detail.hiresOutside")}
        value={job.hiresOutside}
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
        label={t("job.detail.hiredLastYear")}
        value={job.hiresOutside}
        valueType="pro"
      />
      <DetailRow
        label={t("job.detail.employeesHired")}
        value={job.employeesHired}
        valueType="pro"
      />
      <DetailRow
        label={t("job.detail.approvalRate")}
        value={job.approvalRate}
        valueType="pro"
      />
      <DetailRow
        label={t("job.detail.transportationHousing")}
        value={job.transportationHousing}
        valueType="pro"
      />
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
      <DetailRow
        label={t("job.detail.approvalEfficiency")}
        value={job.approvalEfficiency}
        valueType="pro"
      />
      <DetailRow
        label={t("job.detail.visaEmployees")}
        value={job.visaEmployees}
        valueType="pro"
      />
      <DetailRow
        label={t("job.detail.certifications")}
        value={job.certifications}
        valueType="pro"
      />

      <MobileCompanyRating rating={job.rating} t={t} />
    </div>
  );
}

function MobileCompanyRating({
  rating,
  t,
}: {
  rating: string;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="text-right w-24 sm:hidden flex items-center gap-2">
      <div className="text-sm text-gray-600 mb-1 whitespace-nowrap">
        {t("job.rating.label")}
      </div>
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="font-semibold text-2xl">{rating}</span>
      </div>
    </div>
  );
}
