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

  // Log event after adding comment
  try {
    const { default: EventModel } = await import("../models/event.model");
    const eventText = `Added comment: "${text?.slice(0, 100) ?? ''}"`;
    const eventLog = new EventModel({ videoId: req.params.videoId, event: eventText });
    await eventLog.save();
  } catch (e) {
    console.error("Failed to log added comment event", e);
  }

  res.json(comment);
});

router.post("/comments/reply/:commentId", async (req, res) => {
  const { text } = req.body;
  try {
    const reply = await replyToComment(req.params.commentId, text);

    // Log event for reply (videoId not readily available from route)
    try {
      const { default: EventModel } = await import("../models/event.model");
      const eventText = `Posted reply to comment ${req.params.commentId}: "${text?.slice(0, 100) ?? ''}"`;
      const eventLog = new EventModel({ videoId: "unknown", event: eventText });
      await eventLog.save();
    } catch (e) {
      console.error("Failed to log comment reply event", e);
    }

    res.json(reply);
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? "Failed to post reply" });
  }
});

router.delete("/comments/:commentId", async (req, res) => {
  try {
    const result = await deleteComment(req.params.commentId);

    // Log event for delete (videoId not readily available from route)
    try {
      const { default: EventModel } = await import("../models/event.model");
      const eventText = `Deleted comment ${req.params.commentId}`;
      const eventLog = new EventModel({ videoId: "unknown", event: eventText });
      await eventLog.save();
    } catch (e) {
      console.error("Failed to log deleted comment event", e);
    }

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? "Failed to delete comment" });
  }
});

export default router;
