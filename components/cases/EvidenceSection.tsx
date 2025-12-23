'use client';

import { useMemo, useState } from 'react';
import { CaseWorkspace, EvidenceItem } from '../../src/types';

interface EvidenceSectionProps {
  workspace: CaseWorkspace;
  onAdd: (item: Omit<EvidenceItem, 'id' | 'addedAt'>) => void;
  onRemove: (id: string) => void;
}

export function EvidenceSection({ workspace, onAdd, onRemove }: EvidenceSectionProps) {
  const [form, setForm] = useState<Omit<EvidenceItem, 'id' | 'addedAt'>>({
    url: '',
    title: '',
    snippet: '',
    tags: [],
    sourceType: 'web',
  });

  const sortedEvidence = useMemo(
    () => [...workspace.evidence].sort((a, b) => b.addedAt.localeCompare(a.addedAt)),
    [workspace.evidence]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim()) return;
    onAdd({ ...form, tags: form.tags });
    setForm({ url: '', title: '', snippet: '', tags: [], sourceType: form.sourceType });
  };

  return (
    <section className="card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-primary">Evidence</p>
          <h2 className="text-lg font-semibold text-slate-900">Captured leads</h2>
        </div>
      </div>

      <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
        <label className="space-y-1 text-sm text-slate-700">
          Title*
          <input
            className="w-full rounded-md border border-slate-200 px-3 py-2"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Headline or short note"
            required
          />
        </label>
        <label className="space-y-1 text-sm text-slate-700">
          URL*
          <input
            className="w-full rounded-md border border-slate-200 px-3 py-2"
            value={form.url}
            onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))}
            placeholder="https://example.com"
            required
          />
        </label>
        <label className="space-y-1 text-sm text-slate-700 md:col-span-2">
          Snippet / notes
          <textarea
            className="w-full rounded-md border border-slate-200 px-3 py-2"
            rows={2}
            value={form.snippet}
            onChange={(e) => setForm((prev) => ({ ...prev, snippet: e.target.value }))}
            placeholder="Why this is relevant"
          />
        </label>
        <div className="grid gap-3 md:grid-cols-2 md:col-span-2">
          <label className="space-y-1 text-sm text-slate-700">
            Tags (comma separated)
            <input
              className="w-full rounded-md border border-slate-200 px-3 py-2"
              value={form.tags.join(', ')}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  tags: e.target.value
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                }))
              }
              placeholder="reputation, announcement"
            />
          </label>
          <label className="space-y-1 text-sm text-slate-700">
            Source type
            <select
              className="w-full rounded-md border border-slate-200 px-3 py-2"
              value={form.sourceType}
              onChange={(e) => setForm((prev) => ({ ...prev, sourceType: e.target.value }))}
            >
              <option value="web">Web</option>
              <option value="social">Social</option>
              <option value="business">Business record</option>
              <option value="archive">Archive</option>
              <option value="image">Image</option>
              <option value="note">Analyst note</option>
            </select>
          </label>
        </div>
        <div className="md:col-span-2">
          <button type="submit" className="btn btn-primary">
            Add evidence
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {sortedEvidence.map((item) => (
          <div key={item.id} className="rounded-md border border-slate-200 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <a className="text-xs" href={item.url} target="_blank" rel="noreferrer">
                  {item.url}
                </a>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="badge">{item.sourceType}</span>
                <button className="text-primary" type="button" onClick={() => onRemove(item.id)}>
                  Remove
                </button>
              </div>
            </div>
            {item.snippet && <p className="mt-1 text-sm text-slate-700">{item.snippet}</p>}
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
              {item.tags.map((tag) => (
                <span key={tag} className="badge">
                  {tag}
                </span>
              ))}
              <span className="text-slate-500">Added {new Date(item.addedAt).toLocaleString()}</span>
            </div>
          </div>
        ))}
        {!sortedEvidence.length && <p className="text-sm text-slate-600">No evidence added yet.</p>}
      </div>
    </section>
  );
}
