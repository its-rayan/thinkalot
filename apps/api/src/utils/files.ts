import fs from "node:fs/promises";
import path from "node:path";

const QUESTIONS_DIR = path.resolve(process.cwd(), "src/db/questions");
const DRAFT_DIR = path.join(QUESTIONS_DIR, "drafts");

export async function ensureDirectories() {
  await fs.mkdir(DRAFT_DIR, { recursive: true });
}

function validateMonth(month: string) {
  // format: YYYY-MM
  if (!/^\d{4}-\d{2}$/.test(month)) {
    throw new Error(`Invalid month: ${month}`);
  }
}

export function getDraftFilePath(month: string) {
  validateMonth(month);

  return path.join(DRAFT_DIR, `${month}.json`);
}
