import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { ArtifactDescriptor, RunRequestBody } from '../../../src/types';
import { getAllowedToolById } from '../../../src/lib/allowedTools';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function sse(data: string) {
  return `data: ${data}\n\n`;
}

async function listArtifacts(outputDir: string): Promise<ArtifactDescriptor[]> {
  try {
    const entries = await fs.readdir(outputDir, { withFileTypes: true });
    const artifacts: ArtifactDescriptor[] = [];
    for (const entry of entries) {
      if (entry.isFile()) {
        const full = path.join(outputDir, entry.name);
        const stats = await fs.stat(full);
        artifacts.push({ name: entry.name, path: entry.name, size: stats.size });
      }
    }
    return artifacts;
  } catch (error) {
    return [];
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as RunRequestBody | null;

  if (!body || !body.toolId) {
    return NextResponse.json({ error: 'toolId is required' }, { status: 400 });
  }

  const tool = getAllowedToolById(body.toolId);
  if (!tool) {
    return NextResponse.json({ error: 'Tool is not whitelisted for execution' }, { status: 400 });
  }

  const args = Array.isArray(body.args)
    ? body.args.map((arg) => (typeof arg === 'string' ? arg : String(arg)))
    : [];

  const runId = crypto.randomUUID();
  const outputDir = path.join('/tmp/osint-runner', runId);
  await fs.mkdir(outputDir, { recursive: true });

  const dockerArgs = [
    'run',
    '--rm',
    '--name', `osint-${tool.id}-${runId}`,
    '-v', `${outputDir}:${tool.outputDir || '/output'}`,
    tool.image,
    ...tool.command,
    ...args,
  ];

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const send = (event: string, payload: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\n${sse(JSON.stringify(payload))}`));
      };

      send('start', { runId, tool: tool.id, dockerArgs });

      const child = spawn('docker', dockerArgs, { env: process.env });

      child.stdout.on('data', (chunk) => {
        send('log', { stream: 'stdout', message: chunk.toString() });
      });

      child.stderr.on('data', (chunk) => {
        send('log', { stream: 'stderr', message: chunk.toString() });
      });

      child.on('error', (error) => {
        send('error', { message: 'Failed to start container', detail: error.message });
        controller.close();
      });

      child.on('close', async (code) => {
        const artifacts = await listArtifacts(outputDir);
        send('complete', { code, runId, artifacts });
        controller.close();
      });
    },
    cancel() {},
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
