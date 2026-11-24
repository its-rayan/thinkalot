import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

/** The committed daily question files, one per month (see docs/questions.md). */
const DAILY_FILES_DIR = path.resolve(
  import.meta.dirname,
  "../api/src/db/questions/drafts",
);

const QUESTIONS_URL = /^\/questions\/(\d{4}-\d{2}-\d{2})\.json$/;

interface DailyQuiz {
  date: string;
  questions: unknown[];
}

/** Every scheduled day's questions, keyed by YYYY-MM-DD. */
function readDailyQuestions() {
  const days = new Map<string, unknown[]>();

  for (const file of fs.readdirSync(DAILY_FILES_DIR)) {
    if (!file.endsWith(".json")) continue;

    const monthly = JSON.parse(
      fs.readFileSync(path.join(DAILY_FILES_DIR, file), "utf8"),
    ) as DailyQuiz[];

    for (const day of monthly) days.set(day.date, day.questions);
  }

  return days;
}

/**
 * Publishes each day's questions as static JSON at /questions/YYYY-MM-DD.json,
 * so the site needs no API. In dev the files are read on every request, so
 * edits show up without restarting; in a build they're written into dist.
 */
export default function questionsPlugin(): Plugin {
  return {
    name: "thinkaday-questions",

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const date = req.url?.split("?")[0].match(QUESTIONS_URL)?.[1];
        if (!date) return next();

        const questions = readDailyQuestions().get(date);
        if (!questions) {
          res.statusCode = 404;
          res.end();
          return;
        }

        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(questions));
      });
    },

    generateBundle() {
      for (const [date, questions] of readDailyQuestions()) {
        this.emitFile({
          type: "asset",
          fileName: `questions/${date}.json`,
          source: JSON.stringify(questions),
        });
      }
    },
  };
}
