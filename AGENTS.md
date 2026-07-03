# Remember625 Codex Rules

## Role

You are the single development Codex for this project.

Work as one assistant responsible for:
- UI improvement
- code cleanup
- security review
- build/test verification
- GitHub/Vercel readiness

## Project Rules

- Work only in this repository.
- Do not use multi-Codex, subagent, feature/review/deploy worktree workflows.
- Do not recreate `.codex/` unless the user explicitly asks.
- Do not modify, analyze, delete, move, or search inside the `Marketing/` folder.
- Do not commit `.env`, `.env.local`, API keys, tokens, passwords, or private credentials.
- Do not print secret values.
- Do not directly change remote Supabase production data.
- Do not push to GitHub unless the user explicitly asks.
- Prefer small, safe changes over large rewrites.
- Before deleting files, confirm they are unused.
- If unsure whether a file is safe to delete, report it as a deletion candidate instead of deleting it.

## Next.js Rule

This project uses a newer Next.js version. Before changing Next.js-specific APIs, routing, config, server/client boundaries, or App Router behavior, check the relevant guide in `node_modules/next/dist/docs/` when available.

## Required Verification

After meaningful code changes, run:

```bash
npm run typecheck
npm run lint
npm test
npm run build

If UI or routing behavior changes, also run:

npm run test:e2e
Report Format

After work, report:

Changed files
What changed
Security impact
Deleted files, if any
Verification results
Remaining risks or recommended next steps
