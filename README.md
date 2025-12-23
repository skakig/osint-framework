# OSINT Workbench

A modern interface for browsing the [OSINT Framework](https://osintframework.com) collection. The UI provides search, tagging, categories, tool details, and local favorites while keeping the original resource structure intact.

## Getting Started

> Note: Installing dependencies requires internet access to npm. If your environment blocks outgoing connections, you can still regenerate the tool index (see below), but `npm install` will not succeed.

1. Install dependencies
   ```bash
   npm install
   ```
2. Generate the tool index from the upstream `public/arf.json`
   ```bash
   npm run generate:tools
   ```
3. Start the development server
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000 to use the workbench.

## Features
- Category sidebar sourced from the ARF hierarchy
- Full-text search and tag filters for (T), (D), (R), (M)
- Tool cards with quick open links
- Detail modal with links, notes, and copy-to-clipboard for commands when provided
- Favorites stored in `localStorage`
- API route at `/api/tools` to consume the generated catalog

## Regenerating the catalog
The catalog is deterministically generated from `public/arf.json`.
```bash
npm run generate:tools
```
This writes `data/tools.json`, which the UI and API consume.

## Testing
Basic parser coverage is provided via Vitest:
```bash
npm test
```

## Contributing
- Keep the meaning and structure of the upstream OSINT list intact
- Update `public/arf.json` first, then regenerate `data/tools.json`
- Run tests before opening a PR when possible

## Notes on safety
The UI only exposes links and copy-to-clipboard helpers. No commands are executed automatically; any run examples are displayed for manual use.
