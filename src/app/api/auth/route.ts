import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    data: {
      token: `mock-token-${Date.now()}`
    },
    message: "Mock auth endpoint"
  });
}
