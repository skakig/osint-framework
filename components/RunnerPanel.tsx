'use client';

import { FormEvent, useMemo, useRef, useState } from 'react';
import { ArtifactDescriptor } from '../src/types';
import { getAllowedTools } from '../src/lib/allowedTools';
import { Tool } from '../src/types';

interface Props {
  tool: Tool;
}

type LogEntry = {
  stream: 'stdout' | 'stderr';
  message: string;
};

const allowed = getAllowedTools();

export function RunnerPanel({ tool }: Props) {
  const allowedTool = useMemo(() => allowed.find((entry) => entry.id === tool.id), [tool.id]);
  const [args, setArgs] = useState(allowedTool?.defaultArgs?.join(' ') ?? '');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [status, setStatus] = useState<'idle' | 'running' | 'complete' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [artifacts, setArtifacts] = useState<ArtifactDescriptor[]>([]);
  const [runId, setRunId] = useState<string | null>(null);
  const abortController = useRef<AbortController | null>(null);

  if (!allowedTool) {
    return (
      <div className="rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
        This tool is not configured for sandboxed execution yet. Reach out to an administrator to
        add a safe container entry in <code>data/allowed-tools.json</code>.
      </div>
    );
  }

  const startRun = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('running');
    setError(null);
    setLogs([]);
    setArtifacts([]);
    const controller = new AbortController();
    abortController.current = controller;

    const argList = args
      .split(' ')
      .map((value) => value.trim())
      .filter(Boolean);

    const response = await fetch('/api/run', {
      method: 'POST',
      body: JSON.stringify({ toolId: tool.id, args: argList }),
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    });

    if (!response.ok || !response.body) {
      setStatus('error');
      setError('Failed to start run.');
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    const read = async (): Promise<void> => {
      const { value, done } = await reader.read();
      if (done) return;
      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split('\n\n');
      buffer = events.pop() || '';
      for (const eventBlock of events) {
        const lines = eventBlock.split('\n');
        const eventLine = lines.find((line) => line.startsWith('event: '));
        const dataLine = lines.find((line) => line.startsWith('data: '));
        if (!eventLine || !dataLine) continue;
        const eventName = eventLine.replace('event: ', '').trim();
        const payload = JSON.parse(dataLine.replace('data: ', ''));
        if (eventName === 'start') {
          setRunId(payload.runId);
        }
        if (eventName === 'log') {
          setLogs((current) => [...current, { stream: payload.stream, message: payload.message }]);
        }
        if (eventName === 'error') {
          setStatus('error');
          setError(payload.message || 'Unexpected error');
        }
        if (eventName === 'complete') {
          setStatus('complete');
          setArtifacts(payload.artifacts || []);
        }
      }
      return read();
    };

    try {
      await read();
    } catch (err) {
      setStatus('error');
      setError('Connection interrupted.');
    }
  };

  const stopRun = () => {
    abortController.current?.abort();
    setStatus('idle');
  };

  return (
    <div className="space-y-4">
      <div className="rounded border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
        <p className="font-semibold">Sandboxed runner</p>
        <p>Commands execute inside Docker using a pre-approved image. Output streams live below.</p>
      </div>
      <form className="space-y-3" onSubmit={startRun}>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700">Arguments</label>
          <input
            type="text"
            value={args}
            onChange={(e) => setArgs(e.target.value)}
            className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm"
            placeholder={allowedTool.defaultArgs?.join(' ') || ''}
            aria-label="Command arguments"
          />
          <p className="text-xs text-slate-500">
            Tool image: <code>{allowedTool.image}</code> • Base command: <code>{allowedTool.command.join(' ')}</code>
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-primary" type="submit" disabled={status === 'running'}>
            {status === 'running' ? 'Running…' : 'Run in sandbox'}
          </button>
          {status === 'running' && (
            <button className="btn btn-secondary" type="button" onClick={stopRun}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">Live logs</p>
          {status === 'complete' && <span className="text-xs text-green-700">Completed</span>}
        </div>
        <div className="max-h-56 overflow-auto rounded border border-slate-200 bg-slate-950 p-3 text-xs text-slate-100">
          {logs.length === 0 && <p className="text-slate-400">No output yet.</p>}
          {logs.map((entry, index) => (
            <div key={index} className={entry.stream === 'stderr' ? 'text-amber-300' : ''}>
              <span className="text-slate-500">[{entry.stream}]</span> {entry.message}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>
      )}

      {status === 'complete' && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-700">Artifacts</h4>
          {artifacts.length === 0 && <p className="text-xs text-slate-500">No artifacts were produced.</p>}
          {runId && artifacts.length > 0 && (
            <ul className="list-disc list-inside space-y-1 text-sm text-primary">
              {artifacts.map((artifact) => (
                <li key={artifact.path}>
                  <a
                    href={`/api/run/${runId}/artifact?file=${encodeURIComponent(artifact.path)}`}
                    className="hover:underline"
                  >
                    {artifact.name} ({artifact.size} bytes)
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
