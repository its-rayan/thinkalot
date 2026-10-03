import fs from "node:fs/promises";
import { ensureDirectories, getDraftFilePath } from "../../../utils/files.js";
import type { DailyQuiz } from "../admin/questions/domain.js";

export async function readQuestionFile(month: string) {
  // check/create directory
  await ensureDirectories();

  const filePath = getDraftFilePath(month);

  try {
    const json = await fs.readFile(filePath, "utf8");

    return JSON.parse(json) as DailyQuiz[];
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return null;
    }

    throw error;
  }
}
