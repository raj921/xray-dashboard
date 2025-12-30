"use client";

import { XraySession } from "@/lib/xray/types";
import { cn } from "@/lib/utils";
import { Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface SessionListProps {
  sessions: XraySession[];
  selectedId?: string;
  onSelect: (session: XraySession) => void;
}

export function SessionList({ sessions, selectedId, onSelect }: SessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="bento-item text-center py-8">
        <p className="opacity-60">No sessions yet.</p>
        <p className="text-sm opacity-40 mt-2">Run the demo to create one.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sessions.map((session) => (
        <button
          key={session.id}
          onClick={() => onSelect(session)}
          className={cn(
            "bento-item w-full text-left cursor-pointer transition-all",
            selectedId === session.id && "border-[#0f0] bg-[#0f0]/10"
          )}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <StatusIcon status={session.status} />
              <div className="min-w-0">
                <h3 className="text-lg truncate">{">"} {session.name}</h3>
                <p className="text-sm opacity-60 truncate">
                  {session.metadata?.referenceTitle as string || "No reference"}
                </p>
              </div>
            </div>
            <div className="text-right text-sm opacity-60 shrink-0">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTime(session.startedAt)}
              </div>
              <div>{session.steps.length} steps</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function StatusIcon({ status }: { status: XraySession["status"] }) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="w-5 h-5 terminal-status-ok shrink-0" />;
    case "failed":
      return <XCircle className="w-5 h-5 terminal-status-error shrink-0" />;
    case "running":
      return <Loader2 className="w-5 h-5 animate-spin shrink-0" />;
  }
}

function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

