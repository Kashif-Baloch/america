import { SubscriptionPlan } from '@prisma/client';
// import { generateWelcomePdf } from './pdf-generator';
import transporter from './nodemailer';
// import path from 'path';

interface SendWelcomeEmailParams {
  to: string;
  userName: string;
  plan: SubscriptionPlan;
}

export async function sendSubscriptionWelcomeEmail({
  to,
  userName,
  plan,
}: SendWelcomeEmailParams) {
  try {
    // Generate the welcome PDF
    // const pdfPath = await generateWelcomePdf(to, plan);
    // const absolutePdfPath = path.join(process.cwd(), 'public', pdfPath);

    // Determine email subject and template based on plan
    const isProPlus = plan === 'PRO_PLUS';
    const subject = isProPlus
      ? '🎉 Welcome to PRO+ - Your Premium Membership is Active!'
      : '🎉 Welcome to PRO - Your Membership is Active!';

    // Send the email with PDF attachment
    await transporter.sendMail({
      from: `"Job Platform" <${process.env.NODEMAILER_USER}>`,
      to,
      subject,
      html: getEmailTemplate(userName, plan),
      // attachments: [
      //   {
      //     filename: isProPlus ? 'PRO-Plus-Welcome-Guide.pdf' : 'PRO-Welcome-Guide.pdf',
      //     path: absolutePdfPath,
      //     contentType: 'application/pdf',
      //   },
      // ],
    });

    console.log(`Welcome email sent to ${to} with ${plan} guide`);
    return { success: true };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new Error('Failed to send welcome email');
  }
}

function getEmailTemplate(userName: string, plan: SubscriptionPlan): string {
  const isProPlus = plan === 'PRO_PLUS';

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
        <h1>Welcome to ${plan}, ${userName}!</h1>
      </div>
      
      <div class="content">
        <p>Thank you for subscribing to our ${plan} plan. We're excited to have you on board!</p>
        
        <p>Your subscription includes:</p>
        <ul>
          <li>${isProPlus ? 'Unlimited job searches' : 'Limited job searches'}</li>
          <li>Access to detailed job information</li>
          ${isProPlus ? '<li>Free 30-minute consultation session</li>' : ''}
          <li>Priority customer support</li>
        </ul>
        
        <p>We've attached a welcome guide with more information about your subscription benefits.</p>
        
        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Go to Dashboard</a>
        </div>
      </div>
      
      <div class="footer">
        <p>If you have any questions, please contact our support team at support@jobplatform.com</p>
        <p>© 2025 Job Platform. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
}
