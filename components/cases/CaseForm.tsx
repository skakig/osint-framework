'use client';

import { useState } from 'react';
import { CaseInput } from '../../src/types';

interface CaseFormProps {
  onCreate: (data: CaseInput) => void;
}

export function CaseForm({ onCreate }: CaseFormProps) {
  const [form, setForm] = useState<CaseInput>({
    subjectName: '',
    location: '',
    keywords: '',
    knownUsernames: '',
    notes: '',
  });

  const handleChange = (field: keyof CaseInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subjectName.trim()) return;
    onCreate({ ...form, subjectName: form.subjectName.trim() });
  };

  return (
    <form className="card p-4 space-y-4" onSubmit={handleSubmit}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-primary">New Case</p>
          <h2 className="text-lg font-semibold text-slate-900">Create a subject workspace</h2>
        </div>
        <button type="submit" className="btn btn-primary" disabled={!form.subjectName.trim()}>
          Create case
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm text-slate-700">
          Subject name *
          <input
            className="w-full rounded-md border border-slate-200 px-3 py-2"
            value={form.subjectName}
            onChange={(e) => handleChange('subjectName', e.target.value)}
            placeholder="Person, organization, or entity"
            required
          />
        </label>
        <label className="space-y-1 text-sm text-slate-700">
          Location
          <input
            className="w-full rounded-md border border-slate-200 px-3 py-2"
            value={form.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="City, region, or country"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm text-slate-700">
          Keywords
          <input
            className="w-full rounded-md border border-slate-200 px-3 py-2"
            value={form.keywords}
            onChange={(e) => handleChange('keywords', e.target.value)}
            placeholder="Industries, topics, affiliations"
          />
        </label>
        <label className="space-y-1 text-sm text-slate-700">
          Known usernames (comma separated)
          <input
            className="w-full rounded-md border border-slate-200 px-3 py-2"
            value={form.knownUsernames}
            onChange={(e) => handleChange('knownUsernames', e.target.value)}
            placeholder="username1, handle2"
          />
        </label>
      </div>

      <label className="space-y-1 text-sm text-slate-700">
        Notes
        <textarea
          className="w-full rounded-md border border-slate-200 px-3 py-2"
          rows={3}
          value={form.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Constraints, safety considerations, initial intel"
        />
      </label>
    </form>
  );
}
