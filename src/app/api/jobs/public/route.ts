import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
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
        console.error("GET /api/public/jobs error:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
