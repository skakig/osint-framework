const fs = require('fs');
const path = require('path');

const TAG_MAP = {
  T: 'T',
  D: 'D',
  R: 'R',
  M: 'M',
};

function extractNameAndTags(rawName) {
  const tagMatches = rawName.match(/\(([A-Z])\)/g) || [];
  const tags = tagMatches
    .map((tag) => tag.replace(/\(|\)/g, ''))
    .filter((tag) => TAG_MAP[tag]);

  const cleanName = rawName.replace(/\s*\([^)]+\)\s*/g, ' ').trim();
  return { cleanName, tags };
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function parseArfNode(node, parentPath = [], rootName = 'OSINT Framework') {
  const results = [];
  const currentPath = parentPath.length === 0 && node.name === rootName ? [] : [...parentPath, node.name];

  if (node.type === 'folder' && node.children) {
    node.children.forEach((child) => {
      results.push(...parseArfNode(child, currentPath, rootName));
    });
    return results;
  }

  if (node.type === 'url' && node.url) {
    const { cleanName, tags } = extractNameAndTags(node.name);
    const categoryPath = currentPath;
    const category = categoryPath.join(' / ');
    const id = slugify(`${category}-${cleanName}`);

    results.push({
      id,
      name: cleanName,
      rawName: node.name,
      category,
      categoryPath,
      tags,
      description: undefined,
      urls: [node.url],
      install: tags.includes('T') ? 'Review linked repository or documentation for installation steps.' : undefined,
      runExample: undefined,
      notes: `Original entry: ${node.name}`,
      platform: tags.includes('T') ? 'Local tool' : 'Web resource',
    });
  }

  return results;
}

function loadArf() {
  const filePath = path.join(process.cwd(), 'public', 'arf.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

function sortTools(tools) {
  return tools.sort((a, b) => {
    if (a.category === b.category) {
      return a.name.localeCompare(b.name);
    }
    return a.category.localeCompare(b.category);
  });
}

function generateTools() {
  const arf = loadArf();
  const tools = parseArfNode(arf);
  return sortTools(tools);
}

function writeToolsFile(tools) {
  const outPath = path.join(process.cwd(), 'data', 'tools.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(tools, null, 2));
  console.log(`Wrote ${tools.length} tools to ${outPath}`);
}

if (require.main === module) {
  const tools = generateTools();
  writeToolsFile(tools);
}

module.exports = { extractNameAndTags, generateTools, parseArfNode };
