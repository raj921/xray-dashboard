import { NextResponse } from "next/server";
import { xrayStore } from "@/lib/xray";

export async function GET() {
  const sessions = xrayStore.getAll();
  const sorted = sessions.sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );
  return NextResponse.json({ sessions: sorted });
}
