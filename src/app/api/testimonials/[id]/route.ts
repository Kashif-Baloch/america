import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";


const s3 = new S3Client({
    region: process.env.AWS_BUCKET_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

// Validation schema
const TestimonialSchema = z.object({
    name: z.string().min(1),
    country: z.string().min(1),
    flag: z.string().min(1),
    image: z.string().url(),
    text: z.object({
        en: z.string().min(1),
        es: z.string().min(1),
        pt: z.string().min(1),
    }),
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    try {
        // Check if user is admin
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const parsed = TestimonialSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", issues: parsed.error.format() },
                { status: 400 }
            );
        }

        const data = parsed.data;

        const updated = await db.testimonial.update({
            where: { id: id },
            data: {
                name: data.name,
                country: data.country,
                flag: data.flag,
                image: data.image,
                textEn: data.text.en,
                textEs: data.text.es,
                textPt: data.text.pt,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("PUT /api/testimonials/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params

        // Check if user is admin
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const testi = await db.testimonial.findFirst({
            where: { id: id },
        })

        if (!testi) {
            return NextResponse.json(
                { error: "Not found" },
                { status: 404 }
            );
        }

        // Delete category image from S3
        if (testi.image && testi.image.includes("amazonaws.com")) {
            const imageKey = testi.image.split(".amazonaws.com/")[1];
            await s3.send(
                new DeleteObjectCommand({
                    Bucket: process.env.AWS_BUCKET_NAME!,
                    Key: imageKey,
                })
            );
        }

        await db.testimonial.delete({
            where: { id: id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("DELETE /api/testimonials/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
