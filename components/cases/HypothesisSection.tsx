'use client';

import { useMemo, useState } from 'react';
import { suggestNextSteps } from '../../src/lib/hypothesisAssist';
import { CaseWorkspace, Hypothesis, HypothesisStatus } from '../../src/types';

interface HypothesisSectionProps {
  workspace: CaseWorkspace;
  onAdd: (hypothesis: Omit<Hypothesis, 'id'>) => void;
  onUpdate: (hypothesis: Hypothesis) => void;
  onDelete: (id: string) => void;
}

const STATUS_COLORS: Record<HypothesisStatus, string> = {
  open: 'badge',
  confirmed: 'badge badge-primary',
  rejected: 'badge',
};

export function HypothesisSection({ workspace, onAdd, onUpdate, onDelete }: HypothesisSectionProps) {
  const [form, setForm] = useState<Omit<Hypothesis, 'id'>>({
    statement: '',
    confidence: 50,
    status: 'open',
    evidenceIds: [],
    contradictions: [],
    nextSteps: [],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<HypothesisStatus | 'all'>('all');
  const [sortByConfidence, setSortByConfidence] = useState<'desc' | 'asc'>('desc');

  const filteredHypotheses = useMemo(() => {
    let items = [...workspace.hypotheses];
    if (statusFilter !== 'all') {
      items = items.filter((item) => item.status === statusFilter);
    }
    items.sort((a, b) =>
      sortByConfidence === 'desc' ? b.confidence - a.confidence : a.confidence - b.confidence
    );
    return items;
  }, [statusFilter, workspace.hypotheses, sortByConfidence]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.statement.trim()) return;

    if (editingId) {
      onUpdate({ ...form, id: editingId });
      setEditingId(null);
    } else {
      onAdd(form);
    }
    setForm({ statement: '', confidence: 50, status: 'open', evidenceIds: [], contradictions: [], nextSteps: [] });
  };

  const handleEdit = (hypothesis: Hypothesis) => {
    setEditingId(hypothesis.id);
    const { id, ...rest } = hypothesis;
    setForm(rest);
  };

  const toggleEvidenceSelection = (id: string) => {
    setForm((prev) => ({
      ...prev,
      evidenceIds: prev.evidenceIds.includes(id)
        ? prev.evidenceIds.filter((item) => item !== id)
        : [...prev.evidenceIds, id],
    }));
  };

  const handleAIHelp = (hypothesis: Hypothesis) => {
    const suggestions = suggestNextSteps(workspace, hypothesis);
    const next = Array.from(new Set([...hypothesis.nextSteps, ...suggestions]));
    onUpdate({ ...hypothesis, nextSteps: next });
  };

  return (
    <section className="card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-primary">Hypotheses</p>
          <h2 className="text-lg font-semibold text-slate-900">Track claims and confidence</h2>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <label className="flex items-center gap-1">
            Status
            <select
              className="rounded-md border border-slate-200 px-2 py-1"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as HypothesisStatus | 'all')}
            >
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="confirmed">Confirmed</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
          <label className="flex items-center gap-1">
            Sort
            <select
              className="rounded-md border border-slate-200 px-2 py-1"
              value={sortByConfidence}
              onChange={(e) => setSortByConfidence(e.target.value as 'asc' | 'desc')}
            >
              <option value="desc">High → low confidence</option>
              <option value="asc">Low → high confidence</option>
            </select>
          </label>
        </div>
      </div>

      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="grid gap-3 md:grid-cols-[2fr,1fr]">
          <label className="space-y-1 text-sm text-slate-700">
            Statement*
            <input
              className="w-full rounded-md border border-slate-200 px-3 py-2"
              value={form.statement}
              onChange={(e) => setForm((prev) => ({ ...prev, statement: e.target.value }))}
              placeholder="What do you suspect?"
              required
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1 text-sm text-slate-700">
              Confidence ({form.confidence}%)
              <input
                type="range"
                min={0}
                max={100}
                value={form.confidence}
                onChange={(e) => setForm((prev) => ({ ...prev, confidence: Number(e.target.value) }))}
              />
            </label>
            <label className="space-y-1 text-sm text-slate-700">
              Status
              <select
                className="w-full rounded-md border border-slate-200 px-3 py-2"
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as HypothesisStatus }))}
              >
                <option value="open">Open</option>
                <option value="confirmed">Confirmed</option>
                <option value="rejected">Rejected</option>
              </select>
            </label>
          </div>
        </div>

        <label className="space-y-1 text-sm text-slate-700">
          Evidence links
          <div className="flex flex-wrap gap-2">
            {workspace.evidence.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`rounded-md border px-3 py-1 text-xs ${
                  form.evidenceIds.includes(item.id)
                    ? 'border-primary bg-primary/10 text-primary-dark'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
                onClick={() => toggleEvidenceSelection(item.id)}
              >
                {item.title}
              </button>
            ))}
            {!workspace.evidence.length && (
              <span className="text-xs text-slate-500">Add evidence to link it here.</span>
            )}
          </div>
        </label>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1 text-sm text-slate-700">
            Contradictions (one per line)
            <textarea
              className="w-full rounded-md border border-slate-200 px-3 py-2"
              rows={2}
              value={form.contradictions.join('\n')}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, contradictions: e.target.value.split('\n').filter(Boolean) }))
              }
            />
          </label>
          <label className="space-y-1 text-sm text-slate-700">
            Next steps (one per line)
            <textarea
              className="w-full rounded-md border border-slate-200 px-3 py-2"
              rows={2}
              value={form.nextSteps.join('\n')}
              onChange={(e) => setForm((prev) => ({ ...prev, nextSteps: e.target.value.split('\n').filter(Boolean) }))}
            />
          </label>
        </div>

        <div className="flex gap-2">
          <button className="btn btn-primary" type="submit">
            {editingId ? 'Update hypothesis' : 'Add hypothesis'}
          </button>
          {editingId && (
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({
                  statement: '',
                  confidence: 50,
                  status: 'open',
                  evidenceIds: [],
                  contradictions: [],
                  nextSteps: [],
                });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid gap-3 lg:grid-cols-2">
        {filteredHypotheses.map((hypothesis) => (
          <div key={hypothesis.id} className="rounded-md border border-slate-200 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">{hypothesis.statement}</p>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <span className={STATUS_COLORS[hypothesis.status]}>{hypothesis.status}</span>
                  <span className="badge">{hypothesis.confidence}% confidence</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <button className="text-primary" type="button" onClick={() => handleEdit(hypothesis)}>
                  Edit
                </button>
                <button className="text-slate-500" type="button" onClick={() => onDelete(hypothesis.id)}>
                  Delete
                </button>
              </div>
            </div>

            {hypothesis.evidenceIds.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-700">Evidence</p>
                <ul className="list-disc pl-5 text-xs text-slate-600">
                  {hypothesis.evidenceIds.map((id) => {
                    const evidence = workspace.evidence.find((item) => item.id === id);
                    return evidence ? <li key={id}>{evidence.title}</li> : null;
                  })}
                </ul>
              </div>
            )}

            {hypothesis.contradictions.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-700">Contradictions</p>
                <ul className="list-disc pl-5 text-xs text-slate-600">
                  {hypothesis.contradictions.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-700">Next steps</p>
                <button className="btn btn-secondary text-xs" type="button" onClick={() => handleAIHelp(hypothesis)}>
                  AI assist
                </button>
              </div>
              {hypothesis.nextSteps.length > 0 ? (
                <ul className="list-disc pl-5 text-xs text-slate-600">
                  {hypothesis.nextSteps.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500">No next steps yet.</p>
              )}
            </div>
          </div>
        ))}
        {!filteredHypotheses.length && <p className="text-sm text-slate-600">No hypotheses yet.</p>}
      </div>
    </section>
  );
}
