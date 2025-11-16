import { Router } from "express";
import { addComment, getComments, replyToComment, deleteComment } from "../services/youtube.service";

const router = Router();

router.get("/comments/:videoId", async (req, res) => {
  try {
    const data = await getComments(req.params.videoId);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? "Failed to fetch comments" });
  }
});

router.post("/comments/:videoId", async (req, res) => {
  const { text } = req.body;

  const comment = await addComment(req.params.videoId, text);

  res.json(comment);
});

router.post("/comments/reply/:commentId", async (req, res) => {
  const { text } = req.body;
  try {
    const reply = await replyToComment(req.params.commentId, text);
    res.json(reply);
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? "Failed to post reply" });
  }
});

router.delete("/comments/:commentId", async (req, res) => {
  try {
    const result = await deleteComment(req.params.commentId);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? "Failed to delete comment" });
  }
});

export default router;
