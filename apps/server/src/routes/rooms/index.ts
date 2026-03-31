import { Router } from "express";
import { createRoom } from "./controller";

export const roomsRouter = Router();

roomsRouter.post("/", createRoom);

roomsRouter.get("/", (req, res) => {
  res.json({ message: "List of rooms" });
});

roomsRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  res.json({ message: `Get room with ID: ${id}` });
});
