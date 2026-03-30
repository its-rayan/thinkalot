import express from "express";
import { roomsRouter } from "./routes/rooms";

const BASE_API_PATH = "/api/v1";

const app = express();

app.use(express.json());

app.use(`${BASE_API_PATH}/rooms`, roomsRouter);

export default app;
