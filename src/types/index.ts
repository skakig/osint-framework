export type ToolTag = 'T' | 'D' | 'R' | 'M';

export interface Tool {
  id: string;
  name: string;
  rawName: string;
  category: string;
  categoryPath: string[];
  tags: ToolTag[];
  description?: string;
  urls: string[];
  install?: string;
  runExample?: string;
  notes?: string;
  platform?: string;
}

export interface CaseInput {
  subjectName: string;
  location?: string;
  keywords?: string;
  knownUsernames?: string;
  notes?: string;
}

export interface EvidenceItem {
  id: string;
  url: string;
  title: string;
  snippet?: string;
  tags: string[];
  addedAt: string;
  sourceType: string;
}

export type HypothesisStatus = 'open' | 'confirmed' | 'rejected';

export interface Hypothesis {
  id: string;
  statement: string;
  confidence: number;
  status: HypothesisStatus;
  evidenceIds: string[];
  contradictions: string[];
  nextSteps: string[];
}

export interface CaseWorkspace extends CaseInput {
  id: string;
  createdAt: string;
  evidence: EvidenceItem[];
  hypotheses: Hypothesis[];
}
