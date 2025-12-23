'use client';

import { buildSearchPack } from '../../src/lib/searchPacks';
import { CaseInput } from '../../src/types';

interface SearchPackProps {
  caseData: CaseInput;
}

export function SearchPack({ caseData }: SearchPackProps) {
  const groups = buildSearchPack(caseData);

  return (
    <section className="card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-primary">Search pack</p>
          <h2 className="text-lg font-semibold text-slate-900">Deterministic queries</h2>
        </div>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {groups.map((group) => (
          <div key={group.category} className="rounded-lg border border-slate-200 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">{group.category}</h3>
              <span className="badge">{group.items.length} links</span>
            </div>
            <div className="space-y-2">
              {group.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-2 rounded-md bg-slate-50 p-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                    <p className="text-xs text-slate-600">{item.query}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a className="btn btn-secondary" href={item.url} target="_blank" rel="noreferrer">
                      Open
                    </a>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => navigator.clipboard.writeText(item.query)}
                    >
                      Copy query
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
