import { CaseWorkspace, Hypothesis } from '../types';

function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 4)
    .slice(0, 20);
}

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

export function suggestNextSteps(workspace: CaseWorkspace, hypothesis: Hypothesis): string[] {
  const evidenceText = workspace.evidence
    .filter((item) => hypothesis.evidenceIds.includes(item.id) || !hypothesis.evidenceIds.length)
    .map((item) => `${item.title} ${item.snippet || ''} ${item.tags.join(' ')}`)
    .join(' ');

  const keywordPool = unique([
    ...extractKeywords(evidenceText),
    ...extractKeywords(workspace.keywords || ''),
    ...extractKeywords(hypothesis.statement),
  ]);

  const candidatePrompts = [
    `Verify timelines for ${workspace.subjectName}`,
    `Corroborate ${hypothesis.statement} using independent sources`,
    `Look for contradictions to ${hypothesis.statement}`,
    `Find additional context around ${workspace.location || 'the location'}`,
    `Expand on usernames: ${workspace.knownUsernames || 'n/a'}`,
  ];

  const keywordSuggestions = keywordPool.slice(0, 3).map((keyword) => `Collect sources mentioning "${keyword}"`);

  const contradictionsHint =
    hypothesis.contradictions.length > 0
      ? `Resolve contradictions: ${hypothesis.contradictions.slice(0, 2).join('; ')}`
      : 'List potential contradictions to address';

  return unique([...candidatePrompts, ...keywordSuggestions, contradictionsHint]).slice(0, 6);
}
