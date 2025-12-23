export type ToolTag = 'T' | 'D' | 'R' | 'M';

export interface Tool {
  id: string;
  name: string;
  rawName: string;
  category: string;
  categoryPath: string[];
  tags: ToolTag[];
  description?: string;
  urls: string[];
  install?: string;
  runExample?: string;
  notes?: string;
  platform?: string;
}

export interface AllowedTool {
  id: string;
  name: string;
  description?: string;
  image: string;
  command: string[];
  defaultArgs?: string[];
  outputDir?: string;
}

export interface RunRequestBody {
  toolId: string;
  args?: string[];
}

export interface ArtifactDescriptor {
  name: string;
  path: string;
  size: number;
}
