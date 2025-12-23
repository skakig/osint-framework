'use client';

import clsx from 'clsx';
import { ToolTag } from '../src/types';

interface Props {
  availableTags: ToolTag[];
  activeTags: ToolTag[];
  onToggle: (tag: ToolTag) => void;
}

const TAG_LABELS: Record<ToolTag, string> = {
  T: 'Tool',
  D: 'Google Dork',
  R: 'Registration',
  M: 'Manual',
};

export function TagFilter({ availableTags, activeTags, onToggle }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {availableTags.map((tag) => {
        const active = activeTags.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => onToggle(tag)}
            className={clsx(
              'badge transition-colors border border-transparent',
              active ? 'bg-primary text-white' : 'hover:bg-slate-200'
            )}
          >
            <span className="font-semibold">{tag}</span>
            <span>{TAG_LABELS[tag]}</span>
          </button>
        );
      })}
    </div>
  );
}
