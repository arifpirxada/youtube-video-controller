import { Router } from "express";
import { addComment } from "../services/youtube.service";

const router = Router();

router.get("/comments/:videoId", (req, res) => {});

router.post("/comments/:videoId", async (req, res) => {
  const { text } = req.body;

  const comment = await addComment(req.params.videoId, text);

  res.json(comment);
});

router.post("/comments/reply/:commentId", (req, res) => {});

router.delete("/comments/:commentId", (req, res) => {});

export default router;
