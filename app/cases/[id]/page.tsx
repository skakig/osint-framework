'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { EvidenceSection } from '../../../components/cases/EvidenceSection';
import { HypothesisSection } from '../../../components/cases/HypothesisSection';
import { SearchPack } from '../../../components/cases/SearchPack';
import { addEvidence, addHypothesis, deleteHypothesis, getCaseById, removeEvidence, updateHypothesis } from '../../../src/lib/cases';
import { CaseWorkspace, EvidenceItem, Hypothesis } from '../../../src/types';

export default function CaseDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [workspace, setWorkspace] = useState<CaseWorkspace | null>(null);

  useEffect(() => {
    const current = getCaseById(params.id);
    if (!current) {
      router.push('/cases');
    } else {
      setWorkspace(current);
    }
  }, [params.id, router]);

  const refresh = (updated: CaseWorkspace | undefined) => {
    if (updated) {
      setWorkspace(updated);
    }
  };

  const handleAddEvidence = (item: Omit<EvidenceItem, 'id' | 'addedAt'>) => {
    refresh(addEvidence(params.id, item));
  };

  const handleRemoveEvidence = (id: string) => {
    refresh(removeEvidence(params.id, id));
  };

  const handleAddHypothesis = (hypothesis: Omit<Hypothesis, 'id'>) => {
    refresh(addHypothesis(params.id, hypothesis));
  };

  const handleUpdateHypothesis = (hypothesis: Hypothesis) => {
    refresh(updateHypothesis(params.id, hypothesis));
  };

  const handleDeleteHypothesis = (id: string) => {
    refresh(deleteHypothesis(params.id, id));
  };

  const summaryFields = useMemo(() => {
    if (!workspace) return [] as { label: string; value: string }[];
    return [
      { label: 'Location', value: workspace.location || '—' },
      { label: 'Keywords', value: workspace.keywords || '—' },
      { label: 'Known usernames', value: workspace.knownUsernames || '—' },
      { label: 'Created', value: new Date(workspace.createdAt).toLocaleString() },
    ];
  }, [workspace]);

  if (!workspace) {
    return (
      <main className="min-h-screen py-6">
        <p className="text-slate-700">Loading case...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-6 space-y-4">
      <header className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-primary">Case workspace</p>
            <h1 className="text-3xl font-bold text-slate-900">{workspace.subjectName}</h1>
            <p className="text-sm text-slate-600">{workspace.notes || 'No notes yet.'}</p>
          </div>
          <button className="btn btn-secondary" onClick={() => router.push('/cases')}>
            Back to cases
          </button>
        </div>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {summaryFields.map((field) => (
            <div key={field.label} className="rounded-md border border-slate-200 p-3">
              <dt className="text-xs uppercase tracking-wide text-slate-500">{field.label}</dt>
              <dd className="text-sm text-slate-800">{field.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <SearchPack caseData={workspace} />
      <EvidenceSection workspace={workspace} onAdd={handleAddEvidence} onRemove={handleRemoveEvidence} />
      <HypothesisSection
        workspace={workspace}
        onAdd={handleAddHypothesis}
        onUpdate={handleUpdateHypothesis}
        onDelete={handleDeleteHypothesis}
      />
    </main>
  );
}
