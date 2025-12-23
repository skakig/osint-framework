import allowedTools from '../../data/allowed-tools.json';
import { AllowedTool } from '../types';

const cache: AllowedTool[] = Array.isArray(allowedTools)
  ? (allowedTools as AllowedTool[])
  : [];

export function getAllowedTools(): AllowedTool[] {
  return cache;
}

export function getAllowedToolById(id: string): AllowedTool | undefined {
  return cache.find((tool) => tool.id === id);
}
