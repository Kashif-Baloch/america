// /app/api/payments/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Parse & sanitize amount -> amount in cents (integer)
    const rawAmount = "1500.000 COP";
    // const rawAmount = searchParams.get("price") || "0";
    // console.log(rawAmount);
    const cleanedAmount = rawAmount.replace(/[^\d.]/g, "");
    const amountFloat = parseFloat(cleanedAmount || "0");
    const amountInCents = Math.round(amountFloat * 100);

    const currency = "COP";
    const nameParam = searchParams.get("name") || "plan";
    const description = searchParams.get("description") || "Payment";
    const reference = `plan-${nameParam}-${Date.now()}`;

    const session = await auth.api.getSession({ headers: await headers() });
    const customerEmail =
      session?.user?.email || searchParams.get("email") || "";
    const giftRecipient = searchParams.get("giftRecipient") || "";

    const publicKey = process.env.WOMPI_PUBLIC_KEY;
    const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;
    const checkoutBase =
      process.env.WOMPI_INTEGRATION_URL || "https://checkout.wompi.co/p/";

    if (!publicKey) {
      console.error("Missing env WOMPI_PUBLIC_KEY");
      return NextResponse.json(
        { error: "Missing env WOMPI_PUBLIC_KEY. Set it in your environment." },
        { status: 500 }
      );
    }
    if (!integritySecret) {
      console.error("Missing env WOMPI_INTEGRITY_SECRET");
      return NextResponse.json(
        {
          error:
            "Missing env WOMPI_INTEGRITY_SECRET. Obtain the integrity secret from your Wompi dashboard (Developers > Secrets).",
        },
        { status: 500 }
      );
    }

    // IMPORTANT: Wompi expects a SHA256 hex of <reference><amount><currency><integritySecret>
    const concat = `${reference}${amountInCents}${currency}${integritySecret}`;
    const signatureIntegrity = crypto
      .createHash("sha256")
      .update(concat)
      .digest("hex");

    // Build HTML form (Web Checkout uses GET)
    const redirectParams = new URLSearchParams();
    redirectParams.set("debug", "1");
    redirectParams.set("email", customerEmail);
    if (giftRecipient) redirectParams.set("giftRecipient", giftRecipient);
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || ""}/payments/response?${redirectParams.toString()}`;

    // If you want to inspect the final URL instead of auto-redirecting, add ?debug=1
    if (searchParams.get("debug") === "1") {
      // Build query string for debug
      const params = new URLSearchParams();
      params.set("public-key", publicKey);
      params.set("currency", currency);
      params.set("amount-in-cents", String(amountInCents));
      params.set("reference", reference);
      params.set("signature:integrity", signatureIntegrity);
      params.set("redirect-url", redirectUrl);
      params.set("description", description);
      params.set("customer-data[email]", customerEmail);
      params.set("customer-data[full_name]", "User");

      return NextResponse.json({
        checkoutUrl: `${checkoutBase}?${params.toString()}`,
      });
    }

    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>Redirecting to Wompi...</title>
  </head>
  <body onload="document.forms[0].submit()">
    <form action="${checkoutBase}" method="GET">
      <input type="hidden" name="public-key" value="${publicKey}" />
      <input type="hidden" name="currency" value="${currency}" />
      <input type="hidden" name="amount-in-cents" value="${amountInCents}" />
      <input type="hidden" name="reference" value="${reference}" />
      <input type="hidden" name="signature:integrity" value="${signatureIntegrity}" />
      <input type="hidden" name="redirect-url" value="${redirectUrl}" />
      <input type="hidden" name="description" value="${description}" />
      <input type="hidden" name="customer-data[email]" value="${customerEmail}" />
      <input type="hidden" name="customer-data[full_name]" value="User" />
      <noscript>
        <p>JavaScript is disabled — click the button to continue to the payment page.</p>
        <button type="submit">Pagar con Wompi</button>
      </noscript>
    </form>
  </body>
</html>`;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
