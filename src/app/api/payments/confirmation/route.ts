import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const referenceCode = searchParams.get("referenceCode");
  const status = searchParams.get("status");

  console.log("referenceCode", referenceCode);
  console.log("status", status);

  if (!referenceCode || !status) {
    return NextResponse.json(
      {
        error: "Missing referenceCode or status",
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    status,
  });
}
