"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BsFillBookmarkFill } from "react-icons/bs";
import { FaStar } from "react-icons/fa";

import { Locale, useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { JobWithTranslations } from "@/lib/types";
import { getTranslation, ratingToNumber } from "@/lib/utils";

export default function JobCardCorrectType({ job }: { job: JobWithTranslations }) {
    const t = useTranslations("home");
    const locale = useLocale() as Locale
    const t2 = useTranslations("dashboardJobs");

    // pick translation by locale, then fall back
    const tr = getTranslation(job.translations, locale, "en")

    if (!tr) return null;
    const editLabel =
        locale === "es"
            ? "Editar"
            : locale === "pt"
                ? "Editar"
                : "Edit"; // default English
    return (
        <Card
            className={`border border-[#DADADA]
       rounded-2xl  cursor-pointer py-2 pb-0`}
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

                    {/* <div className="">10 min • {tr.location}</div> */}
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
                    <div>
                        <div className="flex gap-4 flex-wrap mt-5">
                            {/* View Button */}
                            <Link href={`/admin/jobs/${job.id}`} className="">
                                <Button className="bg-primary-blue max-sm:w-full px-5 cursor-pointer md:h-14 h-12 rounded-xl xl:text-lg sm:font-bold font-normal tracking-wider text-white blue-btn-shadow">
                                    {t2("btn")}
                                </Button>
                            </Link>

                            {/* Edit Button */}
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
            </CardContent>
        </Card>
    );
}
