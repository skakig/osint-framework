import tools from '../../data/tools.json';
import { Tool, ToolTag } from '../types';

export function getTools(): Tool[] {
  return tools as Tool[];
}

export function getCategories(toolList: Tool[]): string[] {
  const categories = new Set<string>();
  toolList.forEach((tool) => {
    if (tool.category) {
      categories.add(tool.category);
    }
  });
  return Array.from(categories).sort();
}

export function getAvailableTags(toolList: Tool[]): ToolTag[] {
  const tags = new Set<ToolTag>();
  toolList.forEach((tool) => tool.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}
