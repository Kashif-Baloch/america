import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
    region: process.env.AWS_BUCKET_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const resumeLink = body?.resumeLink;

        if (!resumeLink || typeof resumeLink !== "string") {
            return NextResponse.json(
                { error: "Missing or invalid resumeLink" },
                { status: 400 }
            );
        }

        // Authenticate session
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Check if resumeLink belongs to user
        if (session.user.resumeLink !== resumeLink) {
            return NextResponse.json(
                { error: "Resume link mismatch or forbidden" },
                { status: 403 }
            );
        }

        // Check and extract S3 key
        if (resumeLink.includes("amazonaws.com")) {
            const key = resumeLink.split(".amazonaws.com/")[1];
            if (!key) {
                return NextResponse.json(
                    { error: "Could not extract key from resume link" },
                    { status: 400 }
                );
            }

            await s3.send(
                new DeleteObjectCommand({
                    Bucket: process.env.AWS_BUCKET_NAME!,
                    Key: key,
                })
            );
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("DELETE /api/resume error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
