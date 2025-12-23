'use client';

import Link from 'next/link';
import { CaseWorkspace } from '../../src/types';

interface CaseListProps {
  cases: CaseWorkspace[];
}

export function CaseList({ cases }: CaseListProps) {
  if (!cases.length) {
    return <div className="card p-4 text-slate-600">No cases yet. Create one to generate a workspace.</div>;
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {cases.map((item) => (
        <div className="card p-4 space-y-2" key={item.id}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-primary">Case</p>
              <h3 className="text-lg font-semibold text-slate-900">{item.subjectName}</h3>
            </div>
            <Link className="btn btn-secondary" href={`/cases/${item.id}`}>
              Open
            </Link>
          </div>
          <p className="text-sm text-slate-600">{item.notes || 'No notes yet.'}</p>
          <dl className="grid grid-cols-2 gap-2 text-xs text-slate-700">
            <div>
              <dt className="font-semibold text-slate-800">Location</dt>
              <dd>{item.location || '—'}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-800">Keywords</dt>
              <dd>{item.keywords || '—'}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-800">Usernames</dt>
              <dd>{item.knownUsernames || '—'}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-800">Created</dt>
              <dd>{new Date(item.createdAt).toLocaleString()}</dd>
            </div>
          </dl>
          <div className="text-xs text-slate-500">
            {item.evidence.length} evidence • {item.hypotheses.length} hypotheses
          </div>
        </div>
      ))}
    </div>
  );
}
