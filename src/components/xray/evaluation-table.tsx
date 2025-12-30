"use client";

import { Evaluation, CriteriaResult } from "@/lib/xray/types";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckCircle2, XCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface EvaluationTableProps {
  evaluations: Evaluation[];
}

export function EvaluationTable({ evaluations }: EvaluationTableProps) {
  const passed = evaluations.filter((e) => e.passed).length;
  const failed = evaluations.length - passed;

  return (
    <div className="bento-item">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg">{">"} EVALUATIONS</h3>
        <div className="flex items-center gap-4 text-sm">
          <span className="terminal-status-ok">✓ {passed} passed</span>
          <span className="terminal-status-error">✗ {failed} failed</span>
        </div>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {evaluations.map((evaluation) => (
          <EvaluationRow key={evaluation.id} evaluation={evaluation} />
        ))}
      </div>
    </div>
  );
}

function EvaluationRow({ evaluation }: { evaluation: Evaluation }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div
        className={cn(
          "border p-3 transition-all",
          evaluation.passed 
            ? "border-[#0f0]/30 bg-[#0f0]/5" 
            : "border-red-500/30 bg-red-500/5"
        )}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
          <div className="flex items-center gap-3 min-w-0">
            {evaluation.passed ? (
              <CheckCircle2 className="w-5 h-5 terminal-status-ok shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 terminal-status-error shrink-0" />
            )}
            <span className="truncate">{evaluation.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs opacity-50">
              {evaluation.criteria.filter((c) => c.passed).length}/{evaluation.criteria.length}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="mt-3 space-y-2 pl-8">
            {evaluation.criteria.map((criterion, idx) => (
              <CriteriaRow key={idx} criterion={criterion} />
            ))}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

function CriteriaRow({ criterion }: { criterion: CriteriaResult }) {
  return (
    <div
      className={cn(
        "text-sm p-2 border-l-2",
        criterion.passed 
          ? "border-[#0f0]/50 bg-[#0f0]/5" 
          : "border-red-500/50 bg-red-500/5"
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        {criterion.passed ? (
          <CheckCircle2 className="w-3 h-3 terminal-status-ok" />
        ) : (
          <XCircle className="w-3 h-3 terminal-status-error" />
        )}
        <span className="font-medium">{criterion.name}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs opacity-70 ml-5">
        <div>
          <span className="opacity-50">Expected:</span> {criterion.expected}
        </div>
        <div>
          <span className="opacity-50">Actual:</span> {criterion.actual}
        </div>
      </div>
      <p className="text-xs opacity-60 mt-1 ml-5">{criterion.detail}</p>
    </div>
  );
}

