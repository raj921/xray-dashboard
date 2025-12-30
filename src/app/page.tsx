"use client";

import { useState, useEffect, useCallback } from "react";
import { XraySession, XrayStep } from "@/lib/xray/types";
import { SessionList } from "@/components/xray/session-list";
import { StepTimeline } from "@/components/xray/step-timeline";
import { StepDetail } from "@/components/xray/step-detail";
import { EvaluationTable } from "@/components/xray/evaluation-table";
import { Play, RefreshCw, Zap, Eye } from "lucide-react";

export default function XRayDashboard() {
  const [sessions, setSessions] = useState<XraySession[]>([]);
  const [selectedSession, setSelectedSession] = useState<XraySession | null>(null);
  const [selectedStep, setSelectedStep] = useState<XrayStep | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // Fetch all sessions
  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/sessions");
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Run demo pipeline
  const runDemo = async () => {
    setIsRunning(true);
    try {
      const res = await fetch("/api/demo/run", { method: "POST" });
      const data = await res.json();
      if (data.success && data.session) {
        await fetchSessions();
        setSelectedSession(data.session);
        setSelectedStep(data.session.steps[0] || null);
      }
    } catch (error) {
      console.error("Failed to run demo:", error);
    } finally {
      setIsRunning(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Handle session selection
  const handleSelectSession = (session: XraySession) => {
    setSelectedSession(session);
    setSelectedStep(session.steps[0] || null);
  };

  // Handle step selection
  const handleSelectStep = (step: XrayStep) => {
    setSelectedStep(step);
  };

  return (
    <div className="terminal-container terminal-theme-scope min-h-screen">
      <div className="w-full max-w-7xl z-10 space-y-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Eye className="w-10 h-10" />
            <div>
              <h1 className="text-3xl md:text-4xl blinking-cursor tracking-wider">
                X-RAY DASHBOARD
              </h1>
              <p className="text-sm opacity-60">Pipeline Debugging & Observability</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchSessions}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 border border-[#0f0]/50 hover:bg-[#0f0]/10 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={runDemo}
              disabled={isRunning}
              className="flex items-center gap-2 px-6 py-2 bg-[#0f0] text-black font-bold hover:bg-[#0c0] transition-all disabled:opacity-50"
            >
              {isRunning ? (
                <Zap className="w-4 h-4 animate-pulse" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {isRunning ? "Running..." : "Run Demo"}
            </button>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sessions Panel */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl opacity-80">{">"} SESSIONS</h2>
            <SessionList
              sessions={sessions}
              selectedId={selectedSession?.id}
              onSelect={handleSelectSession}
            />
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-2 space-y-4">
            {selectedSession ? (
              <>
                {/* Session Header */}
                <div className="bento-item">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl">{">"} {selectedSession.name.toUpperCase()}</h2>
                      <p className="text-sm opacity-60 mt-1">
                        Session ID: {selectedSession.id}
                      </p>
                    </div>
                    <div className="text-right text-sm opacity-60">
                      <div>Started: {new Date(selectedSession.startedAt).toLocaleString()}</div>
                      {selectedSession.completedAt && (
                        <div>
                          Duration:{" "}
                          {(
                            (new Date(selectedSession.completedAt).getTime() -
                              new Date(selectedSession.startedAt).getTime()) /
                            1000
                          ).toFixed(2)}
                          s
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Step Timeline */}
                <div>
                  <h3 className="text-lg opacity-80 mb-3">{">"} PIPELINE STEPS</h3>
                  <StepTimeline
                    steps={selectedSession.steps}
                    selectedStepId={selectedStep?.id}
                    onSelectStep={handleSelectStep}
                  />
                </div>

                {/* Step Detail */}
                {selectedStep && (
                  <div className="space-y-4">
                    <h3 className="text-lg opacity-80">
                      {">"} STEP: {selectedStep.name.toUpperCase()}
                      <span className="text-sm opacity-50 ml-2">({selectedStep.type})</span>
                    </h3>
                    
                    <StepDetail step={selectedStep} />

                    {/* Evaluations */}
                    {selectedStep.evaluations && selectedStep.evaluations.length > 0 && (
                      <EvaluationTable evaluations={selectedStep.evaluations} />
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="bento-item text-center py-16">
                <Eye className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <h2 className="text-2xl mb-2">No Session Selected</h2>
                <p className="opacity-60 mb-6">
                  Select a session from the list or run the demo to get started.
                </p>
                <button
                  onClick={runDemo}
                  disabled={isRunning}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#0f0] text-black font-bold hover:bg-[#0c0] transition-all disabled:opacity-50"
                >
                  <Play className="w-5 h-5" />
                  Run Demo Pipeline
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-sm opacity-40 pt-4">
          X-RAY v1.0.0 | {new Date().toISOString().split("T")[0]}
        </footer>
      </div>
    </div>
  );
}
