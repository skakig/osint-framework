'use client';

import { Tool } from '../src/types';
import { RunnerPanel } from './RunnerPanel';

interface Props {
  tool?: Tool | null;
  onClose: () => void;
}

export function ToolDetailModal({ tool, onClose }: Props) {
  if (!tool) return null;

  const copyCommand = () => {
    if (tool.runExample) {
      navigator.clipboard.writeText(tool.runExample);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="card w-full max-w-2xl p-6 space-y-4 relative">
        <button
          className="absolute right-3 top-3 text-slate-500 hover:text-slate-700"
          aria-label="Close"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{tool.name}</h2>
            <p className="text-sm text-slate-500">{tool.category}</p>
          </div>
        </div>

        {tool.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tool.tags.map((tag) => (
              <span key={tag} className="badge badge-primary">
                {tag}
              </span>
            ))}
          </div>
        )}

        {tool.description && <p className="text-sm text-slate-700">{tool.description}</p>}

        <div className="space-y-2 text-sm">
          <div>
            <h4 className="font-semibold">Links</h4>
            <ul className="list-disc list-inside text-primary">
              {tool.urls.map((url) => (
                <li key={url}>
                  <a href={url} target="_blank" rel="noreferrer" className="hover:underline">
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {tool.install && (
            <div>
              <h4 className="font-semibold">Install</h4>
              <p className="whitespace-pre-wrap text-slate-700">{tool.install}</p>
            </div>
          )}
          {tool.runExample && (
            <div className="space-y-1">
              <h4 className="font-semibold">Run example</h4>
              <div className="flex items-center gap-2">
                <code className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-800">{tool.runExample}</code>
                <button className="btn btn-secondary" onClick={copyCommand}>
                  <span aria-hidden>📋</span> Copy command
                </button>
              </div>
            </div>
          )}
          {tool.notes && (
            <div>
              <h4 className="font-semibold">Notes</h4>
              <p className="text-slate-700 text-sm">{tool.notes}</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {tool.urls[0] && (
            <a
              href={tool.urls[0]}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              <span aria-hidden>↗</span> Open link
            </a>
          )}
          {tool.runExample && (
            <button className="btn btn-secondary" onClick={copyCommand}>
              <span aria-hidden>📋</span> Copy command
            </button>
          )}
        </div>

        <RunnerPanel tool={tool} />
      </div>
    </div>
  );
}
