import { Request, Response } from "express";
import { desc } from "drizzle-orm";
import { createGameSchema, getGamesSchema } from "@routes/games/validation";
import { db } from "@db/index";
import { games } from "@db/schema";
import {
  GameMode,
  MAX_GAMES_DATA_LIMIT,
  MAX_PLAYERS,
} from "@routes/games/constants";

export const createGame = async (req: Request, res: Response) => {
  try {
    const validation = createGameSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).send({
        code: "VALIDATION_ERROR",
        message: "Invalid request body",
        errors: validation.error.issues,
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
    });
  }
};

export const getGames = async (req: Request, res: Response) => {
  try {
    const validation = getGamesSchema.safeParse(req.query);
    if (!validation.success) {
      return res.status(400).send({
        code: "VALIDATION_ERROR",
        message: "Invalid query parameters",
        errors: validation.error.issues,
      });
    }

    const { data } = validation;
    const limit = Math.min(data.limit ?? 50, MAX_GAMES_DATA_LIMIT);

    const allGames = await db
      .select()
      .from(games)
      .orderBy(desc(games.createdAt))
      .limit(limit);

    return res.status(200).json({
      status: "success",
      data: allGames,
    });
  } catch (error) {
    console.error("Error fetching games:", error);
    return res.status(500).send({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch games",
    });
  }
};
