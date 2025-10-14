"use server";

import { SubscriptionPlan } from "@prisma/client";
import transporter from "@/lib/nodemailer";
// import { generateWelcomePdf } from "@/lib/pdf-generator";
// import path from "path";

type EmailAttachment = {
  filename: string;
  path?: string;
  content?: Buffer | string;
  contentType?: string;
};

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
  attachments?: EmailAttachment[];
};

export async function sendEmailAction(params: SendEmailParams) {
  const { to, subject, html, attachments = [] } = params;

  const mailOptions = {
    from: `"America Working" <${process.env.NODEMAILER_USER}>`,
    to,
    subject: `America Working - ${subject}`,
    html,
    attachments: attachments.length > 0 ? attachments : undefined,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: "Failed to send email" };
  }
}

export async function sendGiftInvitationEmail(params: {
  to: string;
  giverName: string;
  plan: SubscriptionPlan;
  signupUrl: string;
}) {
  const { to, giverName, plan, signupUrl } = params;

  console.log("Sending gift invitation email to:", to);

  const subject = "🎁 Has recibido un regalo de suscripción";
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>¡Tienes un regalo de ${giverName}!</h2>
      <p>Has recibido una suscripción <strong>${plan}</strong> en America Working.</p>
      <p>Crea tu cuenta o inicia sesión con este mismo correo para activar tu plan.</p>
      <div style="text-align:center; margin: 24px 0;">
        <a href="${signupUrl}" style="display:inline-block;padding:12px 20px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">Crear cuenta</a>
      </div>
      <p>Si ya tienes cuenta, inicia sesión y tu suscripción se activará automáticamente.</p>
      <p style="color:#666;font-size:12px;">Si no solicitaste este correo, puedes ignorarlo.</p>
    </body>
    </html>
  `;

  return sendEmailAction({ to, subject, html });
}
// For subscription welcome emails
export async function sendSubscriptionWelcomeEmail(params: {
  to: string;
  userName: string;
  plan: SubscriptionPlan;
}) {
  const { to, userName, plan } = params;
  const isProPlus = plan === SubscriptionPlan.PRO_PLUS;

  try {
    // Generate the welcome PDF
    // const pdfPath = await generateWelcomePdf(plan);

    // const absolutePdfPath = path.join(process.cwd(), "public", pdfPath);

    const subject = isProPlus
      ? "🎉 Welcome to PRO+ - Your Premium Membership is Active!"
      : "🎉 Welcome to PRO - Your Membership is Active!";

    const html = getSubscriptionEmailTemplate(userName, plan);

    await sendEmailAction({
      to,
      subject,
      html,
      // attachments: [
      //   {
      //     filename: isProPlus
      //       ? "PRO-Plus-Welcome-Guide.pdf"
      //       : "PRO-Welcome-Guide.pdf",
      //     path: absolutePdfPath,
      //     contentType: "application/pdf",
      //   },
      // ],
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending subscription welcome email:", error);
    return { success: false, error: "Failed to send welcome email" };
  }
}

function getSubscriptionEmailTemplate(
  userName: string,
  plan: SubscriptionPlan
): string {
  const isProPlus = plan === SubscriptionPlan.PRO_PLUS;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .content { margin-bottom: 30px; }
        .footer { margin-top: 30px; font-size: 0.9em; color: #666; text-align: center; }
        .button {
          display: inline-block; 
          padding: 12px 24px; 
          background-color: #2563eb; 
          color: white; 
          text-decoration: none; 
          border-radius: 4px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Welcome to America Working ${plan}, ${userName}!</h1>
      </div>
      
      <div class="content">
        <p>Thank you for subscribing to our ${plan} plan. We're excited to have you on board!</p>
        
        <p>Your subscription includes:</p>
        <ul>
          <li>${
            isProPlus ? "Unlimited job searches" : "Limited job searches"
          }</li>
          <li>Access to detailed job information</li>
          ${isProPlus ? "<li>Free 30-minute consultation session</li>" : ""}
          <li>Priority customer support</li>
        </ul>
        
        <p>We've attached a welcome guide with more information about your subscription benefits.</p>
        
        <div style="text-align: center;">
          <a href="${
            process.env.NEXT_PUBLIC_APP_URL
          }/settings" class="button">Go to Dashboard</a>
        </div>
      </div>
      
      <div class="footer">
        <p>If you have any questions, please contact our support team at support@americaworking.com</p>
        <p>© 2025 America Working. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
}
