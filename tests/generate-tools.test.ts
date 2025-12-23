import { describe, expect, it } from 'vitest';
import { extractNameAndTags, generateTools } from '../scripts/generate-tools.js';

const tools = generateTools();

describe('extractNameAndTags', () => {
  it('detects tags and cleans name', () => {
    const result = extractNameAndTags('Sherlock (T)');
    expect(result.tags).toContain('T');
    expect(result.cleanName).toBe('Sherlock');
  });
});

describe('generateTools', () => {
  it('builds a list of tools from the ARF data', () => {
    expect(tools.length).toBeGreaterThan(50);
  });

  it('keeps category paths and ids stable', () => {
    const sherlock = tools.find((tool) => tool.name === 'Sherlock');
    expect(sherlock).toBeTruthy();
    expect(sherlock?.categoryPath.length).toBeGreaterThan(0);
    expect(sherlock?.id).toBeDefined();
  });

  it('ensures every tool has a url and category', () => {
    const invalid = tools.filter((tool) => tool.urls.length === 0 || !tool.category);
    expect(invalid.length).toBe(0);
  });
});
