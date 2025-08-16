import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const rawAmount = searchParams.get("price") || "0";
    const cleanedAmount = rawAmount.replace(/[^\d.]/g, "");
    const amount = parseFloat(cleanedAmount).toFixed(2);

    const merchantId = process.env.PAYU_MERCHANT_ID!;
    const accountId = process.env.PAYU_ACCOUNT_ID!;
    const apiKey = process.env.PAYU_API_KEY!;
    const currency = "COP";

    const referenceCode = `plan-${searchParams.get("name")}-${Date.now()}`;

    const signature = crypto
      .createHash("md5")
      .update(`${apiKey}~${merchantId}~${referenceCode}~${amount}~${currency}`)
      .digest("hex");

    const responseUrl = `${process.env.NEXT_PUBLIC_APP_URL}/payments/response`;
    const confirmationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/confirmation`;

    const htmlForm = `
      <html>
        <body onload="document.forms[0].submit()">
          <form method="post" action="https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/">
            <input type="hidden" name="merchantId" value="${merchantId}" />
            <input type="hidden" name="accountId" value="${accountId}" />
            <input type="hidden" name="description" value="${
              searchParams.get("description") || "Payment"
            }" />
            <input type="hidden" name="referenceCode" value="${referenceCode}" />
            <input type="hidden" name="amount" value="${amount}" />
            <input type="hidden" name="currency" value="${currency}" />
            <input type="hidden" name="signature" value="${signature}" />
            <input type="hidden" name="test" value="1" />
            <input type="hidden" name="responseUrl" value="${responseUrl}" />
            <input type="hidden" name="confirmationUrl" value="${confirmationUrl}" />
            <input type="hidden" name="tax" value="0" />
            <input type="hidden" name="taxReturnBase" value="0" />
          </form>
        </body>
      </html>
    `;

    return new NextResponse(htmlForm, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
