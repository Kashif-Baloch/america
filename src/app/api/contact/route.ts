import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, subject, message } = body;

        if (!name || !email || !phone || !subject || !message) {
            return NextResponse.json({
                error: {
                    en: "All fields are required",
                    de: "Alle Felder sind erforderlich",
                    pt: "Todos os campos são obrigatórios",
                },
            }, { status: 400 });
        }

        const submission = await db.contactSubmission.create({
            data: { name, email, phone, subject, message },
        });

        return NextResponse.json({
            success: true, submission
        });
    } catch (error) {
        console.error("❌ Error saving contact submission:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
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
                    message: "Unauthorized",
                },
                { status: 403 }
            );
        }

        const submissions = await db.contactSubmission.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ success: true, submissions });
    } catch (error) {
        console.error("❌ Error fetching submissions:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch submissions" },
            { status: 500 }
        );
    }
}