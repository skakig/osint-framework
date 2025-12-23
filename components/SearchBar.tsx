'use client';

import { ChangeEvent } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: Props) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value);

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden>
        🔍
      </span>
      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder="Search tools..."
        className="w-full rounded-md border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </div>
  );
}
