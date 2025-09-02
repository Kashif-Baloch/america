import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const h = await headers();

    const session = await auth.api.getSession({ headers: h });
    if (!session?.user) {
        return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
    }

    const subscription = await db.subscription.findUnique({
        where: { userId: session.user.id },
        include: {
            consultations: true,
        },
    });

    if (!subscription) {
        return NextResponse.json(
            { message: "No subscription found for this user", success: false },
            { status: 404 }
        );
    }

    return NextResponse.json({
        data: { subscription },
        success: true,
        message: "200 OK"
    }, { status: 200 });
}

