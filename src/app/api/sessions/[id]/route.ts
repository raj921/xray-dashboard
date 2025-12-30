import { NextResponse } from "next/server";
import { xrayStore } from "@/lib/xray";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = xrayStore.get(id);
  
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }
  
  return NextResponse.json({ session });
}