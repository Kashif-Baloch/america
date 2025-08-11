"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { IoReload } from "react-icons/io5";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import { jobsKeys } from "@/lib/jobs-queries";
import kyInstance from "@/lib/ky";
import { approvalEfficiencyLabels, hiresOutsideLabels, jobFormSchema, jobSeasonLabels, jobTypeLabels, languageLabels, overtimeLabels, processSpeedLabels, ratingLabels, transportationHousingLabels } from "@/lib/schemas";
import { ApiResponse, JobFormData, JobWithTranslations } from "@/lib/types";
import { useLocale } from "next-intl";

import {
    ApprovalEfficiency,
    HiresOutside,
    JobSeason,
    JobType,
    Language,
    OvertimeAvailability,
    ProcessSpeed,
    Rating,
} from "@prisma/client";

type Props = {
    job: JobWithTranslations; // You pass this from the parent server component
};

function pickTr(job: JobWithTranslations, lang: Language) {
    return job.translations.find((t) => t.language === lang);
}

function mapJobToForm(job: JobWithTranslations): JobFormData {
    // Static fields are stored per-translation in DB; we copy them from EN (or fallback to first)
    const baseTr =
        pickTr(job, Language.en) ??
        pickTr(job, Language.es) ??
        pickTr(job, Language.pt) ??
        job.translations[0];

    return {
        staticFields: {
            rating: baseTr?.rating ?? Rating.Three,
            hiresOutside: baseTr?.hiresOutside ?? HiresOutside.no,
            jobType: baseTr?.jobType ?? JobType.full_time,
            season: baseTr?.season ?? JobSeason.year_round,
            transportationHousing: baseTr?.transportationHousing ?? "not_provided",
            overtime: baseTr?.overtime ?? OvertimeAvailability.not_available,
            processSpeed: baseTr?.processSpeed ?? ProcessSpeed.medium,
            approvalEfficiency: baseTr?.approvalEfficiency ?? ApprovalEfficiency.medium,
        },
        translations: {
            en: {
                title: pickTr(job, Language.en)?.title ?? "",
                company: pickTr(job, Language.en)?.company ?? "",
                salary: pickTr(job, Language.en)?.salary ?? "",
                location: pickTr(job, Language.en)?.location ?? "",
                requirements: pickTr(job, Language.en)?.requirements ?? "",
                phoneNumber: pickTr(job, Language.en)?.phoneNumber ?? "",
                legalProcess: pickTr(job, Language.en)?.legalProcess ?? "",
                processDuration: pickTr(job, Language.en)?.processDuration ?? "",
                approvalRate: pickTr(job, Language.en)?.approvalRate ?? "",
                employeesHired: pickTr(job, Language.en)?.employeesHired ?? "",
                visaEmployees: pickTr(job, Language.en)?.visaEmployees ?? "",
                certifications: pickTr(job, Language.en)?.certifications ?? "",
            },
            es: {
                title: pickTr(job, Language.es)?.title ?? "",
                company: pickTr(job, Language.es)?.company ?? "",
                salary: pickTr(job, Language.es)?.salary ?? "",
                location: pickTr(job, Language.es)?.location ?? "",
                requirements: pickTr(job, Language.es)?.requirements ?? "",
                phoneNumber: pickTr(job, Language.es)?.phoneNumber ?? "",
                legalProcess: pickTr(job, Language.es)?.legalProcess ?? "",
                processDuration: pickTr(job, Language.es)?.processDuration ?? "",
                approvalRate: pickTr(job, Language.es)?.approvalRate ?? "",
                employeesHired: pickTr(job, Language.es)?.employeesHired ?? "",
                visaEmployees: pickTr(job, Language.es)?.visaEmployees ?? "",
                certifications: pickTr(job, Language.es)?.certifications ?? "",
            },
            pt: {
                title: pickTr(job, Language.pt)?.title ?? "",
                company: pickTr(job, Language.pt)?.company ?? "",
                salary: pickTr(job, Language.pt)?.salary ?? "",
                location: pickTr(job, Language.pt)?.location ?? "",
                requirements: pickTr(job, Language.pt)?.requirements ?? "",
                phoneNumber: pickTr(job, Language.pt)?.phoneNumber ?? "",
                legalProcess: pickTr(job, Language.pt)?.legalProcess ?? "",
                processDuration: pickTr(job, Language.pt)?.processDuration ?? "",
                approvalRate: pickTr(job, Language.pt)?.approvalRate ?? "",
                employeesHired: pickTr(job, Language.pt)?.employeesHired ?? "",
                visaEmployees: pickTr(job, Language.pt)?.visaEmployees ?? "",
                certifications: pickTr(job, Language.pt)?.certifications ?? "",
            },
        },
    };
}

export default function EditJobForm({ job }: Props) {
    const [activeTab, setActiveTab] = useState<"en" | "es" | "pt">("en");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const queryClient = useQueryClient();
    const router = useRouter();
    const locale = useLocale()
    const defaults = useMemo(() => mapJobToForm(job), [job]);

    const form = useForm<JobFormData>({
        resolver: zodResolver(jobFormSchema),
        defaultValues: defaults,
    });

    useEffect(() => {
        // If the passed job changes for any reason, refresh form
        form.reset(defaults);
    }, [defaults, form]);

    const onSubmit = async (data: JobFormData) => {
        setIsSubmitting(true);
        try {
            const res = await kyInstance
                .put(`/api/jobs/${job.id}`, { json: { data } })
                .json<ApiResponse<null>>();

            if (res.success) {
                toast.success(res.message || "Job updated successfully!");
                // invalidate cache so lists refresh
                queryClient.invalidateQueries({ queryKey: jobsKeys.all() });
                router.push("/admin/jobs");
            } else {
                toast.error(res.message || "Could not update job.");
            }
        } catch (err) {
            if (err instanceof HTTPError) {
                try {
                    const body = (await err.response.json()) as Partial<ApiResponse<null>>;
                    toast.error(body?.message || `Request failed (${err.response.status})`);
                } catch {
                    toast.error(`Request failed (${(err as HTTPError).response.status})`);
                }
            } else {
                console.error("Unexpected error:", err);
                toast.error("Something went wrong. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderLanguageFields = (language: "en" | "es" | "pt") => (
        <div className="space-y-4">
            <Card className="!p-0 shadow-none border-none rounded-none">
                <CardHeader className="!p-0 gap-1">
                    <CardTitle className="text-lg font-semibold text-gray-900">Basic Information</CardTitle>
                    <CardDescription>Core job details in {languageLabels[language]}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 !p-0">
                    <FormField
                        control={form.control}
                        name={`translations.${language}.title`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-lg font-medium text-gray-700">Job Title</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter job title"
                                        {...field}
                                        className="w-full border rounded px-4 !py-0 !h-[50px] text-base placeholder:text-lg focus:ring focus:ring-blue-200 focus:border-blue-400 transition"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name={`translations.${language}.company`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-lg font-medium text-gray-700">Company</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter company name"
                                        {...field}
                                        className="w-full border rounded px-4 !py-0 !h-[50px] text-base placeholder:text-lg focus:ring focus:ring-blue-200 focus:border-blue-400 transition"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name={`translations.${language}.salary`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg font-medium text-gray-700">Salary</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full border rounded px-4 !py-0 !h-[50px] text-base placeholder:text-lg focus:ring focus:ring-blue-200 focus:border-blue-400 transition"
                                            placeholder="Enter salary range"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name={`translations.${language}.location`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg font-medium text-gray-700">Location</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full border rounded px-4 !py-0 !h-[50px] text-base placeholder:text-lg focus:ring focus:ring-blue-200 focus:border-blue-400 transition"
                                            placeholder="Enter job location"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name={`translations.${language}.phoneNumber`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-lg font-medium text-gray-700">Phone Number</FormLabel>
                                <FormControl>
                                    <Input
                                        className="w-full border rounded px-4 !py-0 !h-[50px] text-base placeholder:text-lg focus:ring focus:ring-blue-200 focus:border-blue-400 transition"
                                        placeholder="Enter contact phone number"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name={`translations.${language}.requirements`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-lg font-medium text-gray-700">Requirements</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter job requirements and qualifications"
                                        className="min-h-[120px] rounded-none text-base placeholder:text-lg focus:ring"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name={`translations.${language}.certifications`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-lg font-medium text-gray-700">Certifications</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter required certifications"
                                        className="min-h-[120px] rounded-none text-base placeholder:text-lg focus:ring"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            <Card className="!p-0 shadow-none border-none rounded-none">
                <CardHeader className="!p-0 gap-1">
                    <CardTitle className="text-lg font-semibold text-gray-900">Process Information</CardTitle>
                    <CardDescription>Legal and hiring process details in {languageLabels[language]}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 !p-0">
                    <FormField
                        control={form.control}
                        name={`translations.${language}.legalProcess`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-lg font-medium text-gray-700">Legal Process</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Describe the legal process for hiring"
                                        className="min-h-[120px] rounded-none text-base placeholder:text-lg focus:ring"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name={`translations.${language}.processDuration`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg font-medium text-gray-700">Process Duration</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., 2-4 weeks"
                                            {...field}
                                            className="w-full border rounded px-4 !py-0 !h-[50px] text-base placeholder:text-lg focus:ring focus:ring-blue-200 focus:border-blue-400 transition"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name={`translations.${language}.approvalRate`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg font-medium text-gray-700">Approval Rate</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., 85%"
                                            {...field}
                                            className="w-full border rounded px-4 !py-0 !h-[50px] text-base placeholder:text-lg focus:ring focus:ring-blue-200 focus:border-blue-400 transition"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name={`translations.${language}.employeesHired`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg font-medium text-gray-700">Employees Hired</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Number of employees to hire"
                                            {...field}
                                            className="w-full border rounded px-4 !py-0 !h-[50px] text-base placeholder:text-lg focus:ring focus:ring-blue-200 focus:border-blue-400 transition"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name={`translations.${language}.visaEmployees`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg font-medium text-gray-700">Visa Employees</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Information about visa employees"
                                            {...field}
                                            className="w-full border rounded px-4 !py-0 !h-[50px] text-base placeholder:text-lg focus:ring focus:ring-blue-200 focus:border-blue-400 transition"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {locale === "es"
                        ? "Editar trabajo"
                        : locale === "pt"
                            ? "Editar vaga"
                            : "Edit Job"}
                </h1>
                <p className="text-lg text-gray-600">
                    {locale === "es"
                        ? "Complete el formulario para editar este trabajo"
                        : locale === "pt"
                            ? "Preencha o formulário para editar esta vaga"
                            : "Fill out the form to edit this job"}
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Static Fields */}
                    <Card className="!py-0 !px-0 border-none shadow-none">
                        <CardHeader className="!px-0 gap-1 !py-0">
                            <CardTitle className="text-lg font-semibold text-gray-900">Job Configuration</CardTitle>
                            <CardDescription>These settings apply to all language versions</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 !py-0 !px-0">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="staticFields.rating"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-lg font-medium text-gray-700">Rating</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full border rounded px-4 !py-0 !h-[50px] text-base">
                                                        <SelectValue placeholder="Select rating" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.entries(ratingLabels).map(([value, label]) => (
                                                        <SelectItem key={value} value={value}>
                                                            {label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="staticFields.jobType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-lg font-medium text-gray-700">Job Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full border rounded px-4 !py-0 !h-[50px] text-base">
                                                        <SelectValue placeholder="Select job type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.entries(jobTypeLabels).map(([value, label]) => (
                                                        <SelectItem key={value} value={value}>
                                                            {label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="staticFields.season"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-lg font-medium text-gray-700">Season</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full border rounded px-4 !py-0 !h-[50px] text-base">
                                                        <SelectValue placeholder="Select season" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.entries(jobSeasonLabels).map(([value, label]) => (
                                                        <SelectItem key={value} value={value}>
                                                            {label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="staticFields.hiresOutside"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-lg font-medium text-gray-700">Hires Outside</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full border rounded px-4 !py-0 !h-[50px] text-base">
                                                        <SelectValue placeholder="Select option" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.entries(hiresOutsideLabels).map(([value, label]) => (
                                                        <SelectItem key={value} value={value}>
                                                            {label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="staticFields.transportationHousing"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-lg font-medium text-gray-700">Transportation & Housing</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full border rounded px-4 !py-0 !h-[50px] text-base">
                                                        <SelectValue placeholder="Select option" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.entries(transportationHousingLabels).map(([value, label]) => (
                                                        <SelectItem key={value} value={value}>
                                                            {label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="staticFields.overtime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-lg font-medium text-gray-700">Overtime Availability</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full border rounded px-4 !py-0 !h-[50px] text-base">
                                                        <SelectValue placeholder="Select option" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.entries(overtimeLabels).map(([value, label]) => (
                                                        <SelectItem key={value} value={value}>
                                                            {label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="staticFields.processSpeed"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-lg font-medium text-gray-700">Process Speed</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full border rounded px-4 !py-0 !h-[50px] text-base">
                                                        <SelectValue placeholder="Select speed" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.entries(processSpeedLabels).map(([value, label]) => (
                                                        <SelectItem key={value} value={value}>
                                                            {label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="staticFields.approvalEfficiency"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-lg font-medium text-gray-700">Approval Efficiency</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full border rounded px-4 !py-0 !h-[50px] text-base">
                                                        <SelectValue placeholder="Select efficiency" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.entries(approvalEfficiencyLabels).map(([value, label]) => (
                                                        <SelectItem key={value} value={value}>
                                                            {label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Language Tabs */}
                    <Card className="!py-0 !px-0 border-none shadow-none">
                        <CardHeader className="!px-0 !py-0 gap-1">
                            <CardTitle className="text-lg font-semibold text-gray-900">Job Translations</CardTitle>
                            <CardDescription>Update the translatable content for all three languages</CardDescription>
                        </CardHeader>
                        <CardContent className="!px-0 !py-0">
                            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                                <TabsList className="grid w-full grid-cols-3 h-[52px] rounded-none">
                                    <TabsTrigger value="en" className="flex items-center rounded-none text-lg gap-2 data-[state=active]:!text-white">
                                        English
                                    </TabsTrigger>
                                    <TabsTrigger value="es" className="flex items-center rounded-none text-lg gap-2 data-[state=active]:!text-white">
                                        Español
                                    </TabsTrigger>
                                    <TabsTrigger value="pt" className="flex items-center rounded-none text-lg gap-2 data-[state=active]:!text-white">
                                        Português
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="en" className="mt-6">
                                    {renderLanguageFields("en")}
                                </TabsContent>
                                <TabsContent value="es" className="mt-6">
                                    {renderLanguageFields("es")}
                                </TabsContent>
                                <TabsContent value="pt" className="mt-6">
                                    {renderLanguageFields("pt")}
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => form.reset(defaults)}
                            className="h-14 cursor-pointer text-lg bg-primary-blue text-white font-semibold rounded-full hover:bg-white hover:text-primary-blue border border-primary-blue"
                            title="Reset changes"
                        >
                            <IoReload className="size-[30px]" />
                        </Button>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-fit px-14 h-14 cursor-pointer text-lg bg-primary-blue text-white font-semibold rounded-full hover:bg-white hover:text-primary-blue border border-primary-blue"
                        >
                            {isSubmitting
                                ? locale === "es"
                                    ? "Guardando cambios..."
                                    : locale === "pt"
                                        ? "Salvando alterações..."
                                        : "Saving changes..."
                                : locale === "es"
                                    ? "Guardar cambios"
                                    : locale === "pt"
                                        ? "Salvar alterações"
                                        : "Save changes"}                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
