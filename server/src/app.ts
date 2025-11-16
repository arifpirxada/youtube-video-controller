import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// Route imports
import videoRoutes from "./routes/video.route"
import commentRoutes from "./routes/comments.route"
import eventRoutes from "./routes/event.route"
import noteRoutes from "./routes/note.route"
import authRoutes from "./routes/auth.route"

import { youtubeAuth } from './middlewares/youtubeAuth';
import { youtube } from './utils/googleClient';

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running...")
});

app.get("/test", youtubeAuth, async (req, res) => {
  const data = await youtube.channels.list({
    part: ["snippet"],
    mine: true,
  });

  res.json(data.data);
});

app.use("/auth", authRoutes)

app.use(youtubeAuth, videoRoutes);
app.use(youtubeAuth, commentRoutes);
app.use(youtubeAuth, eventRoutes);
app.use(youtubeAuth, noteRoutes);


export default app;