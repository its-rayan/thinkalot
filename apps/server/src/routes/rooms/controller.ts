import { Request, Response } from "express";
import { createRoomSchema } from "@routes/rooms/validation";
import { db } from "@db/index";
import { rooms } from "@db/schema";

export const createRoom = async (req: Request, res: Response) => {
  try {
    // validate the request body against the schema
    const parsed = createRoomSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).send({
        code: "VALIDATION_ERROR",
        message: "Invalid request body",
        errors: JSON.stringify(parsed.error.message),
      });
    }

    const [event] = await db
      .insert(rooms)
      .values({
        ...parsed.data,
      })
      .returning();

    // broadcast the new room to all connected WebSocket clients
    if (req.app.locals.broadcast) {
      // req.app.locals.broadcast(
      //   JSON.stringify({
      //     type: "NEW_ROOM_CREATED",
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
    console.error("Error creating room:", error);
    return res.status(500).send({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create room",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
