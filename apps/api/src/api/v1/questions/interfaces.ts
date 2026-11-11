import { type Static, Type } from "typebox";

export const QuestionParamsSchema = Type.Object({
  date: Type.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$" }),
});
export type QuestionParamsType = Static<typeof QuestionParamsSchema>;

export const QuestionGuessBodySchema = Type.Object({
  questionId: Type.String(),
  // Omitted when the player runs out of time without answering.
  guess: Type.Optional(Type.String({ minLength: 1 })),
});
export type QuestionGuessBodyType = Static<typeof QuestionGuessBodySchema>;
