"use client";
import { PublicJobFilters, usePublicJobsQuery } from "@/lib/jobs-queries";
import { Loader2, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { JobDetailsModal } from "./JobDetailsModal";
import { redirect, useSearchParams } from "next/navigation";
import DetailRow from "./components/DetailRow";
import { JobApplicationButtons } from "./components/JobApplicationButtons";
import { JobCard } from "./components/JobCard";
import { JobWithTranslations } from "@/lib/types";
import { getTranslation, ratingToNumber } from "@/lib/utils";
import { useSubscriptionPlan } from "@/lib/subscription-queries";
import type { Plan } from "@/lib/types";
import Link from "next/link";
import SubFilterSection from "./DetailsSubFilters";
import { Filters } from "./Filters";

export default function DetailsSub() {
  const { data: sub } = useSubscriptionPlan();
  if (sub?.plan === "NONE" || sub?.plan === "FREE") {
    redirect(`/`);
  }

  return (
    <div className="bg-white  w-[98%] mb-20 mx-auto mt-28 md:mt-14 font-sf">
      <JobContentSection />
    </div>
  );
}

function JobContentSection() {
  const t = useTranslations("home");
  const { data: sub } = useSubscriptionPlan();
  const plan: Plan = sub?.plan === "NONE" ? "FREE" : sub?.plan ?? "FREE";
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Filters>({
    location: t("filter.location"),
    jobType: [],
    salary: t("filter.salary"),
    contactOutside: t("filter.contactOutside"),
    season: [],
    transportationHousing: t("filter.transportationHousing"),
  });
  const [selectedCard, setSelectedCard] = useState<string>("");
  const [mobileModalOpen, setMobileModalOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const loc = searchParams.get("location");
    setFilters((prev) => ({
      ...prev,
      location: loc && loc.trim() ? loc : t("filter.location"),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const apiFilters: PublicJobFilters = useMemo(() => {
    const f: PublicJobFilters = {};
    const q = searchParams.get("q");
    if (q && q.trim()) f.q = q.trim();
    if (filters.location && filters.location !== t("filter.location")) {
      f.location = filters.location;
    }

    if (filters.jobType && filters.jobType.length > 0) {
      const jtMap: Record<string, string> = {
        [t("filters.jobTypes.full_time")]: "full_time",
        [t("filters.jobTypes.part_time")]: "part_time",
        [t("filters.jobTypes.contract")]: "contract",
        [t("filters.jobTypes.temporary")]: "temporary",
        [t("filters.jobTypes.internship")]: "internship",
      };
      f.jobType = filters.jobType
        .map((s) => jtMap[s])
        .filter(Boolean) as string[];
    }

    if (
      filters.contactOutside &&
      filters.contactOutside !== t("filter.contactOutside") &&
      filters.contactOutside !== t("filters.contactOutside.all")
    ) {
      if (filters.contactOutside === t("filters.contactOutside.yes"))
        f.hiresOutside = "yes";
      else if (filters.contactOutside === t("filters.contactOutside.no"))
        f.hiresOutside = "no";
    }

    if (filters.season && filters.season.length > 0) {
      const map: Record<string, string> = {
        [t("filters.seasons.summer")]: "summer",
        [t("filters.seasons.winter")]: "winter",
        [t("filters.seasons.yearRound")]: "year_round",
      };
      f.season = filters.season.map((s) => map[s]).filter(Boolean) as string[];
    }

    if (
      filters.transportationHousing &&
      filters.transportationHousing !== t("filter.transportationHousing") &&
      filters.transportationHousing !== t("filters.transport.all")
    ) {
      const thMap: Record<string, string> = {
        [t("filters.transport.transport")]: "transport",
        [t("filters.transport.housing")]: "housing",
      };
      const v = thMap[filters.transportationHousing];
      if (v) f.transportationHousing = v as any;
    }

    if (filters.salary && filters.salary !== t("filter.salary")) {
      const sMap: Record<string, string> = {
        [t("filters.salary.upto13")]: "upto13",
        [t("filters.salary.upto26")]: "upto26",
        [t("filters.salary.above26")]: "above26",
      };
      const sv = sMap[filters.salary];
      if (sv) f.salary = sv as any;
    }

    return f;
  }, [filters, t, searchParams]);

  const {
    data: jobs,
    isLoading,
    isError,
    error,
  } = usePublicJobsQuery(apiFilters);

  const quotaReached =
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string" &&
    error.message.toLowerCase().includes("monthly search limit");

  const Banner = () => (
    <div className="w-full mb-4 p-4 rounded-lg border border-yellow-300 bg-yellow-50 text-yellow-900">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm sm:text-base">{t("quota.limitReached")}</p>
        <Link
          href="/pricing"
          className="shrink-0 inline-flex items-center justify-center rounded-md bg-primary-blue text-white px-3 py-2 text-sm font-semibold hover:opacity-90"
        >
          {t("quota.upgradeCta")}
        </Link>
      </div>
    </div>
  );

  if ((!isLoading && isError) || !jobs) {
    return (
      <>
        <SubFilterSection
          t={t}
          plan={plan}
          filters={filters}
          setFilters={setFilters}
        />
        {quotaReached ? <Banner /> : <div>{t("error")}</div>}
      </>
    );
  }

  return (
    <>
      {quotaReached && <Banner />}
      <div className="w-full flex gap-10 flex-wrap md:flex-nowrap">
        <SubFilterSection
          t={t}
          plan={plan}
          filters={filters}
          setFilters={setFilters}
        />
        {isLoading ? (
          <div className="w-full min-h-[500px] flex items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex items-center justify-center h-[200px] w-full">
            <h1 className="text-gray-600 font-bold">No Jobs Found</h1>
          </div>
        ) : (
          <div className="flex gap-10 lg:flex-row flex-col w-full">
            <JobCardsList
              AllJobsData={jobs}
              selectedCard={selectedCard}
              setSelectedCard={(id) => {
                setSelectedCard(id);
                if (isMobile) {
                  setMobileModalOpen(true);
                }
              }}
              plan={plan}
            />
            {jobs.length > 0 && plan && (
              <>
                {!isMobile && (
                  <JobDetails
                    t={t}
                    job={jobs.find((job) => job.id === selectedCard) || jobs[0]}
                    plan={plan}
                  />
                )}
                <JobDetailsModal
                  job={jobs.find((job) => job.id === selectedCard) || jobs[0]}
                  isOpen={mobileModalOpen && isMobile}
                  onOpenChange={setMobileModalOpen}
                  plan={plan}
                />
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export function JobCardsList({
  AllJobsData,
  selectedCard,
  setSelectedCard,
  plan,
}: {
  AllJobsData: JobWithTranslations[];
  selectedCard: string;
  setSelectedCard: Dispatch<SetStateAction<string>>;
  plan: Plan;
}) {
  const [visibleJobs, setVisibleJobs] = useState<number>(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadMoreJobs = () => {
    setIsLoadingMore(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      setVisibleJobs((prev) => prev + 2);
      setIsLoadingMore(false);
    }, 500);
  };

  const t = useTranslations("home");

  const jobsToShow = AllJobsData.slice(
    0,
    plan === "PRO" || plan === "PRO_PLUS"
      ? visibleJobs
      : Math.min(AllJobsData.length, 15)
  );

  const allJobsLoaded =
    plan === "PRO" || plan === "PRO_PLUS"
      ? visibleJobs >= AllJobsData.length
      : true;

  return (
    <div className="flex flex-col relative gap-y-7 sm:max-h-[780px] max-h-[800px]  overflow-y-auto  lg:w-[540px] w-full ">
      {jobsToShow.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          setSelectedCard={(id: string | null) => {
            setSelectedCard(id || "");
          }}
          selectedCard={selectedCard}
          plan={plan}
        />
      ))}
      {!allJobsLoaded && (
        <button
          onClick={loadMoreJobs}
          disabled={isLoadingMore}
          className={`sticky bottom-5 w-max left-1/2 -translate-x-1/2 bg-primary-blue rounded-full px-6 text-white cursor-pointer text-lg py-4 flex items-center justify-center gap-2 min-w-[180px] ${
            isLoadingMore ? "opacity-75" : "hover:bg-primary-blue/90"
          }`}
        >
          {isLoadingMore ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" />
            </>
          ) : (
            t("loadMoreJobs")
          )}
        </button>
      )}
    </div>
  );
}

export function JobDetails({
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
    <div className="lg:grid gap-8 w-full lg:w-[calc(100%-420px)]">
      <div className="sm:p-14 p-4 max-sm:py-8 border border-[#DADADA] rounded-2xl">
        <JobDetailsHeader
          t={t}
          title={tr.title}
          rating={`${ratingToNumber(tr.rating).toFixed(1)}`}
        />
        <JobSalaryInfo t={t} salary={tr.salary} />
        {/* FREE and above can see Special Requirements */}
        {(plan === "FREE" ||
          plan === "BASIC" ||
          plan === "PRO" ||
          plan === "PRO_PLUS") && (
          <JobRequirements t={t} requirements={tr.requirements} />
        )}
        <JobDetailsList t={t} job={job} plan={plan} />
        <JobApplicationButtons t={t} plan={plan} />
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
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 gap-y-1 mb-6">
      <DetailRow
        label={t("job.detail.company")}
        value={
          plan === "BASIC" || plan === "PRO" || plan === "PRO_PLUS"
            ? tr.company
            : t("job.detail.basic")
        }
        valueType={
          plan === "BASIC" || plan === "PRO" || plan === "PRO_PLUS"
            ? "basic"
            : "basic"
        }
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
        label={t("job.detail.hiresOutside")}
        value={
          plan === "PRO" || plan === "PRO_PLUS"
            ? tr.hiresOutside
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
        label={t("job.detail.employeesHired")}
        value={
          plan === "PRO" || plan === "PRO_PLUS"
            ? tr.employeesHired
            : t("job.detail.pro")
        }
        valueType="pro"
      />
      <DetailRow
        label={t("job.detail.approvalRate")}
        value={
          plan === "PRO" || plan === "PRO_PLUS"
            ? tr.approvalRate
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
        label={t("job.detail.visaEmployees")}
        value={
          plan === "PRO" || plan === "PRO_PLUS"
            ? tr.visaEmployees
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

      <MobileCompanyRating
        rating={`${ratingToNumber(tr.rating).toFixed(1)}`}
        t={t}
      />
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
