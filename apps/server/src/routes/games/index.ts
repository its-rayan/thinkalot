import { Router } from "express";
import { createGame } from "@routes/games/controller";

export const gamesRouter = Router();

gamesRouter.post("/", createGame);

gamesRouter.get("/", (req, res) => {
  res.json({ message: "List of games" });
});

gamesRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  res.json({ message: `Get game with ID: ${id}` });
});
