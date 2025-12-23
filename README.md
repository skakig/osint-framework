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
- Case workspaces with deterministic search packs, evidence capture, and hypothesis tracking
- API route at `/api/tools` to consume the generated catalog

## Regenerating the catalog
The catalog is deterministically generated from `public/arf.json`.
```bash
npm run generate:tools
```
This writes `data/tools.json`, which the UI and API consume.

## Case workflow
The case workspace is available at `/cases` and `/cases/[id]`.

1. Open **Cases** and create a new case with subject name, optional location, keywords, usernames, and notes.
2. The app creates a workspace with a deterministic **search pack** that groups suggested web, social, business, archive,
   and image queries as clickable buttons and copyable strings.
3. Use **Add evidence** on any case to log URLs, notes, tags, and source types; items are stored locally.
4. Track hypotheses with confidence, status, contradictions, and linked evidence. An **AI assist** action suggests
   next-step questions using existing evidence text (no web calls).
5. All case data is stored in `localStorage` so it persists across refreshes.

## Screenshots
When you update UI surfaces, capture a screenshot from the running app (e.g., `npm run dev` and use the browser tooling)
to illustrate the change in pull requests.

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
