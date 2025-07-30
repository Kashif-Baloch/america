import { ApprovalEfficiency, HiresOutside, JobSeason, JobType, OvertimeAvailability, ProcessSpeed, Rating, TransportationHousing } from "@prisma/client"

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