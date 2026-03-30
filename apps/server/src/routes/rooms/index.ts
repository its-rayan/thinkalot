import { Router } from "express";

export const roomsRouter = Router();

roomsRouter.post("/", (req, res) => {
  res.send("Create a new room");
});

roomsRouter.get("/", (req, res) => {
  res.send("List of rooms");
});

roomsRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  res.send(`Get room with ID: ${id}`);
});
