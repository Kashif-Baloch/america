"use client";
import { usePublicJobsQuery } from "@/lib/jobs-queries";
import { Loader2, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useState } from "react";
import DetailRow from "./components/DetailRow";
import { JobApplicationButtons } from "./components/JobApplicationButtons";
import JobCard from "./components/JobCard";
import FilterSection from "./Filters";
import { JobWithTranslations } from "@/lib/types";
import { getTranslation, ratingToNumber } from "@/lib/utils";

export default function Details() {

  return (
    <div className="bg-white helmet mt-28 md:mt-14 font-sf">
      <JobContentSection />
    </div>
  );
}

function JobContentSection() {
  const t = useTranslations("home");

  const [selectedCard, setSelectedCard] = useState<string>("");

  const { data: jobs, isLoading, isError } = usePublicJobsQuery();

  if (isLoading) {
    return <div className="w-full min-h-[500px] flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }

  if (isError || !jobs) {
    return <div>{t("error")}</div>;
  }

  return (
    <>
      <FilterSection t={t} />
      <div className="w-full">
        <div className="flex gap-10 lg:flex-row flex-col w-full ">
          <JobCardsList
            AllJobsData={jobs}
            selectedCard={selectedCard}
            setSelectedCard={setSelectedCard}
          />
          <JobDetails
            t={t}
            job={
              jobs.find((job) => job.id === selectedCard) || jobs[0]
            }
          />
        </div>
      </div>
    </>

  );
}

export function JobCardsList({
  AllJobsData,
  selectedCard,
  setSelectedCard,
}: {
  AllJobsData: JobWithTranslations[];
  selectedCard: string;
  setSelectedCard: Dispatch<SetStateAction<string>>;
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
  job: JobWithTranslations;
  t: ReturnType<typeof useTranslations>;
}) {
  const locale = useLocale()
  const tr = getTranslation(job.translations, locale, "en")
  if (!tr) return null
  return (
    <div className="lg:grid gap-8 w-full hidden lg:w-[calc(100%-420px)]">
      <div className="sm:p-14 p-4 max-sm:py-8 border border-[#DADADA] rounded-2xl">
        <JobDetailsHeader t={t} title={tr.title} rating={`${ratingToNumber(tr.rating).toFixed(1)}`} />
        <JobSalaryInfo t={t} salary={tr.salary} />
        <JobRequirements t={t} requirements={tr.requirements} />
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
  job: JobWithTranslations;
  t: ReturnType<typeof useTranslations>;
}) {
  const locale = useLocale()
  const tr = getTranslation(job.translations, locale, "en")
  if (!tr) return null
  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 gap-y-1 mb-6">
      <DetailRow
        label={t("job.detail.company")}
        value={tr.company}
        valueType="basic"
      />
      <DetailRow label={t("job.detail.city")} value={"Pro"} valueType="pro" />
      <DetailRow
        label={t("job.detail.phone")}
        value={tr.phoneNumber}
        valueType="pro"
      />
      <DetailRow
        label={t("job.detail.hiresOutside")}
        value={tr.hiresOutside}
        valueType="pro"
      />
      <DetailRow
        label={t("job.detail.season")}
        value={tr.season}
        valueType="pro"
      />
      <DetailRow
        label={t("job.detail.overtime")}
        value={tr.overtime}
        valueType="pro"
      />
      <DetailRow
        label={t("job.detail.hiredLastYear")}
        value={tr.hiresOutside}
        valueType="pro"
      />
      <DetailRow
        label={t("job.detail.employeesHired")}
        value={tr.employeesHired}
        valueType="pro"
      />
      <DetailRow
        label={t("job.detail.approvalRate")}
        value={tr.approvalRate}
        valueType="pro"
      />
      <DetailRow
        label={t("job.detail.transportationHousing")}
        value={tr.transportationHousing}
        valueType="pro"
      />
      <DetailRow
        label={t("job.detail.legalProcess")}
        value={tr.legalProcess}
        valueType="pro"
      />
      <DetailRow
        label={t("job.detail.processDuration")}
        value={tr.processDuration}
        valueType="pro"
      />
      <DetailRow
        label={t("job.detail.processSpeed")}
        value={tr.processSpeed}
        valueType="pro"
      />
      <DetailRow
        label={t("job.detail.approvalEfficiency")}
        value={tr.approvalEfficiency}
        valueType="pro"
      />
      <DetailRow
        label={t("job.detail.visaEmployees")}
        value={tr.visaEmployees}
        valueType="pro"
      />
      <DetailRow
        label={t("job.detail.certifications")}
        value={tr.certifications}
        valueType="pro"
      />

      <MobileCompanyRating rating={`${ratingToNumber(tr.rating).toFixed(1)}`} t={t} />
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
