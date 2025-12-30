export interface XraySession {
  id: string;
  name: string;
  startedAt: Date;     
  completedAt?: Date;  
  status: 'running' | 'completed' | 'failed';
  metadata: Record<string, unknown>;
  steps: XrayStep[];
}

export interface XrayStep {
  id: string;
  name: string;
  type: 'llm' | 'filter' | 'search' | 'transform' | 'rank' | 'custom';
  startedAt: Date;
  completedAt?: Date;
  status: 'completed' | 'failed' | 'running';
  input: unknown;
  output: unknown;
  error?: string;
  reasoning?: string;
  evaluations?: Evaluation[];
  metadata?: Record<string, unknown>;
}

export interface Evaluation {
  id: string;
  label: string;  
  passed: boolean;
  criteria: CriteriaResult[];
}

export interface CriteriaResult {
  name: string;       
  passed: boolean;
  expected: string;    
  actual: string;     
  detail: string;      
}