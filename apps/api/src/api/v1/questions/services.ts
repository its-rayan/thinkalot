import fs from "node:fs/promises";
import { getDraftFilePath } from "../../../utils/files.js";
import type { DailyQuiz } from "./domain.js";

/**
 * Reads a month's questions. The files are committed to the repo and only
 * ever read at runtime; add questions with `pnpm questions:generate`.
 */
export async function readQuestionFile(month: string) {
  const filePath = getDraftFilePath(month);

  try {
    const json = await fs.readFile(filePath, "utf8");

    return JSON.parse(json) as DailyQuiz[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }

    throw error;
  }
}
