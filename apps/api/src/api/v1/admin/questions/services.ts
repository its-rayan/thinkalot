import fs from "node:fs/promises";
import questionBank from "../../../../db/question-bank.json" with {
  type: "json",
};
import {
  ensureDirectories,
  getDraftFilePath,
} from "../../../../utils/files.js";
import type { DailyQuiz, Question } from "./domain.js";

function getRandomQuestions(
  bank: Question[],
  count: number = 10,
  dateString: string,
) {
  const shuffled = [...bank]
    .sort(() => 0.5 - Math.random())
    .map((question, index) => ({
      ...question,
      id: `${dateString}-q${index + 1}`,
    }));
  return shuffled.slice(0, Math.min(count, bank.length));
}

export async function writeQuestionsFile(
  month: string,
  data: DailyQuiz[],
): Promise<void> {
  // check/create directory
  await ensureDirectories();

  const filePath = getDraftFilePath(month);

  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

export async function generateQuestions(): Promise<DailyQuiz[]> {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed (0 = January, 11 = December)

  // Find the last day of the current month
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
  const startDay = today.getDate();

  const daysList = [];

  for (let day = startDay; day <= lastDayOfMonth; day++) {
    const currentDate = new Date(year, month, day);

    // Format local date safely as YYYY-MM-DD without UTC shift
    const fYear = currentDate.getFullYear();
    const fMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
    const fDay = String(currentDate.getDate()).padStart(2, "0");
    const dateString = `${fYear}-${fMonth}-${fDay}`;

    daysList.push({
      date: dateString,
      questions: getRandomQuestions(
        questionBank.questions as Question[],
        10,
        dateString,
      ), // Pick 10 random questions per day
    });
  }

  return daysList;
}
