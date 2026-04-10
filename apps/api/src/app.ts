import express from "express";
import { gamesRouter } from "@routes/games";

const BASE_API_PATH = "/api/v1";

const app = express();

app.use(express.json());

app.use(`${BASE_API_PATH}/games`, gamesRouter);

export default app;
