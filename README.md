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
- Detail modal with links, notes, copy-to-clipboard for commands when provided, and a sandboxed runner
- Favorites stored in `localStorage`
- API route at `/api/tools` to consume the generated catalog
- Streaming sandbox executor at `/api/run` that only launches whitelisted tools inside Docker

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
- All executions initiated from the UI are sandboxed with `docker run` using a whitelist defined in `data/allowed-tools.json`.
- The backend validates tool IDs and streams output via Server-Sent Events; it never shells out to arbitrary commands.
- A warning banner in the UI reminds users to operate within legal and ethical boundaries.

## Running OSINT tools in the sandbox
Use the detail modal for a tool that has a matching entry in `data/allowed-tools.json`. Provide arguments and start the run to
see combined stdout/stderr logs. When the container writes files to the mounted output directory, the UI lists them for
download via `/api/run/{runId}/artifact`.

### How to add a new runnable tool safely
1. Build or choose a container image that already contains the tool. Prefer images that do not run as root and avoid mounting
   extra host paths beyond the ephemeral `/tmp/osint-runner` output folder.
2. Add an entry to `data/allowed-tools.json`:
   ```json
   {
     "id": "my-tool-id",
     "name": "My Tool",
     "description": "What it does",
     "image": "docker.io/your-org/osint-base:latest",
     "command": ["mytool"],
     "defaultArgs": ["--help"],
     "outputDir": "/output"
   }
   ```
   The `command` array is the fixed, whitelisted invocation inside the container. Only extra args supplied by the user are
   appended.
3. Confirm the tool exists in `data/tools.json` so it appears in the UI. If not, update `public/arf.json` and regenerate the
   catalog.
4. Document any additional operational guidance in the tool description or notes.

The runner only honors tools listed in `data/allowed-tools.json`; everything else remains non-executable.
