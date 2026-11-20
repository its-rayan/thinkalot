# Adding questions

Questions live in two places, both committed to git:

- **The bank**, `apps/api/src/db/question-bank.json`: every question ever written. Each one is a `draft` until you approve it, and gets a `usedOn` date once it's scheduled. A question is never scheduled twice.
- **The daily files**, `apps/api/src/db/questions/drafts/<YYYY-MM>.json`: the 8 questions for each day. The API only reads these, so new days go live when you deploy.

## The routine

Run these from the repo root. A month of games needs about 240 questions.

1. **Write questions with Claude.**
   `pnpm --filter api questions:write 250`
   Add `--category Sport` (or any category) to fill a gap. Claude writes the questions, and a separate request answers each one without seeing the answer key. Questions it answers differently, or that repeat something in the bank, are dropped; ones it's unsure about are kept with a note. Needs `ANTHROPIC_API_KEY` in `apps/api/.env` (see `apps/api/.env.example`).
2. **Review them.**
   `pnpm --filter api questions:review`
   Shows each draft, flagged ones first. Approve, reject or skip. To fix wording, skip it, edit the bank file, and approve it next time. You can quit and carry on later.
3. **Schedule them.**
   `pnpm --filter api questions:schedule --through 2026-12-31`
   Fills every day without a game up to that date, with up to 2 questions per category per day, easiest first. Days that already have a game are left alone.
4. **Check, commit and deploy.**
   `pnpm --filter api questions:check`
   Commit the bank and the daily files together.

## Replacing days that are already scheduled

`--rebuild-from` clears that day and every later one, returns their questions to the bank as unused, and schedules them again:

`pnpm --filter api questions:schedule --through 2026-12-31 --rebuild-from 2026-11-20`

It refuses any date that may already be in play somewhere in the world, and changes nothing unless it can fill every day up to `--through`.

## Alerts

The **Question supply** GitHub Action runs `questions:check` every day at 08:00 UTC. It fails, and GitHub emails you, when:

- fewer than 14 days from today have a game, or
- a game that hasn't started anywhere yet repeats a question from another day.

The output tells you which command to run.
