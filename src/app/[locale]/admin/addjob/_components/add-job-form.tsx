"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { JobFormData } from "@/lib/types"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    ApprovalEfficiency,
    HiresOutside,
    JobSeason,
    JobType,
    OvertimeAvailability,
    ProcessSpeed,
    Rating,
    TransportationHousing,
} from "@prisma/client"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { IoReload } from "react-icons/io5"
import { z } from "zod"

// Update the validation schema and form structure

// Update validation schemas
const jobTranslatableSchema = z.object({
    title: z.string().min(1, "Title is required"),
    company: z.string().min(1, "Company is required"),
    salary: z.string().min(1, "Salary is required"),
    location: z.string().min(1, "Location is required"),
    requirements: z.string().min(1, "Requirements are required"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    legalProcess: z.string().min(1, "Legal process is required"),
    processDuration: z.string().min(1, "Process duration is required"),
    approvalRate: z.string().min(1, "Approval rate is required"),
    employeesHired: z.string().min(1, "Employees hired is required"),
    visaEmployees: z.string().min(1, "Visa employees is required"),
    certifications: z.string().min(1, "Certifications are required"),
})

const jobStaticSchema = z.object({
    rating: z.nativeEnum(Rating),
    hiresOutside: z.nativeEnum(HiresOutside),
    jobType: z.nativeEnum(JobType),
    season: z.nativeEnum(JobSeason),
    transportationHousing: z.nativeEnum(TransportationHousing),
    overtime: z.nativeEnum(OvertimeAvailability),
    processSpeed: z.nativeEnum(ProcessSpeed),
    approvalEfficiency: z.nativeEnum(ApprovalEfficiency),
})

const jobFormSchema = z.object({
    staticFields: jobStaticSchema,
    translations: z.object({
        en: jobTranslatableSchema,
        es: jobTranslatableSchema,
        pt: jobTranslatableSchema,
    }),
})

const languageLabels = {
    en: "English",
    es: "Español",
    pt: "Português",
}

const ratingLabels = {
    [Rating.One]: "1 Star",
    [Rating.Two]: "2 Stars",
    [Rating.Three]: "3 Stars",
    [Rating.Four]: "4 Stars",
    [Rating.Five]: "5 Stars",
}

const hiresOutsideLabels = {
    [HiresOutside.yes]: "Yes",
    [HiresOutside.no]: "No",
    [HiresOutside.sometimes]: "Sometimes",
}

const jobTypeLabels = {
    [JobType.full_time]: "Full Time",
    [JobType.part_time]: "Part Time",
    [JobType.contract]: "Contract",
    [JobType.temporary]: "Temporary",
    [JobType.internship]: "Internship",
}

const jobSeasonLabels = {
    [JobSeason.spring]: "Spring",
    [JobSeason.summer]: "Summer",
    [JobSeason.fall]: "Fall",
    [JobSeason.winter]: "Winter",
    [JobSeason.year_round]: "Year Round",
}

const transportationHousingLabels = {
    [TransportationHousing.provided]: "Provided",
    [TransportationHousing.not_provided]: "Not Provided",
    [TransportationHousing.partial]: "Partial",
    [TransportationHousing.transportation_only]: "Transportation Only",
    [TransportationHousing.housing_only]: "Housing Only",
}

const overtimeLabels = {
    [OvertimeAvailability.available]: "Available",
    [OvertimeAvailability.not_available]: "Not Available",
    [OvertimeAvailability.limited]: "Limited",
}

const processSpeedLabels = {
    [ProcessSpeed.fast]: "Fast",
    [ProcessSpeed.medium]: "Medium",
    [ProcessSpeed.slow]: "Slow",
}

const approvalEfficiencyLabels = {
    [ApprovalEfficiency.high]: "High",
    [ApprovalEfficiency.medium]: "Medium",
    [ApprovalEfficiency.low]: "Low",
}

export default function JobForm() {
    const [activeTab, setActiveTab] = useState("en")
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Update default values
    const form = useForm<JobFormData>({
        resolver: zodResolver(jobFormSchema),
        defaultValues: {
            staticFields: {
                rating: Rating.Three,
                hiresOutside: HiresOutside.no,
                jobType: JobType.full_time,
                season: JobSeason.year_round,
                transportationHousing: TransportationHousing.not_provided,
                overtime: OvertimeAvailability.not_available,
                processSpeed: ProcessSpeed.medium,
                approvalEfficiency: ApprovalEfficiency.medium,
            },
            translations: {
                en: {
                    title: "",
                    company: "",
                    salary: "",
                    location: "",
                    requirements: "",
                    phoneNumber: "",
                    legalProcess: "",
                    processDuration: "",
                    approvalRate: "",
                    employeesHired: "",
                    visaEmployees: "",
                    certifications: "",
                },
                es: {
                    title: "",
                    company: "",
                    salary: "",
                    location: "",
                    requirements: "",
                    phoneNumber: "",
                    legalProcess: "",
                    processDuration: "",
                    approvalRate: "",
                    employeesHired: "",
                    visaEmployees: "",
                    certifications: "",
                },
                pt: {
                    title: "",
                    company: "",
                    salary: "",
                    location: "",
                    requirements: "",
                    phoneNumber: "",
                    legalProcess: "",
                    processDuration: "",
                    approvalRate: "",
                    employeesHired: "",
                    visaEmployees: "",
                    certifications: "",
                },
            },
        },
    })

    const onSubmit = async (data: JobFormData) => {
        setIsSubmitting(true)
        try {
            // Here you would typically send the data to your API
            console.log("Form data:", data)

            // Example API call:
            // const response = await fetch('/api/jobs', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(data)
            // })

            alert("Job created successfully!")
        } catch (error) {
            console.error("Error creating job:", error)
            alert("Error creating job. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    // only show translatable fields
    const renderLanguageFields = (language: "en" | "es" | "pt") => (
        <div className="space-y-4">
            {/* Basic Information */}
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
                                    <Input placeholder="Enter job title" {...field}
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
                                    <Input placeholder="Enter company name" {...field}
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
                                            placeholder="Enter salary range" {...field} />
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
                                            placeholder="Enter job location" {...field} />
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
                                        placeholder="Enter contact phone number" {...field} />
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
                                    <Textarea placeholder="Enter required certifications"
                                        className="min-h-[120px] rounded-none text-base placeholder:text-lg focus:ring"
                                        {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            {/* Process Information */}
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
                                    <Textarea placeholder="Describe the legal process for hiring"
                                        className="min-h-[120px] rounded-none text-base placeholder:text-lg focus:ring"
                                        {...field} />
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
                                        <Input placeholder="e.g., 2-4 weeks" {...field}
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
                                        <Input placeholder="e.g., 85%" {...field}
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
                                        <Input placeholder="Number of employees to hire" {...field}
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
                                        <Input placeholder="Information about visa employees" {...field}
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
    )

    const t = useTranslations("addjob");

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{t("addJob")}</h1>
                <p className="text-lg text-gray-600">{t("fillForm")}</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Static Fields - No Translation Needed */}
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
                                                    <SelectTrigger
                                                        className="w-full border rounded px-4 !py-0 !h-[50px] text-base placeholder:text-lg focus:ring focus:ring-blue-200 focus:border-blue-400 transition"
                                                    >
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
                                                    <SelectTrigger
                                                        className="w-full border rounded px-4 !py-0 !h-[50px] text-base placeholder:text-lg focus:ring focus:ring-blue-200 focus:border-blue-400 transition"
                                                    >
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
                                                    <SelectTrigger
                                                        className="w-full border rounded px-4 !py-0 !h-[50px] text-base placeholder:text-lg focus:ring focus:ring-blue-200 focus:border-blue-400 transition"
                                                    >
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
                                                    <SelectTrigger
                                                        className="w-full border rounded px-4 !py-0 !h-[50px] text-base placeholder:text-lg focus:ring focus:ring-blue-200 focus:border-blue-400 transition"
                                                    >
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
                                                    <SelectTrigger
                                                        className="w-full border rounded px-4 !py-0 !h-[50px] text-base placeholder:text-lg focus:ring focus:ring-blue-200 focus:border-blue-400 transition"
                                                    >
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
                                                    <SelectTrigger
                                                        className="w-full border rounded px-4 !py-0 !h-[50px] text-base placeholder:text-lg focus:ring focus:ring-blue-200 focus:border-blue-400 transition"
                                                    >
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
                                                    <SelectTrigger
                                                        className="w-full border rounded px-4 !py-0 !h-[50px] text-base placeholder:text-lg focus:ring focus:ring-blue-200 focus:border-blue-400 transition"
                                                    >
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
                                                    <SelectTrigger
                                                        className="w-full border rounded px-4 !py-0 !h-[50px] text-base placeholder:text-lg focus:ring focus:ring-blue-200 focus:border-blue-400 transition"
                                                    >
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

                    {/* Language Tabs - Only for Translatable Fields */}
                    <Card className="!py-0 !px-0 border-none shadow-none">
                        <CardHeader className="!px-0 !py-0 gap-1">
                            <CardTitle className="text-lg font-semibold text-gray-900">Job Translations</CardTitle>
                            <CardDescription>Complete the translatable content for all three languages</CardDescription>
                        </CardHeader>
                        <CardContent className="!px-0 !py-0">
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
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

                    {/* Submit Button */}
                    <div className="flex justify-end gap-2">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            onClick={() => form.reset()}
                            className="h-14 cursor-pointer text-lg bg-primary-blue  text-white font-semibold rounded-full hover:bg-white hover:text-primary-blue border border-primary-blue"
                        >
                            <IoReload className="size-[30px]" />
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-fit px-14 h-14 cursor-pointer text-lg bg-primary-blue  text-white font-semibold rounded-full hover:bg-white hover:text-primary-blue border border-primary-blue"
                        >
                            {isSubmitting ? t("postingJob") : t("postJob")}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
