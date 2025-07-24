import React from "react";
import { JobData } from "../../home/Details";
import { useTranslations } from "next-intl";
import DetailRow from "../../home/components/DetailRow";
import { Star } from "lucide-react";

const Hero = ({ job }: { job: JobData }) => {
  console.log(job);
  const t = useTranslations("home");
  const t2 = useTranslations("dashboardJobs");
  return (
    <div className="py-12 px-4">
      <h2 className="text-4xl text-center font-bold text-gray-900 mb-2">
        {t2("jobDetailTitle")}
      </h2>

      <div className="max-w-7xl w-11/12 mx-auto mt-10">
        <JobDetails job={job} t={t} />
      </div>
    </div>
  );
};

export default Hero;

function JobDetails({
  job,
  t,
}: {
  job: JobData;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className=" gap-8 w-full  ">
      <div className="sm:p-8 p-4 max-sm:py-8 border border-[#DADADA] rounded-2xl">
        <JobDetailsHeader t={t} title={job.title} rating={job.rating} />
        <JobSalaryInfo t={t} salary={job.salary} />
        <JobRequirements t={t} requirements={job.requirements} />
        <JobDetailsList t={t} job={job} />
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
    <div className="flex flex-col gap-y-1 mb-6">
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
