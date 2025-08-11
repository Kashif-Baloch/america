import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { jobFormSchema } from "@/lib/schemas";
import { Language } from "@prisma/client";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { success: false, data: null, message: "Unauthorized" },
                { status: 403 }
            );
        }

        await db.job.delete({
            where: { id: id },
        });

        return NextResponse.json(
            { success: true, data: null, message: "Job deleted successfully" },
            { status: 200 }
        );
    } catch (err) {
        console.error("DELETE /api/jobs/[id] error:", err);
        return NextResponse.json(
            { success: false, data: null, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

const updateBodySchema = z.object({
    data: jobFormSchema,
});

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const json = await req.json();
        const { data } = updateBodySchema.parse(json);

        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { success: false, data: null, message: "Unauthorized" },
                { status: 403 }
            );
        }

        const { staticFields, translations } = data;

        // Ensure job exists
        const existing = await db.job.findUnique({ where: { id: id } });
        if (!existing) {
            return NextResponse.json(
                { success: false, data: null, message: "Job not found" },
                { status: 404 }
            );
        }

        await db.job.update({
            where: { id: id },
            data: {
                translations: {
                    upsert: (["en", "es", "pt"] as const).map((lang) => {
                        const t = translations[lang];
                        // Composite unique for upsert:
                        return {
                            where: { jobId_language: { jobId: id, language: lang as Language } },
                            create: {
                                language: lang as Language,
                                title: t.title,
                                company: t.company,
                                salary: t.salary,
                                location: t.location,
                                rating: staticFields.rating,
                                hiresOutside: staticFields.hiresOutside,
                                requirements: t.requirements,
                                jobType: staticFields.jobType,
                                season: staticFields.season,
                                transportationHousing: staticFields.transportationHousing,
                                phoneNumber: t.phoneNumber,
                                overtime: staticFields.overtime,
                                legalProcess: t.legalProcess,
                                processDuration: t.processDuration,
                                approvalRate: t.approvalRate,
                                employeesHired: t.employeesHired,
                                processSpeed: staticFields.processSpeed,
                                approvalEfficiency: staticFields.approvalEfficiency,
                                visaEmployees: t.visaEmployees,
                                certifications: t.certifications,
                            },
                            update: {
                                title: t.title,
                                company: t.company,
                                salary: t.salary,
                                location: t.location,
                                rating: staticFields.rating,
                                hiresOutside: staticFields.hiresOutside,
                                requirements: t.requirements,
                                jobType: staticFields.jobType,
                                season: staticFields.season,
                                transportationHousing: staticFields.transportationHousing,
                                phoneNumber: t.phoneNumber,
                                overtime: staticFields.overtime,
                                legalProcess: t.legalProcess,
                                processDuration: t.processDuration,
                                approvalRate: t.approvalRate,
                                employeesHired: t.employeesHired,
                                processSpeed: staticFields.processSpeed,
                                approvalEfficiency: staticFields.approvalEfficiency,
                                visaEmployees: t.visaEmployees,
                                certifications: t.certifications,
                            },
                        };
                    }),
                },
            },
            include: { translations: true },
        });

        return NextResponse.json(
            { success: true, data: null, message: "Job updated successfully" },
            { status: 200 }
        );
    } catch (err: any) {
        console.error("PUT /api/jobs/[id] error:", err);

        if (err?.name === "ZodError") {
            const firstIssue = err.issues?.[0];
            const field = firstIssue?.path?.join(".") || "payload";
            const msg = firstIssue?.message || "Invalid request data";
            return NextResponse.json(
                { success: false, data: null, message: `${field}: ${msg}` },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, data: null, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
