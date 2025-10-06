import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/prisma";
import { jobFormSchema } from "@/lib/schemas";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const createBodySchema = z.object({
    data: jobFormSchema,
});

export async function POST(req: Request) {
    try {
        const json = await req.json();
        const { data } = createBodySchema.parse(json);
        // Admin session check
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                {
                    success: false,
                    data: null,
                    message: "Unauthorized",
                },
                { status: 403 }
            );
        }

        const { staticFields, translations } = data;

        // Create Job + JobTranslation rows
        await db.job.create({
            data: {
                userId: session.user.id,
                websiteLink: staticFields.websiteLink || null,
                companyEmails: staticFields.companyEmails,
                translations: {
                    createMany: {
                        data: (["en", "es", "pt"] as const).map((lang) => {
                            const t = translations[lang];
                            return {
                                language: lang,
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
                            };
                        }),
                    },
                },
            },
            include: {
                translations: true,
            },
        });

        return NextResponse.json(
            {
                success: true,
                data: null,
                message: "Job created successfully",
            },
            { status: 201 }
        );
    } catch (err: any) {
        console.error("POST /api/jobs error:", err);

        // Zod -> send only ONE error message
        if (err?.name === "ZodError") {
            const firstIssue = err.issues?.[0];
            const field = firstIssue?.path?.join(".") || "payload";
            const msg = firstIssue?.message || "Invalid request data";
            return NextResponse.json(
                {
                    success: false,
                    data: null,
                    message: `${field}: ${msg}`,
                },
                { status: 400 }
            );
        }

        // Fallback
        return NextResponse.json(
            {
                success: false,
                data: null,
                message: "Internal Server Error",
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {

        // Admin session check
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                {
                    success: false,
                    data: null,
                    message: "Unauthorized",
                },
                { status: 403 }
            );
        }
        const jobs = await db.job.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                translations: true,
            },
        });

        return NextResponse.json(
            {
                success: true,
                data: jobs,
                message: "Jobs fetched successfully",
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("GET /api/jobs error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
