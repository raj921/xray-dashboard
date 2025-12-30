"use client";

import { XrayStep } from "@/lib/xray/types";
import { cn } from "@/lib/utils";
import { 
  Brain, 
  Search, 
  Filter, 
  ArrowRightLeft, 
  Medal, 
  Cog,
  CheckCircle2,
  XCircle,
  Loader2
} from "lucide-react";

interface StepTimelineProps {
  steps: XrayStep[];
  selectedStepId?: string;
  onSelectStep: (step: XrayStep) => void;
}

export function StepTimeline({ steps, selectedStepId, onSelectStep }: StepTimelineProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <button
            onClick={() => onSelectStep(step)}
            className={cn(
              "flex flex-col items-center gap-2 p-4 border transition-all min-w-[120px]",
              "hover:bg-[#0f0]/10 hover:border-[#0f0]",
              selectedStepId === step.id 
                ? "border-[#0f0] bg-[#0f0]/10" 
                : "border-[#0f0]/30 bg-black/50"
            )}
          >
            <div className="relative">
              <StepTypeIcon type={step.type} />
              <div className="absolute -bottom-1 -right-1">
                <StepStatusIcon status={step.status} />
              </div>
            </div>
            <span className="text-xs text-center truncate w-full">{step.name}</span>
            {step.completedAt && step.startedAt && (
              <span className="text-[10px] opacity-50">
                {getDuration(step.startedAt, step.completedAt)}
              </span>
            )}
          </button>
          {index < steps.length - 1 && (
            <div className="w-8 h-[2px] bg-[#0f0]/30 mx-1" />
          )}
        </div>
      ))}
    </div>
  );
}

function StepTypeIcon({ type }: { type: XrayStep["type"] }) {
  const iconClass = "w-8 h-8";
  switch (type) {
    case "llm":
      return <Brain className={iconClass} />;
    case "search":
      return <Search className={iconClass} />;
    case "filter":
      return <Filter className={iconClass} />;
    case "transform":
      return <ArrowRightLeft className={iconClass} />;
    case "rank":
      return <Medal className={iconClass} />;
    case "custom":
      return <Cog className={iconClass} />;
  }
}

function StepStatusIcon({ status }: { status: XrayStep["status"] }) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="w-4 h-4 terminal-status-ok" />;
    case "failed":
      return <XCircle className="w-4 h-4 terminal-status-error" />;
    case "running":
      return <Loader2 className="w-4 h-4 animate-spin" />;
  }
}

function getDuration(start: Date | string, end: Date | string): string {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

