import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const p = path.join(process.cwd(), "data", "sample-products.json");
    const raw = fs.readFileSync(p, "utf-8");
    const data = JSON.parse(raw);
    return NextResponse.json({ data, source: "mock" });
  } catch (error) {
    return NextResponse.json({ data: [], error: String(error) }, { status: 500 });
  }
}
