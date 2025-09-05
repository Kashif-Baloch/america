"use client";
import { PublicJobFilters, usePublicJobsQuery } from "@/lib/jobs-queries";
import { Loader2, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import DetailRow from "./components/DetailRow";
import { JobApplicationButtons } from "./components/JobApplicationButtons";
import { JobCard } from "./components/JobCard";
import FilterSection from "./Filters";
import { JobWithTranslations } from "@/lib/types";
import { getTranslation, ratingToNumber } from "@/lib/utils";
import { useSubscriptionPlan } from "@/lib/subscription-queries";
import type { Plan } from "@/lib/types";
import type { Filters } from "./Filters";
import Link from "next/link";

export default function DetailsSub() {
  return (
    <div className="bg-white helmet mt-28 md:mt-14 font-sf">
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

  if (isLoading) {
    return (
      <div className="w-full min-h-[500px] flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

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

  if (isError || !jobs) {
    return (
      <>
        <FilterSection
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
      <FilterSection
        t={t}
        plan={plan}
        filters={filters}
        setFilters={setFilters}
      />
      {quotaReached && <Banner />}
      <div className="w-full px-4 md:px-6 lg:px-8 py-6">
        <JobCardsList
          AllJobsData={jobs}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
          plan={plan}
        />
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadMoreJobs = () => {
    setVisibleJobs((prev) => prev + 6); // Load more jobs in multiples of 6 for better grid layout
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

  const handleCardClick = (id: string | null) => {
    if (id) {
      setSelectedCard(id);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {jobsToShow.map((job) => (
          <div key={job.id} className="w-full">
            <JobCard
              job={job}
              setSelectedCard={handleCardClick}
              selectedCard={selectedCard}
              plan={plan}
            />
          </div>
        ))}
      </div>

      {!allJobsLoaded && (
        <div className="w-full flex justify-center mt-6">
          <button
            onClick={loadMoreJobs}
            className="bg-primary-blue rounded-full px-6 text-white cursor-pointer text-lg py-3 hover:opacity-90 transition-opacity"
          >
            {t("loadMoreJobs")}
          </button>
        </div>
      )}

      {/* Enhanced Job Details Modal */}
      {isModalOpen && selectedCard && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300 animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100 "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {/* <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-1">
                    {AllJobsData.find((job) => job.id === selectedCard)
                      ?.translations[0]?.title || "Job Details"}
                  </h2>
                  <div className="flex items-center space-x-2 text-blue-100 text-sm">
                    <span>Full-time</span>
                    <span>•</span>
                    <span>Remote</span>
                    <span>•</span>
                    <span>Posted 2 days ago</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label="Close modal"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div> */}

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[100vh]  p-6 md:p-8">
              <div className="pb-8 prose max-w-full min-w-full">
                <JobDetails
                  t={t}
                  job={
                    AllJobsData.find((job) => job.id === selectedCard) ||
                    AllJobsData[0]
                  }
                  plan={plan}
                />
              </div>
            </div>

            {/* Footer */}
            {/* <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 sticky bottom-0">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Share this job:</span>
                  <div className="flex space-x-2">
                    <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
                      <span className="sr-only">Share on LinkedIn</span>
                      <svg
                        className="w-5 h-5 text-gray-700"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </button>
                    <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
                      <span className="sr-only">Share on Twitter</span>
                      <svg
                        className="w-5 h-5 text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex space-x-3 w-full sm:w-auto">
                  <button className="px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors w-full sm:w-auto">
                    Save Job
                  </button>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto">
                    Apply Now
                  </button>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
}

function JobDetails({
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
    <div className="lg:grid gap-8 bg-white h-full w-full">
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
