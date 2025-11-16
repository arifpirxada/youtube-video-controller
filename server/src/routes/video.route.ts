import { Router } from "express";
import { getVideoDetails, updateVideoDetails } from "../services/youtube.service";
import noteModel from "../models/note.model";

const router = Router();

router.get("/video/details/:id", async (req, res) => {
  try {
    const videoId = req.params.id;

    const video = await getVideoDetails(videoId);
    // Optional test-mode: bypass notes DB if TEST_MOCK_NOTES is true
    const shouldMockNotes = process.env.TEST_MOCK_NOTES === 'true';
    const notes = shouldMockNotes ? [] : await noteModel.find({ videoId });

    res.json({
      video,
      notes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch video");
  }
});

router.patch("/video/update/:id", async (req, res) => {
  const { title, description } = req.body;

  const response = await updateVideoDetails(req.params.id, title, description);

  // Log event after update
  try {
    const { default: EventModel } = await import("../models/event.model");
    if (title) {
      const eventLog = new EventModel({
        videoId: req.params.id,
        event: `Updated video title to "${title}, and description to "${description}"`,
      });
      await eventLog.save();
    }
  } catch (e) {
    console.error("Failed to log video update event", e);
  }

  res.json(response);
});

export default router;
