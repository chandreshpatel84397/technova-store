import { NextResponse } from "next/server";
import { products } from "@/mock/products";

export async function GET() {
  return NextResponse.json({
    data: products,
    message: "Products loaded"
  });
}
