import { z } from "zod"
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

export const jobTranslatableSchema = z.object({
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

export const jobStaticSchema = z.object({
    rating: z.nativeEnum(Rating),
    hiresOutside: z.nativeEnum(HiresOutside),
    jobType: z.nativeEnum(JobType),
    season: z.nativeEnum(JobSeason),
    transportationHousing: z.nativeEnum(TransportationHousing),
    overtime: z.nativeEnum(OvertimeAvailability),
    processSpeed: z.nativeEnum(ProcessSpeed),
    approvalEfficiency: z.nativeEnum(ApprovalEfficiency),
    websiteLink: z.string().url("Please enter a valid URL").or(z.literal("")).optional(),
    companyEmails: z.array(z.string().email("Please enter valid email addresses")).min(1, "At least one company email is required"),
})

export const jobFormSchema = z.object({
    staticFields: jobStaticSchema,
    translations: z.object({
        en: jobTranslatableSchema,
        es: jobTranslatableSchema,
        pt: jobTranslatableSchema,
    }),
})

export const languageLabels = {
    en: "English",
    es: "Español",
    pt: "Português",
}

export const ratingLabels = {
    [Rating.One]: "1 Star",
    [Rating.Two]: "2 Stars",
    [Rating.Three]: "3 Stars",
    [Rating.Four]: "4 Stars",
    [Rating.Five]: "5 Stars",
}

export const hiresOutsideLabels = {
    [HiresOutside.yes]: "Yes",
    [HiresOutside.no]: "No",
    [HiresOutside.sometimes]: "Sometimes",
}

export const jobTypeLabels = {
    [JobType.full_time]: "Full Time",
    [JobType.part_time]: "Part Time",
    [JobType.contract]: "Contract",
    [JobType.temporary]: "Temporary",
    [JobType.internship]: "Internship",
}

export const jobSeasonLabels = {
    [JobSeason.spring]: "Spring",
    [JobSeason.summer]: "Summer",
    [JobSeason.fall]: "Fall",
    [JobSeason.winter]: "Winter",
    [JobSeason.year_round]: "Year Round",
}

export const transportationHousingLabels = {
    [TransportationHousing.provided]: "Provided",
    [TransportationHousing.not_provided]: "Not Provided",
    [TransportationHousing.partial]: "Partial",
    [TransportationHousing.transportation_only]: "Transportation Only",
    [TransportationHousing.housing_only]: "Housing Only",
}

export const overtimeLabels = {
    [OvertimeAvailability.available]: "Available",
    [OvertimeAvailability.not_available]: "Not Available",
    [OvertimeAvailability.limited]: "Limited",
}

export const processSpeedLabels = {
    [ProcessSpeed.fast]: "Fast",
    [ProcessSpeed.medium]: "Medium",
    [ProcessSpeed.slow]: "Slow",
}

export const approvalEfficiencyLabels = {
    [ApprovalEfficiency.high]: "High",
    [ApprovalEfficiency.medium]: "Medium",
    [ApprovalEfficiency.low]: "Low",
}