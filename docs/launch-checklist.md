# Launch checklist

Everything Thinkalot needs before launch, in priority order. Items marked **Do first** are the four that make the game safe to put in front of people.

Tick an item by changing `- [ ]` to `- [x]`.

Live version (shared progress): https://claude.ai/artifact/CSUXFgN7Z7aBr8YEfjqSBD

## Blockers

Without these the game won't work in production, or can be broken.

- [ ] **Read the API URL from an environment variable** · _Do first_\
  The web app always calls `http://localhost:3000`, so the deployed site can't reach the API. Use something like `VITE_API_URL`.\
  `apps/web/src/features/daily-games/api/questions.ts:38`
- [ ] **Lock down the admin endpoint** · _Do first_\
  `GET /api/v1/admin/questions/:month` needs no login and rewrites a month's question file. Add authentication (even a secret header) and make it a `POST`.\
  `apps/api/src/api/v1/admin/routes.ts`
- [ ] **Store questions somewhere permanent** · _Do first_\
  Questions are files on the server's disk, which Render wipes on each deploy unless a persistent disk is attached. Use a database, or commit the files and stop writing them at runtime.\
  `apps/api/src/utils/files.ts`
- [ ] **Block guesses for future dates** · _Do first_\
  The guess endpoint reveals the answer to any question, including future days. Reject dates after today on the server, allowing about one day either side for timezones.\
  `apps/api/src/api/v1/questions/controller.ts`
- [ ] **Keep the question supply topped up**\
  Questions run out on Dec 11. Set up a regular way to add more, and an alert when fewer than about 14 days are left.\
  `apps/api/src/db/questions/drafts/`

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
  `apps/api/src/api/v1/admin/questions/services.ts`
- [ ] **Check the questions for accuracy**\
  Review each day's questions before they go live. The drafts folder suggests this step was planned.
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
