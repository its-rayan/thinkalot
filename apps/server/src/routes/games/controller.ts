import { Request, Response } from "express";
import { createGameSchema } from "@routes/games/validation";
import { db } from "@db/index";
import { games } from "@db/schema";
import { GameMode, MAX_PLAYERS } from "./constants";

export const createGame = async (req: Request, res: Response) => {
  try {
    const validation = createGameSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).send({
        code: "VALIDATION_ERROR",
        message: "Invalid request body",
        errors: JSON.stringify(validation.error.message),
      });
    }

    const { data } = validation;

    const [event] = await db
      .insert(games)
      .values({
        ...data,
        maxPlayers:
          data.mode === GameMode.DUEL
            ? MAX_PLAYERS[GameMode.DUEL]
            : MAX_PLAYERS[GameMode.MULTIPLAYER],
      })
      .returning();

    // broadcast the new game to all connected WebSocket clients
    if (req.app.locals.broadcast) {
      // req.app.locals.broadcast(
      //   JSON.stringify({
      //     type: "NEW_GAME_CREATED",
      //     data: event,
      //   }),
      // );
      req.app.locals.broadcast(event);
    }

    return res.status(201).json({
      status: "success",
      data: event,
    });
  } catch (error) {
    console.error("Error creating game:", error);
    return res.status(500).send({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create game",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
