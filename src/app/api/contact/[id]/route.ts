import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface Params {
    params: Promise<{ id: string }>;
}

export async function DELETE(req: Request, { params }: Params) {
    const { id } = await params;

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

        await db.contactSubmission.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: "Submission deleted successfully",
        });
    } catch (error) {
        console.error("❌ Error deleting submission:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete submission" },
            { status: 500 }
        );
    }
}
