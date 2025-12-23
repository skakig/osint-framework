import { CaseInput, CaseWorkspace, EvidenceItem, Hypothesis } from '../types';

const STORAGE_KEY = 'osint-cases';

function safeParse(value: string | null): CaseWorkspace[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as CaseWorkspace[];
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Failed to parse stored cases', err);
    return [];
  }
}

function persistCases(cases: CaseWorkspace[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
}

export function loadCases(): CaseWorkspace[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return safeParse(stored);
}

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now()}`;
}

export function createCase(data: CaseInput): CaseWorkspace {
  const now = new Date().toISOString();
  const newCase: CaseWorkspace = {
    ...data,
    id: createId('case'),
    createdAt: now,
    evidence: [],
    hypotheses: [],
  };
  const cases = loadCases();
  const updated = [...cases, newCase];
  persistCases(updated);
  return newCase;
}

export function getCaseById(id: string): CaseWorkspace | undefined {
  return loadCases().find((item) => item.id === id);
}

export function upsertCase(updatedCase: CaseWorkspace) {
  const cases = loadCases();
  const index = cases.findIndex((item) => item.id === updatedCase.id);
  if (index >= 0) {
    cases[index] = updatedCase;
  } else {
    cases.push(updatedCase);
  }
  persistCases(cases);
}

export function addEvidence(caseId: string, evidence: Omit<EvidenceItem, 'id' | 'addedAt'>): CaseWorkspace | undefined {
  const target = getCaseById(caseId);
  if (!target) return undefined;
  const newEvidence: EvidenceItem = {
    ...evidence,
    id: createId('evidence'),
    addedAt: new Date().toISOString(),
  };
  const updatedCase: CaseWorkspace = {
    ...target,
    evidence: [newEvidence, ...target.evidence],
  };
  upsertCase(updatedCase);
  return updatedCase;
}

export function removeEvidence(caseId: string, evidenceId: string): CaseWorkspace | undefined {
  const target = getCaseById(caseId);
  if (!target) return undefined;
  const remainingEvidence = target.evidence.filter((item) => item.id !== evidenceId);
  const updatedHypotheses = target.hypotheses.map((hyp) => ({
    ...hyp,
    evidenceIds: hyp.evidenceIds.filter((id) => id !== evidenceId),
  }));
  const updatedCase: CaseWorkspace = { ...target, evidence: remainingEvidence, hypotheses: updatedHypotheses };
  upsertCase(updatedCase);
  return updatedCase;
}

export function addHypothesis(
  caseId: string,
  hypothesis: Omit<Hypothesis, 'id'>
): CaseWorkspace | undefined {
  const target = getCaseById(caseId);
  if (!target) return undefined;
  const newHypothesis: Hypothesis = {
    ...hypothesis,
    id: createId('hypothesis'),
  };
  const updatedCase: CaseWorkspace = {
    ...target,
    hypotheses: [newHypothesis, ...target.hypotheses],
  };
  upsertCase(updatedCase);
  return updatedCase;
}

export function updateHypothesis(caseId: string, hypothesis: Hypothesis): CaseWorkspace | undefined {
  const target = getCaseById(caseId);
  if (!target) return undefined;
  const updatedHypotheses = target.hypotheses.map((item) => (item.id === hypothesis.id ? hypothesis : item));
  const updatedCase: CaseWorkspace = { ...target, hypotheses: updatedHypotheses };
  upsertCase(updatedCase);
  return updatedCase;
}

export function deleteHypothesis(caseId: string, hypothesisId: string): CaseWorkspace | undefined {
  const target = getCaseById(caseId);
  if (!target) return undefined;
  const updatedCase: CaseWorkspace = {
    ...target,
    hypotheses: target.hypotheses.filter((item) => item.id !== hypothesisId),
  };
  upsertCase(updatedCase);
  return updatedCase;
}
*** End
