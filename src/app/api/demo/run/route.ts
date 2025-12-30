import { NextResponse } from "next/server";
import { Pipeline_demo } from "@/lib/demo/pipeline";

export async function POST() {
  try {
    const session = await Pipeline_demo();
    return NextResponse.json({ 
      success: true, 
      sessionId: session.id,
      session 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

