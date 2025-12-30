import { XraySession, XrayStep, Evaluation } from "./types";
import { xrayStore } from "./store";



function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}



export function createSession(
  name: string,
  metadata: Record<string, unknown> = {}
): XraySession {
  const session: XraySession = {
    id: generateId(),
    name,
    startedAt: new Date(),
    status: "running",
    metadata,
    steps: [],
  };

  xrayStore.save(session);
  return session;
}



export async function runStep<T>(
  session: XraySession,
  name: string,
  type: XrayStep["type"],
  input: unknown,
  execute: (step: XrayStep) => Promise<T>
): Promise<T> {
  const step: XrayStep = {
    id: generateId(),
    name,
    type,
    startedAt: new Date(),
    status: "running",
    input,
    output: null,
    evaluations: [],
  };

  session.steps.push(step);

  try {
    const result = await execute(step);
    step.output = result;
    step.status = "completed";
    step.completedAt = new Date();
    xrayStore.save(session);
    return result;
  } catch (err) {
    step.status = "failed";
    step.error = err instanceof Error ? err.message : String(err);
    step.completedAt = new Date();
    xrayStore.save(session);
    throw err;
  }
}



export function setReasoning(step: XrayStep, reasoning: string): void {
  step.reasoning = reasoning;
}

export function addEvaluation(
  step: XrayStep,
  evaluation: Evaluation
): void {
  step.evaluations?.push(evaluation);
}



export function completeSession(session: XraySession): void {
  session.status = "completed";
  session.completedAt = new Date();
  xrayStore.save(session);
}

export function failSession(
  session: XraySession,
  error?: Error | string
): void {
  session.status = "failed";
  session.completedAt = new Date();
  if (error) {
    session.metadata.error =
      error instanceof Error ? error.message : error;
  }
  xrayStore.save(session);
}
