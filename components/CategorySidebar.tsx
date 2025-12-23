'use client';

import { FC } from 'react';
import clsx from 'clsx';

interface Props {
  categories: string[];
  selectedCategory?: string;
  onSelect: (category?: string) => void;
}

export const CategorySidebar: FC<Props> = ({ categories, selectedCategory, onSelect }) => {
  return (
    <aside className="card h-full p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">Categories</h2>
        <button
          className="text-xs text-primary hover:text-primary-light"
          onClick={() => onSelect(undefined)}
          aria-label="Reset category filter"
        >
          Reset
        </button>
      </div>
      <ul className="space-y-1 text-sm">
        {categories.map((category) => (
          <li key={category}>
            <button
              className={clsx(
                'w-full text-left rounded-md px-3 py-2 transition-colors',
                selectedCategory === category
                  ? 'bg-primary/10 text-primary-dark font-semibold'
                  : 'hover:bg-slate-100 text-slate-800'
              )}
              onClick={() => onSelect(category)}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};
