import { Router } from "express";
import { getVideoDetails, updateVideoDetails } from "../services/youtube.service";
import noteModel from "../models/note.model";

const router = Router();

router.get("/video/details/:id", async (req, res) => {
  try {
    const videoId = req.params.id;

    const video = await getVideoDetails(videoId);
    const notes = await noteModel.find({ videoId });

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

  res.json(response);
});

export default router;
