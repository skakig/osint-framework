'use client';

import { Tool } from '../src/types';
import clsx from 'clsx';

interface Props {
  tool: Tool;
  isFavorite: boolean;
  onFavoriteToggle: (tool: Tool) => void;
  onSelect: (tool: Tool) => void;
}

export function ToolCard({ tool, isFavorite, onFavoriteToggle, onSelect }: Props) {
  return (
    <div className="card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{tool.name}</h3>
          <p className="text-xs text-slate-500">{tool.category}</p>
        </div>
        <button
          aria-label="Toggle favorite"
          onClick={() => onFavoriteToggle(tool)}
          className={clsx(
            'btn btn-secondary p-2 rounded-full',
            isFavorite ? 'text-red-500 bg-red-50 hover:bg-red-100' : 'text-slate-600'
          )}
        >
          <span className={clsx(isFavorite && 'text-red-500')}>❤</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tool.tags.map((tag) => (
          <span key={tag} className="badge badge-primary">
            {tag}
          </span>
        ))}
        {tool.platform && <span className="badge">{tool.platform}</span>}
      </div>

      <div className="flex flex-wrap gap-2">
        <button className="btn btn-primary" onClick={() => onSelect(tool)}>
          View details
        </button>
        {tool.urls[0] && (
          <a
            href={tool.urls[0]}
            className="btn btn-secondary"
            target="_blank"
            rel="noreferrer"
          >
            <span aria-hidden>↗</span> Open link
          </a>
        )}
        {tool.runExample && (
          <button
            className="btn btn-secondary"
            onClick={() => navigator.clipboard.writeText(tool.runExample || '')}
          >
            <span aria-hidden>📋</span> Copy command
          </button>
        )}
      </div>
    </div>
  );
}
