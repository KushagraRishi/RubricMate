# RubricMate

Turn an assignment rubric into a checklist you can tick off.

Load the rubric for your assignment, write your draft, and RubricMate tells you
which requirements you have met, which are half done, and what to fix next.

**Live demo:** https://rubric-mate.vercel.app

> Deployment-specific URLs like `rubric-mate-<hash>.vercel.app` are pinned to
> the build that created them and never pick up later environment variables or
> code. Use the project domain above.

## How it works

Three serverless functions sit behind a React single-page app:

| Route | What it does | Model |
|---|---|---|
| `POST /api/extract` | Reads rubric text into structured criteria | Haiku 5.5 |
| `POST /api/check` | Scores a draft against those criteria | Sonnet 5.5 |
| `POST /api/chat` | Answers questions about the rubric or the draft | Haiku 5.5 |

Models were picked by running the same rubric and essay through all three.
Extraction and chat came out identical on Haiku, so they run on Haiku.
Marking a draft did not. The sample essay ends without a conclusion on
purpose, and Haiku called the structure done where Sonnet and Opus both
caught it, even at high effort.

Two further things, also measured:

- **The fixed part of each prompt is cached.** A repeat check pays a tenth of
  the input price on it. Chat's prompt is under the 512-token minimum, so it
  does not cache, so the marker is there and simply never fires.
- **Reasoning is off for extraction, on for checking.** Off halved extraction's
  output tokens and made the criteria list more consistent. On the check it
  measured the same price either way over repeated runs, so it stays on as a
  margin for inputs harder than the sample.

**About 1.6c per session** (one extract, two checks, two chats), down from
8.3c on Opus throughout, with identical results on every test.

Override any of it without a code change:
`EXTRACT_MODEL`, `CHECK_MODEL`, `CHAT_MODEL`,
`EXTRACT_EFFORT`, `CHECK_EFFORT`, `CHAT_EFFORT`,
`EXTRACT_THINKING`, `CHECK_THINKING`, `CHAT_THINKING` (`off` to disable).

Every call logs its model, tokens, cache hits and cost to the function log.

Both of the first two use structured outputs with a Zod schema, so the response
is validated against that schema before it arrives. The same schema file types
the React components.

### The split that matters

Criteria come back marked measurable or not.

- **Measurable.** A word count, a minimum number of citations. Evaluated in the
  browser on every keystroke. Instant, exact, free.
- **Everything else.** Is this a real thesis, is there a conclusion. Sent to the
  model when you press **Check my draft**.

That is why the word counter moves while you type but the feedback does not.

### Other notes

- Rubric files (PDF, `.docx`, `.txt`) are turned into text **in the browser**.
  The functions stay small and JSON-only, and a large PDF never crosses the wire.
  The parsers are loaded on demand, so they cost nothing unless you upload. The
  same goes for the HEIC decoder behind inserting an iPhone photo, and for the
  PDF and Word writers behind Export. None of them is in the first load, and
  most people never touch any of them.
- No database, no accounts. A session lives in React state.
- The demo runs on one personal API key in public, so input size, output size
  and requests per visitor are all capped.

## Running it locally

```bash
npm install
cp .env.example .env.local   # add your ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:5173.

`npm run dev` serves `/api/*` from the same handler files Vercel deploys. A
small Vite plugin (`vite-plugin-dev-api.ts`) mounts them, so what you test
locally is what ships.

| Script | |
|---|---|
| `npm run dev` | Dev server, including the API routes |
| `npm run build` | Production build to `dist/` |
| `npm run typecheck` | `tsc --noEmit` |

## Deploying to Vercel

1. Import the repo. Vercel detects Vite; no build settings to change.
2. Add `ANTHROPIC_API_KEY` as an environment variable.
3. Deploy.

`vercel.json` rewrites non-`/api` paths to `index.html` so client-side routing
works on a hard refresh.

### Optional: shared rate limiting

Without a store, the per-visitor limit lives in each function instance's memory,
which only catches one person hammering a warm instance. Set
`UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (Upstash has a free
tier) and the limit becomes shared and real. If the store is unreachable the
demo keeps working rather than failing closed.

## Built with

React 18, Vite 6, Tailwind v4, shadcn/ui, Radix, Motion, Zod, and the Anthropic
TypeScript SDK.

The interface began as a Figma Make export: three hardcoded screens with every
score typed in by hand. The colours, cards, status badges and collapsing
feedback panels are the originals; what changed is that the numbers in them are
now real.
