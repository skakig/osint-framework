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
