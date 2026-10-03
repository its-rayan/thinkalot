import { type Static, Type } from "typebox";

export const QuestionParamsSchema = Type.Object({
  date: Type.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$" }),
});
// Infer the TypeScript type automatically
export type QuestionParamsType = Static<typeof QuestionParamsSchema>;
