import { join } from "path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { writeFile, unlink } from "fs/promises";
import { SubscriptionPlan } from "@prisma/client";
import { existsSync, mkdirSync } from "fs";

const OUTPUT_DIR = join(process.cwd(), "public/pdfs");

// Ensure output directory exists
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

interface TemplateData {
  title: string;
  content: string[];
  footer: string;
}

async function getTemplateData(plan: SubscriptionPlan): Promise<TemplateData> {
  // Customize this based on your subscription plans
  const baseData = {
    title: `Welcome to ${plan} Plan`,
    content: [
      "Thank you for subscribing to our service!",
      "Your subscription details:",
      `Plan: ${plan}`,
      "Start Date: " + new Date().toLocaleDateString(),
    ],
    footer: " 2025 Your Company. All rights reserved.",
  };

  if (plan === SubscriptionPlan.PRO_PLUS) {
    baseData.content.push(
      "You have access to all premium features!",
      "24/7 priority support included."
    );
  } else {
    baseData.content.push(
      "You now have access to all basic features.",
      "Upgrade to PRO_PLUS for additional benefits!"
    );
  }

  return baseData;
}

export async function generateWelcomePdf(
  plan: SubscriptionPlan
): Promise<string> {
  const outputFilename = `welcome-${Date.now()}-${plan.toLowerCase()}.pdf`;
  const outputPath = join(OUTPUT_DIR, outputFilename);

  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size in points
    const { height } = page.getSize();

    // Get the template data
    const templateData = await getTemplateData(plan);

    // Embed fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Set up text formatting
    const titleSize = 24;
    const textSize = 12;
    const margin = 50;
    let yPosition = height - margin - titleSize;

    // Draw title
    page.drawText(templateData.title, {
      x: margin,
      y: yPosition,
      size: titleSize,
      font: boldFont,
      color: rgb(0, 0, 0.8),
    });

    yPosition -= 40; // Add some space after title

    // Draw content lines
    for (const line of templateData.content) {
      page.drawText(line, {
        x: margin,
        y: yPosition,
        size: textSize,
        font,
        color: rgb(0, 0, 0),
      });
      yPosition -= 20; // Line height
    }

    // Draw footer
    page.drawText(templateData.footer, {
      x: margin,
      y: 30,
      size: 10,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });

    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    await writeFile(outputPath, pdfBytes);

    console.log(`PDF generated successfully at ${outputPath}`);
    return `/pdfs/${outputFilename}`;
  } catch (error) {
    console.error("Error generating PDF:", error);

    // Clean up partially created file if it exists
    try {
      if (existsSync(outputPath)) {
        await unlink(outputPath);
      }
    } catch (cleanupError) {
      console.error("Error cleaning up failed PDF:", cleanupError);
    }

    throw new Error(
      `Failed to generate welcome PDF: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export async function cleanupOldPdfs(daysToKeep: number = 7) {
  // Implementation for cleaning up old PDFs
  // Note: This is a placeholder - implement actual cleanup logic as needed
  console.log(
    `Cleanup of PDFs older than ${daysToKeep} days would happen here`
  );
}
