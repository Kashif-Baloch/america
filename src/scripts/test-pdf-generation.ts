import { SubscriptionPlan } from "@prisma/client";
import { generateWelcomePdf } from "../lib/pdf-generator";

async function testPdfGeneration() {
  try {
    console.log("Testing PDF generation for PRO plan...");
    const proPdfPath = await generateWelcomePdf(
      "test@example.com",
      SubscriptionPlan.PRO
    );
    console.log(`PRO PDF generated at: ${proPdfPath}`);

    console.log("\nTesting PDF generation for PRO+ plan...");
    const proPlusPdfPath = await generateWelcomePdf(
      "test@example.com",
      SubscriptionPlan.PRO_PLUS
    );
    console.log(`PRO+ PDF generated at: ${proPlusPdfPath}`);

    console.log("\n✅ PDF generation tests completed successfully!");
  } catch (error) {
    console.error("❌ Error during PDF generation test:", error);
    process.exit(1);
  }
}

testPdfGeneration();
