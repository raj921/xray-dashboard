import React from "react";
import { cn } from "@/lib/utils";

interface BentoItemProps {
  className?: string;
  children: React.ReactNode;
}

export const BentoItem = ({ className, children }: BentoItemProps) => {
  return (
    <div className={cn("bento-item", className)}>
      {children}
    </div>
  );
};

interface BentoGridProps {
  className?: string;
  children: React.ReactNode;
}

export const BentoGrid = ({ className, children }: BentoGridProps) => {
  return (
    <div className={cn("bento-grid", className)}>
      {children}
    </div>
  );
};

interface TerminalContainerProps {
  className?: string;
  children: React.ReactNode;
}

export const TerminalContainer = ({ className, children }: TerminalContainerProps) => {
  return (
    <div className={cn("terminal-container terminal-theme-scope", className)}>
      {children}
    </div>
  );
};

export default BentoItem;

