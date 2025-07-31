import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import type { Testimonial } from "@prisma/client"
// Schema validation
const TestimonialSchema = z.object({
    name: z.string().min(1, "Name is required"),
    country: z.string().min(1, "Country is required"),
    flag: z.string().min(1, "Flag is required"),
    image: z.string().url("Image must be a valid URL"),
    text: z.object({
        en: z.string().min(1, "English text is required"),
        es: z.string().min(1, "Spanish text is required"),
        pt: z.string().min(1, "Portuguese text is required"),
    }),
});

export async function GET() {
    try {
        const testimonials = await db.testimonial.findMany({
            orderBy: { createdAt: "desc" },
        });

        const transformed = testimonials.map((item: Testimonial) => ({
            id: item.id,
            name: item.name,
            country: item.country,
            flag: item.flag,
            image: item.image,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            text: {
                en: item.textEn,
                es: item.textEs,
                pt: item.textPt,
            },
        }));

        return NextResponse.json(transformed);
    } catch (error) {
        console.error("GET /api/testimonials error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    // Admin session check
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const parseResult = TestimonialSchema.safeParse(body);

    if (!parseResult.success) {
        return NextResponse.json(
            { error: "Validation failed", issues: parseResult.error.format() },
            { status: 400 }
        );
    }

    const testimonial = await db.testimonial.create({
        data: {
            name: body.name,
            country: body.country,
            flag: body.flag,
            image: body.image,
            textEn: body.text.en,
            textEs: body.text.es,
            textPt: body.text.pt,
        },
    });
    return NextResponse.json(testimonial);
}
