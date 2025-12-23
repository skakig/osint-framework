import fs from 'fs';
import path from 'path';

export function resolveArtifactPath(runId: string, artifact: string): string {
  const base = path.join('/tmp/osint-runner', runId);
  const target = path.join(base, artifact);
  const normalized = path.normalize(target);
  if (!normalized.startsWith(base)) {
    throw new Error('Invalid artifact path');
  }
  if (!fs.existsSync(normalized)) {
    throw new Error('Artifact does not exist');
  }
  return normalized;
}
