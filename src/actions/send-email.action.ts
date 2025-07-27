"use server";

import transporter from "@/lib/nodemailer";



export async function sendEmailAction({
    to,
    subject,
    meta,
}: {
    to: string;
    subject: string;
    meta: {
        html: string;
    };
}) {
    const mailOptions = {
        from: process.env.NODEMAILER_USER,
        to,
        subject: `America Working - ${subject}`,
        html: meta.html
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (err) {
        console.error("[SendEmail]:", err);
        return { success: false };
    }
}