import { Router } from "express";
import { createGame, getGames } from "@routes/games/controller";

export const gamesRouter = Router();

gamesRouter.post("/", createGame);

gamesRouter.get("/", getGames);

gamesRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  res.json({ message: `Get game with ID: ${id}` });
});
