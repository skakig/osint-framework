import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { resolveArtifactPath } from '../../../../../src/lib/artifacts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { runId: string } }) {
  const { runId } = params;
  const url = new URL(request.url);
  const file = url.searchParams.get('file');

  if (!file) {
    return NextResponse.json({ error: 'file query param required' }, { status: 400 });
  }

  try {
    const filePath = resolveArtifactPath(runId, file);
    const data = await fs.readFile(filePath);
    const filename = path.basename(filePath);
    return new NextResponse(data, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Artifact not available' }, { status: 404 });
  }
}
