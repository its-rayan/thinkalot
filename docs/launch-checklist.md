# Launch checklist

Everything Thinkalot needs before launch, in priority order. Items marked **Do first** are the four that make the game safe to put in front of people.

Tick an item by changing `- [ ]` to `- [x]`.

Live version (shared progress): https://claude.ai/artifact/CSUXFgN7Z7aBr8YEfjqSBD

## Blockers

Without these the game won't work in production, or can be broken.

- [x] **Read the API URL from an environment variable** · _Do first_\
  The web app always calls `http://localhost:3000`, so the deployed site can't reach the API. Use something like `VITE_API_URL`.\
  `apps/web/src/features/daily-games/api/questions.ts:38`\
  **Done 17 Nov:** the web app reads `VITE_API_URL` and falls back to `http://localhost:3000` only in development. Production builds fail with a clear message if it's missing or doesn't start with `http(s)://`, so a broken site can't be deployed. All web env vars are documented in `apps/web/.env.example`. **Action:** set `VITE_API_URL` in the web app's deploy environment and in your local `apps/web/.env`.
- [x] **Lock down the admin endpoint** · _Do first_\
  `GET /api/v1/admin/questions/:month` needs no login and rewrites a month's question file. Add authentication (even a secret header) and make it a `POST`.\
  `apps/api/src/api/v1/admin/routes.ts`\
  **Done 17 Nov:** removed the admin endpoint from the API entirely (it now returns 404), so there's nothing to protect. Generating questions moved to a local script; see the next item.
- [x] **Store questions somewhere permanent** · _Do first_\
  Questions are files on the server's disk, which Render wipes on each deploy unless a persistent disk is attached. Use a database, or commit the files and stop writing them at runtime.\
  `apps/api/src/utils/files.ts`\
  **Done 17 Nov:** question files stay committed in `apps/api/src/db/questions/drafts/`, and the API only reads them; it no longer writes or creates anything on disk. To add questions, follow `docs/questions.md`: write them with Claude, review and approve them, schedule them, then commit and deploy. Scheduling only adds missing days and never changes existing days unless you ask it to rebuild.
- [x] **Block guesses for future dates** · _Do first_\
  The guess endpoint reveals the answer to any question, including future days. Reject dates after today on the server, allowing about one day either side for timezones.\
  `apps/api/src/api/v1/questions/controller.ts`\
  **Done 17 Nov:** a date is playable once it has started somewhere in the world (today's date in UTC+14), so every player can play their own local today but nobody can reach tomorrow early. Guesses for later dates get a `403`. Questions for later dates come back empty, which the web app shows as "No game today", so questions don't leak early either. Logic in `apps/api/src/utils/dates.ts`.
- [x] **Keep the question supply topped up**\
  Questions run out on Dec 11. Set up a regular way to add more, and an alert when fewer than about 14 days are left.\
  `apps/api/src/db/questions/drafts/`\
  **Done 17 Nov:** `pnpm --filter api questions:check` reports how many days are ready, and the daily **Question supply** GitHub Action (`.github/workflows/question-supply.yml`, 08:00 UTC) fails when fewer than 14 days are left, which emails you.\
  **Updated 18 Nov:** questions are now written by Claude and approved by you, so the supply isn't limited by the bank (see `docs/questions.md`). The check also reports spare approved questions in the bank and fails when an upcoming game repeats a question. **Action:** the bank still has only the original 8 questions, and every scheduled day repeats them, so the check fails until you write, approve and schedule new ones (see "Stop the same question appearing on several days" below).

## Fairness and cheating

Fine to launch casually without some of these, but decide on each.

- [ ] **Add rate limiting to the API**\
  Use `@fastify/rate-limit` so nobody can hammer the guess endpoint.\
  `apps/api/src/app.ts`
- [ ] **Only allow your own site to call the API**\
  CORS is currently `origin: "*"`, so any website can call it.\
  `apps/api/src/app.ts`
- [ ] **Decide how to handle replays**\
  Quitting, clearing site data or reloading (which restarts the timer) lets a player retry a day. For streaks or leaderboards, record results on the server under an anonymous player ID.\
  `apps/web/src/features/daily-games/store/use-game-progress.ts`

## What players will notice

Polish that affects first impressions and how far the game spreads.

- [ ] **Take the number of questions from the API**\
  The home page says "10 questions" but the game has 8, and 8 is hard-coded in two stores.\
  `apps/web/src/routes/index.tsx`
- [ ] **Make the results headline depend on the score**\
  It says "Not bad!" whatever the score.\
  `apps/web/src/features/results/feature-root.tsx`
- [ ] **Style the loading and error screens**\
  They're bare text (`<div>Loading...</div>`) while everything else is styled.\
  `apps/web/src/features/daily-games/feature-root.tsx`
- [ ] **Add a page title, favicon and link previews**\
  The title is "web" and there are no Open Graph tags, so links shared in WhatsApp or iMessage get a blank preview.\
  `apps/web/index.html`
- [ ] **Stop the same question appearing on several days**\
  `getRandomQuestions` picks from the bank each day without checking earlier days.\
  `apps/api/scripts/schedule-questions.ts`\
  **Tooling done 18 Nov:** each bank question records the date it was first scheduled (`usedOn`) and is never scheduled again, and the daily check fails if an upcoming game repeats a question. **Still to do:** every day from 13 Nov to 11 Dec reuses the same 8 questions. Write and approve about 250 questions, then run `pnpm --filter api questions:schedule --through 2026-12-31 --rebuild-from <date>` with the date the check suggests (the earliest day not yet in play anywhere), and commit. Tick this once the check passes.
- [ ] **Check the questions for accuracy**\
  Review each day's questions before they go live. The drafts folder suggests this step was planned.\
  **Tooling done 18 Nov:** a second Claude request answers each new question without seeing the answer key and drops disagreements, and `pnpm --filter api questions:review` makes you approve every question before it can be scheduled. Tick this once the bank's questions have been through review.
- [ ] **Remove debugging output**\
  `console.log` calls are still in the questions hook.\
  `apps/web/src/features/daily-games/hooks/useQuestions.ts`

## Operations

So you find problems before players do.

- [ ] **Run lint and build on every push**\
  A GitHub Action running `pnpm lint` and `pnpm build` would have caught the broken build before the failed deploy.\
  `.github/workflows/`
- [ ] **Add tests for the core rules**\
  Start with the date rollover, the share text and the play-once-per-day redirects.
- [ ] **Add error monitoring**\
  For example Sentry, on both the web app and the API.
- [ ] **Add analytics**\
  Track whether people finish the game and share their score, for example with Plausible.
- [ ] **Add a privacy notice if you collect analytics**\
  Depending on where your players are, analytics may require one.
