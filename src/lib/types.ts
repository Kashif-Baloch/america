import type { Prisma } from "@prisma/client";
import { ApprovalEfficiency, HiresOutside, JobSeason, JobType, OvertimeAvailability, ProcessSpeed, Rating, TransportationHousing } from "@prisma/client";

export type JobWithTranslations = Prisma.JobGetPayload<{
    include: { translations: true }
}>;



export interface JobTranslatableFields {
    title: string
    company: string
    salary: string
    location: string
    requirements: string
    phoneNumber: string
    legalProcess: string
    processDuration: string
    approvalRate: string
    employeesHired: string
    visaEmployees: string
    certifications: string
}

export interface JobStaticFields {
    rating: Rating
    hiresOutside: HiresOutside
    jobType: JobType
    season: JobSeason
    transportationHousing: TransportationHousing
    overtime: OvertimeAvailability
    processSpeed: ProcessSpeed
    approvalEfficiency: ApprovalEfficiency
}

export interface JobFormData {
    staticFields: JobStaticFields
    translations: {
        en: JobTranslatableFields
        es: JobTranslatableFields
        pt: JobTranslatableFields
    }
}

export type ApiResponse<T> = {
    success: boolean;
    data: T | null;
    message: string;
};

export type Plan = "NONE" | "FREE" | "BASIC" | "PRO" | "PRO_PLUS";

export type SubscriptionMe = {
    plan: Plan;
};
