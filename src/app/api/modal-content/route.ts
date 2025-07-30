import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        const { page, content } = await req.json();

        if (!page || typeof content !== "object") {
            return NextResponse.json(
                { error: "Missing or invalid 'page' or 'content'." },
                { status: 400 }
            );
        }

        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized: ADMIN access required." },
                { status: 403 }
            );
        }

        const updated = await db.modalContent.upsert({
            where: { page },
            update: { ...content },
            create: {
                page,
                en: content.en || {},
                es: content.es || {},
                pt: content.pt || {},
            },
        });

        return NextResponse.json(updated, { status: 200 });

    } catch (error) {
        console.error("ModalContent POST Error:", error);
        return NextResponse.json(
            { error: "Internal server error. Please try again." },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page");

    if (!page) {
        return NextResponse.json({ error: "Missing page" }, { status: 400 });
    }

    const data = await db.modalContent.findUnique({
        where: { page },
    });

    return NextResponse.json(data);
}