import { NextResponse } from "next/server";
import { loadProblems, databaseProblemsEnabled } from "@/lib/api/problems";

export async function GET() {
  if (!databaseProblemsEnabled) {
    return NextResponse.json({ problems: [] });
  }
  try {
    const problems = await loadProblems();
    return NextResponse.json({ problems });
  } catch {
    return NextResponse.json({ problems: [] }, { status: 500 });
  }
}
