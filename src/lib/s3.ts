"use server"

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuid } from "uuid";
import { auth } from "./auth";
import { headers } from "next/headers";

const s3 = new S3Client({
    region: process.env.AWS_BUCKET_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

const acceptedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
]

const maxFileSize = 1024 * 1024 * 5

// ✅ Utility: Make name SEO-friendly and unique
function toSeoUniqueName(baseName: string, type: string): string {
    const extension = type.split("/")[1];
    const sanitizedBase = baseName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, "")
        .substring(0, 80);

    return `${sanitizedBase}.${extension}`;
}

export async function getSignedURL(
    type: string,
    size: number,
    checksum: string,
    name?: string // Optional image name
) {


    // Admin session check
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user || session.user.role !== "ADMIN") {
        return {
            success: false,
            error: "Unauthorized!"
        }
    }

    if (!acceptedTypes.includes(type)) {
        return {
            success: false,
            error: "Invalid File Type"
        }
    }
    if (size > maxFileSize) {
        return {
            success: false,
            error: "File too large"
        }
    }

    console.log("Variables", { 1: process.env.AWS_BUCKET_REGION!, 2: process.env.AWS_BUCKET_ACCESS_KEY! })

    const seoName = name
        ? toSeoUniqueName(name, type)
        : `${uuid()}-${uuid()}.${type.split("/")[1]}`;

    const key = `${seoName}`;

    const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        ContentType: type,
        ContentLength: size,
        ChecksumSHA256: checksum,
        CacheControl: "public, max-age=31536000, immutable",
        Metadata: {
            userId: session.user.id,
        }
    });

    const signedURL = await getSignedUrl(s3, putObjectCommand, {
        expiresIn: 60
    })

    return { success: true, data: { url: signedURL } }
}

// ✅ Utility: Make name SEO-friendly and unique for PDFs
function toSeoUniquePDFName(baseName: string): string {
    const sanitizedBase = baseName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, "")
        .substring(0, 80);

    return `${sanitizedBase}.pdf`;
}

const maxPDFSize = 1024 * 1024 * 10; // 10 MB
const acceptedPDFType = "application/pdf";

export async function getSignedPDFUrl(
    type: string,
    size: number,
    checksum: string,
    name?: string
) {

    if (type !== acceptedPDFType) {
        return {
            success: false,
            error: "Only PDF files are allowed!",
        };
    }

    if (size > maxPDFSize) {
        return {
            success: false,
            error: "PDF file too large",
        };
    }

    const seoName = name
        ? toSeoUniquePDFName(name)
        : `${uuid()}-${uuid()}.pdf`;

    const key = `${seoName}`;

    const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        ContentType: type,
        ContentLength: size,
        ChecksumSHA256: checksum,
        CacheControl: "public, max-age=31536000, immutable",
        Metadata: {
            key
        },
    });

    const signedURL = await getSignedUrl(s3, putObjectCommand, {
        expiresIn: 60,
    });

    return { success: true, data: { url: signedURL } };
}