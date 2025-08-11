import { JobWithTranslations } from "@/lib/types";
import { getTranslation, ratingToNumber } from "@/lib/utils";
import { Loader2, Star } from "lucide-react";
import { Locale, useLocale, useTranslations } from "next-intl";
import DetailRow from "../../home/components/DetailRow";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/i18n/navigation";
import { useDeleteJob } from "@/lib/jobs-queries";
import { toast } from "sonner";

const Hero = ({ job }: { job: JobWithTranslations }) => {
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
  job: JobWithTranslations;
  t: ReturnType<typeof useTranslations>;
}) {
  const locale = useLocale() as Locale
  const tr = getTranslation(job.translations, locale, "en")
  if (!tr) return null
  const editLabel =
    locale === "es"
      ? "Editar"
      : locale === "pt"
        ? "Editar"
        : "Edit"; // default English
  return (
    <div className=" gap-8 w-full  ">
      <div className="sm:p-8 p-4 max-sm:py-8 border border-[#DADADA] rounded-2xl">
        <JobDetailsHeader t={t} title={tr?.title} rating={`${ratingToNumber(tr.rating).toFixed(1)}`} />
        <JobSalaryInfo t={t} salary={tr.salary} />
        <JobRequirements t={t} requirements={tr.requirements} />
        {/* job detasils  */}
        <div className="flex flex-col gap-y-1 mb-6">
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

          <MobileCompanyRating rating={`${ratingToNumber(tr.rating)}`} t={t} />
          <div className=" flex items-center gap-4">

            <DeleteJobbutton jobId={job.id} locale={locale} />
            <Link href={`/admin/jobs/edit/${job.id}`} className="">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 shadow-md hover:bg-gray-100 max-sm:w-full px-5 cursor-pointer md:h-14 h-12 rounded-xl xl:text-lg sm:font-bold font-normal tracking-wider"
              >
                {editLabel}
              </Button>
            </Link>
          </div>
        </div>
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


const DeleteJobbutton = ({ locale, jobId }: { locale: Locale, jobId: string }) => {
  const router = useRouter();

  const { mutate, isPending } = useDeleteJob();

  const handleDelete = () => {
    mutate(jobId, {
      onSuccess: () => {
        toast.success(
          locale === "es"
            ? "Trabajo eliminado con éxito"
            : locale === "pt"
              ? "Trabalho excluído com sucesso"
              : "Job deleted successfully"
        );
        router.push("/admin/jobs");
      },
    });
  };

  const deleteLabel =
    locale === "es" ? "Eliminar" :
      locale === "pt" ? "Excluir" :
        "Delete"; // default to en
  return (
    <Button
      variant={"destructive"}
      onClick={handleDelete}
      disabled={isPending}
      className="w-fit py-0 md:h-14 h-12 rounded-xl xl:text-lg shadow-md sm:font-bold font-normal tracking-wider px-5">
      {isPending ? <Loader2 className="animate-spin" /> : deleteLabel}
    </Button>
  )
}