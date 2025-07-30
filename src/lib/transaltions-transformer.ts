import type { Language, JobTranslation } from "@prisma/client"

const enumTranslations = {
    HiresOutside: {
        en: { yes: "Yes", no: "No", sometimes: "Sometimes" },
        es: { yes: "Sí", no: "No", sometimes: "A veces" },
        pt: { yes: "Sim", no: "Não", sometimes: "Às vezes" },
    },
    JobType: {
        en: { full_time: "Full-time", part_time: "Part-time", contract: "Contract", temporary: "Temporary", internship: "Internship" },
        es: { full_time: "Tiempo completo", part_time: "Medio tiempo", contract: "Contrato", temporary: "Temporal", internship: "Pasantía" },
        pt: { full_time: "Tempo integral", part_time: "Meio período", contract: "Contrato", temporary: "Temporário", internship: "Estágio" },
    },
    JobSeason: {
        en: { spring: "Spring", summer: "Summer", fall: "Fall", winter: "Winter", year_round: "Year-round" },
        es: { spring: "Primavera", summer: "Verano", fall: "Otoño", winter: "Invierno", year_round: "Todo el año" },
        pt: { spring: "Primavera", summer: "Verão", fall: "Outono", winter: "Inverno", year_round: "Ano todo" },
    },
    TransportationHousing: {
        en: {
            provided: "Provided",
            not_provided: "Not provided",
            partial: "Partially provided",
            transportation_only: "Transportation only",
            housing_only: "Housing only",
        },
        es: {
            provided: "Proporcionado",
            not_provided: "No proporcionado",
            partial: "Parcialmente proporcionado",
            transportation_only: "Solo transporte",
            housing_only: "Solo alojamiento",
        },
        pt: {
            provided: "Fornecido",
            not_provided: "Não fornecido",
            partial: "Parcialmente fornecido",
            transportation_only: "Somente transporte",
            housing_only: "Somente moradia",
        },
    },
    OvertimeAvailability: {
        en: { available: "Available", not_available: "Not available", limited: "Limited" },
        es: { available: "Disponible", not_available: "No disponible", limited: "Limitado" },
        pt: { available: "Disponível", not_available: "Não disponível", limited: "Limitado" },
    },
    ProcessSpeed: {
        en: { fast: "Fast", medium: "Medium", slow: "Slow" },
        es: { fast: "Rápido", medium: "Medio", slow: "Lento" },
        pt: { fast: "Rápido", medium: "Médio", slow: "Lento" },
    },
    ApprovalEfficiency: {
        en: { high: "High", medium: "Medium", low: "Low" },
        es: { high: "Alta", medium: "Media", low: "Baja" },
        pt: { high: "Alta", medium: "Média", low: "Baixa" },
    },
} as const;

export function transformJobTranslationWithEnums(
    jobTranslation: JobTranslation,
    locale: Language
) {
    return {
        ...jobTranslation,
        translated: {
            hiresOutside: enumTranslations.HiresOutside[locale][jobTranslation.hiresOutside],
            jobType: enumTranslations.JobType[locale][jobTranslation.jobType],
            season: enumTranslations.JobSeason[locale][jobTranslation.season],
            transportationHousing: enumTranslations.TransportationHousing[locale][jobTranslation.transportationHousing],
            overtime: enumTranslations.OvertimeAvailability[locale][jobTranslation.overtime],
            processSpeed: enumTranslations.ProcessSpeed[locale][jobTranslation.processSpeed],
            approvalEfficiency: enumTranslations.ApprovalEfficiency[locale][jobTranslation.approvalEfficiency],
        },
    };
}
