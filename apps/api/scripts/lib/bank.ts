/**
 * Shared helpers for the question scripts: reading and writing the question
 * bank and the daily question files.
 *
 * Each bank question has a status: "draft" (written by questions:write, not
 * yet reviewed) or "approved" (reviewed, can be scheduled). Once a question is
 * scheduled for a day it gets `usedOn`, and is never scheduled again.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type {
  Category,
  DailyQuiz,
  Difficulty,
  Question,
} from "../../src/api/v1/questions/domain.js";

const here = path.dirname(fileURLToPath(import.meta.url));
export const BANK_PATH = path.resolve(here, "../../src/db/question-bank.json");
export const DRAFT_DIR = path.resolve(here, "../../src/db/questions/drafts");

/** Must match the round length the web app plays. */
export const QUESTIONS_PER_DAY = 8;

export const CATEGORIES: Category[] = [
  "General Knowledge",
  "Science",
  "History",
  "Geography",
  "Sport",
  "Entertainment",
];
export const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];
export const LETTERS = ["A", "B", "C", "D"] as const;

export interface BankQuestion extends Question {
  status: "draft" | "approved";
  /** The first date this question was scheduled for. Unset means unused. */
  usedOn?: string;
  /** Why the fact-check wants a human to look closely. */
  reviewNote?: string;
}

export async function readBank(): Promise<BankQuestion[]> {
  const data = JSON.parse(await fs.readFile(BANK_PATH, "utf8"));
  return data.questions as BankQuestion[];
}

export async function writeBank(questions: BankQuestion[]) {
  await writeJson(BANK_PATH, { questions });
}

export function monthFilePath(month: string) {
  return path.join(DRAFT_DIR, `${month}.json`);
}

export async function readMonth(month: string): Promise<DailyQuiz[]> {
  try {
    return JSON.parse(await fs.readFile(monthFilePath(month), "utf8"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export async function writeMonth(month: string, days: DailyQuiz[]) {
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  await fs.mkdir(DRAFT_DIR, { recursive: true });
  await writeJson(monthFilePath(month), sorted);
}

/** Months that already have a daily question file, e.g. ["2026-11"]. */
export async function listMonths() {
  const files = await fs.readdir(DRAFT_DIR).catch(() => []);
  return files
    .filter((file) => /^\d{4}-\d{2}\.json$/.test(file))
    .map((file) => file.slice(0, 7))
    .sort();
}

async function writeJson(filePath: string, data: unknown) {
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

/**
 * Lowercase, punctuation-free text for spotting the same question twice.
 * Keep in step with normalise() in check-question-supply.mjs.
 */
export function normalise(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

/** The next free bank ID, continuing the "001", "002", … sequence. */
export function nextId(bank: BankQuestion[]) {
  const highest = Math.max(0, ...bank.map((q) => Number(q.id) || 0));
  return String(highest + 1).padStart(3, "0");
}

/** Fisher–Yates shuffle, so every order is equally likely. */
export function shuffle<T>(items: T[]) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** YYYY-MM-DD in the local timezone. */
export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isDateString(value: string) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    formatDate(new Date(`${value}T00:00:00`)) === value
  );
}

/** Every date from `from` to `to`, inclusive. */
export function datesBetween(from: string, to: string) {
  const dates: string[] = [];
  const cursor = new Date(`${from}T00:00:00`);
  while (formatDate(cursor) <= to) {
    dates.push(formatDate(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

/** Reads a `--name value` flag from the command line. */
export function getFlag(name: string) {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}
