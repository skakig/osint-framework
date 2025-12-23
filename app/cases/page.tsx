'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CaseForm } from '../../components/cases/CaseForm';
import { CaseList } from '../../components/cases/CaseList';
import { createCase, loadCases } from '../../src/lib/cases';
import { CaseInput, CaseWorkspace } from '../../src/types';

export default function CasesPage() {
  const router = useRouter();
  const [cases, setCases] = useState<CaseWorkspace[]>([]);

  useEffect(() => {
    setCases(loadCases());
  }, []);

  const handleCreate = (data: CaseInput) => {
    const newCase = createCase(data);
    setCases((prev) => [...prev, newCase]);
    router.push(`/cases/${newCase.id}`);
  };

  return (
    <main className="min-h-screen py-6">
      <header className="mb-6 space-y-2">
        <p className="text-sm uppercase tracking-wide text-primary">Investigation hub</p>
        <h1 className="text-3xl font-bold text-slate-900">Cases</h1>
        <p className="text-sm text-slate-600">
          Structure OSINT investigations with case workspaces, deterministic search packs, evidence capture, and
          hypothesis tracking.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <section className="space-y-4">
          <CaseForm onCreate={handleCreate} />
        </section>
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">Recent cases</h2>
          <CaseList cases={[...cases].sort((a, b) => b.createdAt.localeCompare(a.createdAt))} />
        </section>
      </div>
    </main>
  );
}
