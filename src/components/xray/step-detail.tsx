"use client";

import { XrayStep } from "@/lib/xray/types";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, MessageSquare, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { useState } from "react";

interface StepDetailProps {
  step: XrayStep;
}

export function StepDetail({ step }: StepDetailProps) {
  return (
    <div className="space-y-4">
      {/* Reasoning */}
      {step.reasoning && (
        <div className="bento-item">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5" />
            <h3 className="text-lg">{">"} REASONING</h3>
          </div>
          <p className="text-sm opacity-80 leading-relaxed">{step.reasoning}</p>
        </div>
      )}

      {/* Input */}
      <CollapsibleSection 
        title="INPUT" 
        icon={<ArrowDownToLine className="w-5 h-5" />}
        data={step.input}
        defaultOpen={true}
      />

      {/* Output */}
      <CollapsibleSection 
        title="OUTPUT" 
        icon={<ArrowUpFromLine className="w-5 h-5" />}
        data={step.output}
        defaultOpen={true}
      />

      {/* Error */}
      {step.error && (
        <div className="bento-item border-red-500/50">
          <h3 className="text-lg terminal-status-error mb-2">{">"} ERROR</h3>
          <pre className="text-sm terminal-status-error whitespace-pre-wrap">{step.error}</pre>
        </div>
      )}
    </div>
  );
}

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  data: unknown;
  defaultOpen?: boolean;
}

function CollapsibleSection({ title, icon, data, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="bento-item">
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-lg">{">"} {title}</h3>
          </div>
          <ChevronDown 
            className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} 
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <pre className="mt-4 text-xs opacity-80 overflow-x-auto max-h-[300px] overflow-y-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

